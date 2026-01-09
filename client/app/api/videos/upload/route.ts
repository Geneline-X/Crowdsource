import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videos = formData.getAll('videos') as File[];
    const videoNames = formData.getAll('videoNames') as string[];

    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { error: 'No videos provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'videos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedVideos = [];
    
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const videoName = videoNames[i] || `video-${Date.now()}-${i}`;
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 9);
      const extension = video.name.split('.').pop() || 'mp4';
      const filename = `${timestamp}-${randomString}.${extension}`;
      const filepath = join(uploadsDir, filename);

      // Convert File to Buffer and save
      const bytes = await video.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      uploadedVideos.push({
        id: `${timestamp}-${randomString}`,
        originalName: videoName,
        filename: filename,
        size: video.size,
        mimeType: video.type,
        url: `/uploads/videos/${filename}`,
        uploadedAt: new Date().toISOString()
      });
    }

    // Forward to backend server for database storage
    try {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/videos/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.API_KEY || 'your-api-key'
        },
        body: JSON.stringify({
          videos: uploadedVideos
        })
      });

      if (!backendResponse.ok) {
        console.error('Backend upload failed:', await backendResponse.text());
        // Still return success to client since files are saved locally
      }
    } catch (backendError) {
      console.error('Backend communication error:', backendError);
      // Still return success to client since files are saved locally
    }

    return NextResponse.json({
      success: true,
      uploadedCount: uploadedVideos.length,
      videos: uploadedVideos
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload videos' },
      { status: 500 }
    );
  }
}
