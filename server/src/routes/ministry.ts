import { Router } from 'express';
import { PrismaClient, ProblemStatus } from '@prisma/client';
import { logger } from '../logger';

const router = Router();
const prisma = new PrismaClient();

// Get problems for ministry dashboard
router.get('/problems', async (req, res) => {
  try {
    const { 
      page = '1', 
      limit = '10',
      status,
      category,
      search = ''
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const where: any = {
      OR: [
        { title: { contains: search as string, mode: 'insensitive' } },
        { rawMessage: { contains: search as string, mode: 'insensitive' } },
        { locationDescription: { contains: search as string, mode: 'insensitive' } }
      ]
    };

    if (status && Object.values(ProblemStatus).includes(status as ProblemStatus)) {
      where.status = status as ProblemStatus;
    }
    if (category) where.category = category;

    // Get paginated problems with images and count
    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        include: {
          images: {
            select: {
              id: true,
              url: true,
              mimeType: true,
              size: true
            },
            take: 1 // Just get first image for thumbnail
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.problem.count({ where })
    ]);

    res.json({
      success: true,
      data: problems,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching problems for ministry dashboard');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems'
    });
  }
});

// Update problem status
router.patch('/problems/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(ProblemStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const updatedProblem = await prisma.problem.update({
      where: { id: parseInt(id) },
      data: { status: status as ProblemStatus },
      include: {
        images: true
      }
    });

    res.json({
      success: true,
      data: updatedProblem
    });
  } catch (error) {
    logger.error({ error }, 'Error updating problem status');
    res.status(500).json({
      success: false,
      message: 'Failed to update problem status'
    });
  }
});

// Analytics endpoint for ministry dashboard
router.get('/analytics', async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const daysNum = parseInt(days as string, 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Get all problems for analytics
    const allProblems = await prisma.problem.findMany({
      select: {
        id: true,
        status: true,
        nationalCategory: true,
        locationText: true,
        reporterPhone: true,
        upvoteCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Filter problems within date range for time-based analytics
    const recentProblems = allProblems.filter(
      p => new Date(p.createdAt) >= startDate
    );

    // 1. Summary stats
    const totalProblems = allProblems.length;
    const resolvedProblems = allProblems.filter(p => p.status === 'RESOLVED').length;
    const pendingProblems = allProblems.filter(p => p.status === 'REPORTED' || p.status === 'IN_REVIEW').length;
    const inProgressProblems = allProblems.filter(p => p.status === 'IN_PROGRESS').length;
    const totalUpvotes = allProblems.reduce((sum, p) => sum + p.upvoteCount, 0);

    // 2. Problems over time (daily counts for the date range)
    const problemsOverTime: { date: string; count: number; resolved: number }[] = [];
    for (let i = daysNum; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProblems = allProblems.filter(p => {
        const pDate = new Date(p.createdAt).toISOString().split('T')[0];
        return pDate === dateStr;
      });
      
      const dayResolved = allProblems.filter(p => {
        const pDate = new Date(p.updatedAt).toISOString().split('T')[0];
        return pDate === dateStr && p.status === 'RESOLVED';
      });

      problemsOverTime.push({
        date: dateStr,
        count: dayProblems.length,
        resolved: dayResolved.length,
      });
    }

    // 3. Category breakdown
    const categoryMap = new Map<string, number>();
    allProblems.forEach(p => {
      const cat = p.nationalCategory || 'Uncategorized';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 4. Status distribution
    const statusMap = new Map<string, number>();
    allProblems.forEach(p => {
      statusMap.set(p.status, (statusMap.get(p.status) || 0) + 1);
    });
    const statusDistribution = Array.from(statusMap.entries())
      .map(([name, value]) => ({ name: name.replace('_', ' '), value }));

    // 5. Top reporters (gamification)
    const reporterMap = new Map<string, { count: number; upvotes: number }>();
    allProblems.forEach(p => {
      const existing = reporterMap.get(p.reporterPhone) || { count: 0, upvotes: 0 };
      reporterMap.set(p.reporterPhone, {
        count: existing.count + 1,
        upvotes: existing.upvotes + p.upvoteCount,
      });
    });
    const topReporters = Array.from(reporterMap.entries())
      .map(([phone, data]) => ({
        phone: phone.replace(/(\d{3})\d+(\d{2})/, '$1****$2'), // Mask phone
        reports: data.count,
        upvotes: data.upvotes,
      }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 10);

    // 6. Location breakdown (top locations)
    const locationMap = new Map<string, number>();
    allProblems.forEach(p => {
      if (p.locationText) {
        // Extract district/area from location text (simplified)
        const location = p.locationText.split(',')[0].trim();
        locationMap.set(location, (locationMap.get(location) || 0) + 1);
      }
    });
    const locationBreakdown = Array.from(locationMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // 7. Resolution rate
    const resolutionRate = totalProblems > 0 
      ? Math.round((resolvedProblems / totalProblems) * 100) 
      : 0;

    // 8. Recent activity (last 7 days vs previous 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const prev7Days = new Date();
    prev7Days.setDate(prev7Days.getDate() - 14);

    const recentCount = allProblems.filter(p => new Date(p.createdAt) >= last7Days).length;
    const prevCount = allProblems.filter(p => {
      const d = new Date(p.createdAt);
      return d >= prev7Days && d < last7Days;
    }).length;
    const trendPercentage = prevCount > 0 
      ? Math.round(((recentCount - prevCount) / prevCount) * 100) 
      : recentCount > 0 ? 100 : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalProblems,
          resolvedProblems,
          pendingProblems,
          inProgressProblems,
          totalUpvotes,
          resolutionRate,
          trendPercentage,
        },
        problemsOverTime,
        categoryBreakdown,
        statusDistribution,
        topReporters,
        locationBreakdown,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching analytics');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
});

export default router;

