const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "energy_matrix",
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes

// Route to confirm server status
app.get('/status', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});

// User signup
app.post('/Signup', async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        // Check if user already exists in the database
        const checkUserSql = 'SELECT COUNT(*) AS count FROM customers WHERE Email = ?';
        const [rows] = await db.promise().query(checkUserSql, [email]);

        // If user with the same email already exists, return error
        if (rows[0].count > 0) {
            console.error('User already exists');
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

        // Insert user data into the database with the hashed password
        const insertUserSql = 'INSERT INTO customers (Email, FullName, Password) VALUES (?, ?, ?)';
        await db.promise().query(insertUserSql, [email, fullName, hashedPassword]);

        console.log('User registered successfully');
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Customer login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body); // Log the request body to verify received data

    try {
        // Check if user exists in the database
        const getUserSql = 'SELECT * FROM customers WHERE Email = ?';
        const [rows] = await db.promise().query(getUserSql, [email]);

        if (rows.length === 0) {
            console.error('User not found');
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Retrieve the stored hashed password
        const storedHashedPassword = rows[0].Password;

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            console.error('Incorrect password');
            res.status(401).json({ error: 'Incorrect email or password' });
            return;
        }

        console.log('Login successful');
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Vendor registration
app.post('/register-vendor', upload.single('businessLicense'), async (req, res) => {
    const { companyName, contactPersonName, contactEmail, contactNumber, companyAddress, vatNumber, password } = req.body;
    const businessLicense = req.file ? req.file.path : null;

    try {
        // Check if vendor with the same email already exists
        const checkVendorSql = 'SELECT COUNT(*) AS count FROM vendors WHERE contactEmail = ?';
        const [rows] = await db.promise().query(checkVendorSql, [contactEmail]);

        // If vendor with the same email already exists, return error
        if (rows[0].count > 0) {
            console.error('Vendor already exists');
            return res.status(400).json({ error: 'Vendor already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert vendor data into the database
        const insertVendorSql = 'INSERT INTO vendors (companyName, contactPersonName, contactEmail, contactNumber, companyAddress, businessLicense, vatNumber, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await db.promise().query(insertVendorSql, [companyName, contactPersonName, contactEmail, contactNumber, companyAddress, businessLicense, vatNumber, hashedPassword]);

        console.log('Vendor registered successfully');
        res.status(200).json({ message: 'Vendor registered successfully' });
    } catch (error) {
        console.error('Error registering vendor:', error);
        res.status(500).json({ error: 'Error registering vendor' });
    }
});

// Vendor login
app.post('/vendor-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if vendor exists in the database
        const getVendorSql = 'SELECT * FROM vendors WHERE contactEmail = ?';
        const [rows] = await db.promise().query(getVendorSql, [email]);

        if (rows.length === 0) {
            console.error('Vendor not found');
            res.status(404).json({ error: 'Vendor not found' });
            return;
        }

        // Retrieve the stored hashed password
        const storedHashedPassword = rows[0].Password;

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            console.error('Incorrect password');
            res.status(401).json({ error: 'Incorrect email or password' });
            return;
        }

        console.log('Vendor login successful');
        res.status(200).json({ message: 'Vendor login successful' });
    } catch (error) {
        console.error('Error during vendor login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add item to cart
app.post('/api/add-to-cart', (req, res) => {
    const { email, item } = req.body;

    const insertCartItemSql = 'INSERT INTO cart_items (email, item) VALUES (?, ?)';
    db.query(insertCartItemSql, [email, JSON.stringify(item)], (err, result) => {
        if (err) {
            console.error('Error adding item to cart:', err);
            res.status(500).json({ error: 'Error adding item to cart' });
            return;
        }
        console.log('Item added to cart successfully');
        res.status(200).json({ message: 'Item added to cart successfully' });
    });
});

// Add item to wishlist
app.post('/api/add-to-wishlist', (req, res) => {
    const { email, item } = req.body;

    const insertWishlistItemSql = 'INSERT INTO wishlist_items (email, item) VALUES (?, ?)';
    db.query(insertWishlistItemSql, [email, JSON.stringify(item)], (err, result) => {
        if (err) {
            console.error('Error adding item to wishlist:', err);
            res.status(500).json({ error: 'Error adding item to wishlist' });
            return;
        }
        console.log('Item added to wishlist successfully');
        res.status(200).json({ message: 'Item added to wishlist successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});