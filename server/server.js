require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jwt

const linksRouter = require('./routes/links');
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

client.connect()
    .then(() => {
        db = client.db(process.env.DB_NAME);
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error("MongoDB connection error:", err));

// Make db accessible to routers
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// Route handlers
app.use('/links', authenticateToken, linksRouter);
app.use('/user', authenticateToken, userRouter);

// Fetch user data
app.get('/', async (req, res) => {
    const { userId, userSlug } = req.query;
    const responseData = {
        user: null,
        links: null,
        error: null
    };

    if (!userId && !userSlug) {
        responseData.error = 'No user ID';
        return res.status(400).json(responseData);
    }

    try {
        const filterColumn = userSlug ? 'slug' : 'userId';
        const filterTerm = userSlug || userId;

        const userData = await db.collection('userData').findOne({ [filterColumn]: filterTerm });

        if (!userData) {
            responseData.error = 'No user data found';
            return res.status(404).json(responseData);
        }

        // Destructure the necessary fields from userData
        const { firstName, lastName, email, profileImg, links } = userData;

        // Return user details with links
        responseData.user = { firstName, lastName, email, profileImg, links }; // Include all requested fields

        return res.json(responseData); // Return the full response
    } catch (e) {
        responseData.error = e.message || 'Error fetching data';
        return res.status(500).json(responseData);
    }
});

// Insert user function
async function insertUser(userId, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt

    const newUser = {
        firstName: '',
        lastName: '',
        profileImg: '',
        userId,
        email,
        password: hashedPassword, // Store hashed password
        links: [],
        slug: userId.slice(0, 10) // Retaining slug generation for potential use
    };

    const result = await db.collection('userData').insertOne(newUser);
    return result.insertedId ? true : false;
}

// User signup
app.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName, profileImg } = req.body;
    const responseData = {
        user: null,
        error: null
    };

    if (!email || !password) {
        responseData.error = 'Missing user data';
        return res.status(400).json(responseData);
    }

    try {
        const userId = new Date().getTime().toString(); // Placeholder for actual user ID generation

        // Insert user into the database (make sure to hash the password before storing)
        const userInserted = await insertUser(userId, email, password, firstName, lastName, profileImg);

        if (userInserted) {
            // Create a JWT token
            const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Include all relevant user info in the response
            responseData.user = { email, id: userId, token, firstName, lastName, profileImg };
            return res.status(201).json(responseData); // 201 Created
        } else {
            responseData.error = 'Failed to create account';
            return res.status(500).json(responseData); // 500 Internal Server Error
        }
    } catch (e) {
        responseData.error = e.message;
        return res.status(500).json(responseData);
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const responseData = {
        user: null,
        error: null
    };

    if (!email || !password) {
        responseData.error = 'Missing user data';
        return res.status(400).json(responseData);
    }

    try {
        const user = await db.collection('userData').findOne({ email });

        if (!user) {
            responseData.error = 'User not found';
            return res.status(404).json(responseData); // 404 Not Found
        }

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            responseData.error = 'Incorrect password';
            return res.status(401).json(responseData); // 401 Unauthorized
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        responseData.user = { email, id: user.userId, token, firstName: user.firstName, lastName: user.lastName, profileImg: user.profileImg, links: user.links }; // Include additional user info

        return res.json(responseData); // 200 OK
    } catch (e) {
        responseData.error = e.message;
        return res.status(500).json(responseData);
    }
});

// User logout
app.post('/logout', authenticateToken, (req, res) => {
    // Invalidate the token on the client side
    // Here, you could implement a token blacklist if needed.

    // For now, just send a response indicating the user is logged out.
    res.json({ message: 'Logged out successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Set default port to 5000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
