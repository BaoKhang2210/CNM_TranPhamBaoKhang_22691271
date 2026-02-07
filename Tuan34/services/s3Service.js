const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const { v4: uuidv4 } = require('uuid');

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

class S3Service {
    async uploadFile(file) {
        if (!file) return null;

        // Generate a unique file name
        const fileExtension = file.originalname.split('.').pop();
        const key = `${uuidv4()}.${fileExtension}`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            // ACL: 'public-read' // Note: Many buckets block ACLs now. 
            // We'll rely on Bucket Policy for public access or use Pre-signed URLs if private.
            // Assuming the bucket is configured for public read or we return the object URL.
        };

        await s3Client.send(new PutObjectCommand(params));

        // Construct standard S3 URL (virtual-hosted-style)
        // Region might be needed in URL depending on configuration
        const region = process.env.AWS_REGION || 'ap-southeast-1';
        return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
    }

    async deleteFile(fileUrl) {
        if (!fileUrl) return;

        // Extract Key from URL
        try {
            const urlParts = fileUrl.split('/');
            const key = urlParts[urlParts.length - 1];

            const params = {
                Bucket: BUCKET_NAME,
                Key: key
            };
            await s3Client.send(new DeleteObjectCommand(params));
        } catch (error) {
            console.error("Error deleting file from S3:", error);
            // Don't throw, just log. Soft/Hard delete of product shouldn't fail if image delete fails.
        }
    }
}

module.exports = new S3Service();
