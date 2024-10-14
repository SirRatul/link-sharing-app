const express = require('express');
const router = express.Router();

// Get links by user ID
router.get('/', async (req, res) => {
    const { userId } = req.query;
    const responseData = { links: null, error: null };

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

        responseData.links = userData.links;
        res.json(responseData);
    } catch (e) {
        responseData.error = e.message || 'Error fetching data';
        res.status(500).json(responseData);
    }
});

// Update links for a user
router.patch('/', async (req, res) => {
    const { userId, links } = req.body;

    const responseData = { success: false, error: null };

    if (!userId || !links) {
        responseData.error = 'No user ID or links provided';
        return res.status(400).json(responseData);
    }

    try {
        const result = await req.db.collection('userData').updateOne(
            { userId },
            { $set: { links } }
        );

        if (result.modifiedCount === 0) {
            responseData.error = 'No user found or links unchanged';
            return res.status(404).json(responseData);
        }

        // Return the updated links in the response
        responseData.success = true;
        responseData.updatedLinks = links; // Include the updated links
        res.json(responseData);
    } catch (e) {
        responseData.error = e.message || 'Error updating links';
        res.status(500).json(responseData);
    }
});

module.exports = router;
