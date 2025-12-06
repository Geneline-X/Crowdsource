import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import { ToolDefinition, ToolHandler } from "./types";
import { logger } from "../logger";

export const uploadImageTool: ToolDefinition = {
    type: "function",
    function: {
        name: "upload_image",
        description: "Upload an image to S3 and return the URL. Can use image from current message context if available.",
        parameters: {
            type: "object",
            properties: {
                image: {
                    type: "string",
                    description: "Base64 encoded image data (optional if image is in context)",
                },
            },
            required: [],
        },
    },
};

export const uploadImageHandler: ToolHandler = async (args, context) => {
    let { image } = args;
    const { prisma, currentUserPhone, currentProblemContext, currentMediaContext } = context;

    // If no image provided in args, or if it looks like a filename (short string), check context
    if ((!image || image.length < 100) && currentMediaContext?.hasMedia && currentMediaContext.data) {
        logger.info("Using image from message context (arg was missing or filename)");
        image = currentMediaContext.data;
    }

    if (!image) {
        logger.error({ phone: currentUserPhone }, "No image data provided for upload");
        return {
            success: false,
            error: "No image data provided",
            message: "Please provide an image to upload.",
        };
    }

    try {
        logger.info(
            { phone: currentUserPhone, imageLength: image.length },
            "Uploading image"
        );

        const s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${currentUserPhone}/${Date.now()}.jpg`,
            Body: Buffer.from(image, "base64"),
            ContentType: "image/jpeg",
        });

        await s3Client.send(putObjectCommand);

        const url = `https://s3.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${currentUserPhone}/${Date.now()}.jpg`;

        const problemId = currentProblemContext?.problemId ? parseInt(currentProblemContext.problemId) : undefined;

        if (problemId) {
            await prisma.media.create({
                data: {
                    url: url,
                    mimeType: "image/jpeg",
                    size: Buffer.byteLength(image, 'base64'),
                    problemId: problemId,
                },
            });
        }

        return {
            url: url,
        };
    } catch (error) {
        logger.error({ error, phone: currentUserPhone }, "Failed to upload image");
        // Continue without image - don't fail the whole problem report
        return {
            url: "",
        };
    }
};