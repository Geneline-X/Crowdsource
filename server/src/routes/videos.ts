import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const extension = path.extname(file.originalname) || '.mp4';
    cb(null, `${timestamp}-${randomString}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, WebM, MOV, and AVI files are allowed.'));
    }
  }
});

// Get all videos
router.get('/', async (req: Request, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch videos');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch videos'
    });
  }
});

// Upload videos (from Next.js API)
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { videos } = req.body;

    if (!videos || !Array.isArray(videos)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid videos data'
      });
    }

    const savedVideos = [];

    for (const videoData of videos) {
      const video = await prisma.video.create({
        data: {
          id: videoData.id,
          filename: videoData.filename,
          originalName: videoData.originalName,
          mimeType: videoData.mimeType,
          size: videoData.size,
          url: videoData.url,
          uploadedAt: new Date(videoData.uploadedAt)
        }
      });
      savedVideos.push(video);
    }

    logger.info({ count: savedVideos.length }, 'Videos uploaded successfully');

    res.json({
      success: true,
      videos: savedVideos
    });
  } catch (error) {
    logger.error({ error }, 'Failed to save videos to database');
    res.status(500).json({
      success: false,
      error: 'Failed to save videos'
    });
  }
});

// Upload videos directly (multipart form data)
router.post('/direct-upload', upload.array('videos', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No videos uploaded'
      });
    }

    const savedVideos = [];

    for (const file of files) {
      const video = await prisma.video.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/videos/${file.filename}`,
          uploadedAt: new Date()
        }
      });
      savedVideos.push(video);
    }

    logger.info({ count: savedVideos.length }, 'Videos uploaded directly');

    res.json({
      success: true,
      videos: savedVideos
    });
  } catch (error) {
    logger.error({ error }, 'Failed to upload videos directly');
    res.status(500).json({
      success: false,
      error: 'Failed to upload videos'
    });
  }
});

// Get single video by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            description: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    logger.error({ error, videoId: req.params.id }, 'Failed to fetch video');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video'
    });
  }
});

// Delete video
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const video = await prisma.video.findUnique({
      where: { id }
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', 'videos', video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.video.delete({
      where: { id }
    });

    logger.info({ videoId: id }, 'Video deleted successfully');

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    logger.error({ error, videoId: req.params.id }, 'Failed to delete video');
    res.status(500).json({
      success: false,
      error: 'Failed to delete video'
    });
  }
});

export default router;
