const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Resize base64 image function using sharp
const resizeBase64Image = async (base64Image) => {
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64'); // Get the buffer from base64
    const image = await sharp(buffer)
        .resize({ width: 800 }) // Set your desired width (or height)
        .toFormat('jpeg', { quality: 50 }) // Adjust format and quality if needed
        .toBuffer();

    return `data:image/jpeg;base64,${image.toString('base64')}`; // Return resized base64
};

// Compress image function without resizing and for any format
const compressImage = async (file) => {
    const inputBuffer = file.buffer;

    // Get the image format from the mimetype
    const format = file.mimetype.split('/')[1]; // e.g., 'jpeg', 'png'

    let compressedImageBuffer;

    // Compress based on format
    if (format === 'jpeg' || format === 'jpg') {
        compressedImageBuffer = await sharp(inputBuffer)
            .jpeg({ quality: 50 }) // Adjust quality for JPEG
            .toBuffer();
    } else if (format === 'png') {
        compressedImageBuffer = await sharp(inputBuffer)
            .png({ compressionLevel: 9 }) // Adjust compression for PNG
            .toBuffer();
    } else if (format === 'webp') {
        compressedImageBuffer = await sharp(inputBuffer)
            .webp({ quality: 50 }) // Adjust quality for WebP
            .toBuffer();
    } else if (format === 'gif') {
        compressedImageBuffer = await sharp(inputBuffer)
            .gif({ quality: 50 }) // For GIFs
            .toBuffer();
    } else {
        throw new Error('Unsupported image format');
    }

    // Convert compressed buffer to base64
    const base64Image = `data:${file.mimetype};base64,${compressedImageBuffer.toString('base64')}`;

    // Resize the image if needed
    return await resizeBase64Image(base64Image);
};

// Get user information by user ID
router.get('/', async (req, res) => {
    const { userId } = req.query;
    const responseData = { user: null, error: null };

    if (!userId) {
        responseData.error = 'No user ID';
        return res.status(400).json(responseData);
    }

    try {
        const userData = await req.db.collection('userData').findOne({ userId });

        if (!userData) {
            responseData.error = 'User not found';
            return res.status(404).json(responseData);
        }

        const { firstName, lastName, email, profileImg, links } = userData;
        responseData.user = { userId, firstName, lastName, email, profileImg, links }; // Include links
        res.json(responseData);
    } catch (e) {
        responseData.error = e.message || 'Error fetching data';
        res.status(500).json(responseData);
    }
});

// Update user information and profile image
router.patch('/', upload.single('profileImg'), async (req, res) => {
    const { userId, firstName, lastName, email } = req.body;
    const responseData = { success: false, user: null, error: null };

    if (!userId) {
        responseData.error = 'Missing user ID';
        return res.status(400).json(responseData);
    }

    try {
        // Check if user exists
        const existingUser = await req.db.collection('userData').findOne({ userId });
        if (!existingUser) {
            responseData.error = 'User not found';
            return res.status(404).json(responseData);
        }

        // Create an object to update
        const updateData = { firstName, lastName, email };

        // Include profileImg if an image is uploaded
        if (req.file) {
            const base64Image = await compressImage(req.file);
            updateData.profileImg = base64Image;
        }

        // Check for unchanged data
        const isSame = Object.keys(updateData).every(key => updateData[key] === existingUser[key]);
        if (isSame) {
            responseData.error = 'No changes detected';
            return res.status(400).json(responseData);
        }

        const result = await req.db.collection('userData').updateOne(
            { userId },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            responseData.error = 'No user found or information unchanged';
            return res.status(404).json(responseData);
        }

        // Fetch the updated user data
        const updatedUser = await req.db.collection('userData').findOne({ userId });

        responseData.success = true;
        responseData.user = {
            userId: updatedUser.userId,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            profileImg: updatedUser.profileImg,
            links: updatedUser.links
        };

        res.json(responseData);
    } catch (e) {
        responseData.error = e.message || 'Error updating user information';
        res.status(500).json(responseData);
    }
});

module.exports = router;