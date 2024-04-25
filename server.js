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
const profilePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profile-pictures/');
    },
    filename: function (req, file, cb) {
        // Keep the original file name for profile pictures
        cb(null, file.originalname);
    }
});

const licensePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/license-pictures/');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for license pictures
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadProfilePicture = multer({ storage: profilePictureStorage, limits: { fieldSize: 25 * 1024 * 1024 } });
const uploadLicensePicture = multer({ storage: licensePictureStorage, limits: { fieldSize: 25 * 1024 * 1024 } });

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
        console.log('User email:', rows[0].Email); // Log the user's email
        console.log('User full name:', rows[0].FullName); // Log the user's full name

        res.status(200).json({
            message: 'Login successful',
            email: rows[0].Email,
            fullName: rows[0].FullName
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Vendor registration
app.post('/register-vendor', uploadLicensePicture.single('businessLicense'), async (req, res) => {
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

        console.log('Rows:', rows); // Log the entire rows object

        if (rows.length === 0) {
            console.error('Vendor not found');
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Retrieve the stored hashed password
        const storedHashedPassword = rows[0].password;

        // Check if storedHashedPassword is null, undefined, or empty string
        if (!storedHashedPassword) {
            console.error('Stored hashed password is missing or empty');
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            console.error('Incorrect password');
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        console.log('Vendor login successful');

        // Send vendor email and company in the response
        return res.status(200).json({
            message: 'Vendor login successful',
            email: rows[0].contactEmail,
            company: rows[0].companyName
        });
    } catch (error) {
        console.error('Error during vendor login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Add item to cart
app.post('/add-to-cart', (req, res) => {
    const { email, item } = req.body;
    console.log("Req.BODY: ", req.body);

    // Check if both email and item are provided
    if (!email || !item) {
        return res.status(400).json({ error: 'Email and item are required' });
    }

    const insertCartItemSql = 'INSERT INTO cart_items (email, item) VALUES (?, ?)';
    db.query(insertCartItemSql, [email, JSON.stringify(item)], (err, result) => {
        if (err) {
            console.error('Error adding item to cart:', err);
            return res.status(500).json({ error: 'Error adding item to cart' });
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

// Update full name route
app.post('/update-name', async (req, res) => {
    const { email, fullName } = req.body;

    try {
        // Update full name query
        const updateQuery = 'UPDATE customers SET FullName = ? WHERE Email = ?';
        await db.promise().query(updateQuery, [fullName, email]);

        console.log('Full name updated successfully');
        res.status(200).json({ message: 'Full name updated successfully' });
    } catch (error) {
        console.error('Error updating full name:', error);
        res.status(500).json({ error: 'Error updating full name' });
    }
});

// Update profile picture route
app.post('/update-profile-picture', uploadProfilePicture.single('profilePicture'), async (req, res) => {
    // Handle updating profile picture
    try {
        // Get user email from request body
        const { email } = req.body;

        // Get file path of uploaded profile picture
        const profilePicturePath = req.file ? req.file.path : null;

        console.log('Email:', email);
        console.log('File:', req.file); // Log the file object received by multer

        if (!req.file) {
            console.error('No profile picture file received');
            return res.status(400).json({ error: 'No profile picture file received' });
        }

        console.log('Profile Picture Path:', profilePicturePath);

        // Update user profile picture in the database
        const updateProfilePictureQuery = 'UPDATE customers SET ProfilePicture = ? WHERE Email = ?';
        await db.promise().query(updateProfilePictureQuery, [profilePicturePath, email]);

        console.log('Profile picture updated successfully');
        res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Error updating profile picture' });
    }
});

// Route to check old password and update password
app.post('/change-password', async (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    try {
        // Retrieve the stored hashed password from the database
        const getPasswordQuery = 'SELECT Password FROM customers WHERE Email = ?';
        const [rows] = await db.promise().query(getPasswordQuery, [email]);

        if (rows.length === 0) {
            // If user with the provided email does not exist
            return res.status(404).json({ message: 'User not found' });
        }

        const storedHashedPassword = rows[0].Password;

        // Compare the provided old password with the stored hashed password
        const passwordMatch = await bcrypt.compare(oldPassword, storedHashedPassword);

        if (!passwordMatch) {
            // If old password is incorrect
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Salt rounds: 10

        // Update the password in the database
        const updatePasswordQuery = 'UPDATE customers SET Password = ? WHERE Email = ?';
        await db.promise().query(updatePasswordQuery, [hashedPassword, email]);

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to create a new product
app.post('/create-product', async (req, res) => {
    const { name, description, category, tags, originalPrice, discountedPrice, stock, images, vendorEmail } = req.body;

    try {
        // Insert the product data into the database
        const insertProductSql = `
            INSERT INTO products (name, description, category, tags, original_price, discounted_price, stock, images, vendor_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(insertProductSql, [name, description, category, tags, originalPrice, discountedPrice, stock, images, vendorEmail]);

        // Send success response
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});