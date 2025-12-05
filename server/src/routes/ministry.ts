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

export default router;
