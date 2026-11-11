const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const { db } = require("./backend/db");
const {
  signToken,
  hashPassword,
  comparePassword,
  requireCustomer,
  requireVendor,
  requireAnyAuth,
} = require("./backend/auth");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage configs
const makeStorage = (subfolder, prefix) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "uploads", subfolder);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || ".png";
      cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
  });

const uploadProfilePicture = multer({
  storage: makeStorage("profile-pictures", "avatar"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadLicensePicture = multer({
  storage: makeStorage("license-pictures", "license"),
  limits: { fileSize: 15 * 1024 * 1024 },
});

const uploadProductsPictures = multer({
  storage: makeStorage("products-pictures", "product"),
  limits: { fileSize: 15 * 1024 * 1024, fieldSize: 25 * 1024 * 1024 },
});

function saveBase64Image(dataUri, subfolder = "products-pictures") {
  if (!dataUri || typeof dataUri !== "string") return null;
  const match = dataUri.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;
  let ext = match[1].toLowerCase();
  if (ext === "jpeg") ext = "jpg";
  if (ext.includes("svg")) ext = "svg";
  const buffer = Buffer.from(match[2], "base64");
  const filename = `product-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(__dirname, "uploads", subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/uploads/${subfolder}/${filename}`;
}

function resolveImageUrl(imgPath) {
  if (!imgPath) return "/Assets/solarpanel.jpg";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://") || imgPath.startsWith("data:")) {
    return imgPath;
  }
  if (imgPath.startsWith("/uploads/") || imgPath.startsWith("/Assets/")) {
    return imgPath;
  }
  if (imgPath.startsWith("../Assets/")) {
    return imgPath.replace("../Assets/", "/Assets/");
  }
  return imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
}

function sanitizeCustomer(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    phoneNumber: row.phoneNumber || "",
    profilePicture: row.profilePicture || "",
    createdAt: row.createdAt,
  };
}

function sanitizeVendor(row) {
  if (!row) return null;
  const productCount = db
    .prepare("SELECT COUNT(*) AS c FROM products WHERE vendorId = ?")
    .get(row.id).c;
  const reviewCount = db
    .prepare(
      "SELECT COUNT(*) AS c FROM reviews r JOIN products p ON r.productId = p.id WHERE p.vendorId = ?"
    )
    .get(row.id).c;
  return {
    id: row.id,
    _id: String(row.id),
    name: row.companyName,
    companyName: row.companyName,
    contactPersonName: row.contactPersonName,
    email: row.contactEmail,
    contactEmail: row.contactEmail,
    phoneNumber: row.contactNumber || "",
    contactNumber: row.contactNumber || "",
    address: row.companyAddress || "",
    companyAddress: row.companyAddress || "",
    businessLicense: row.businessLicense || "",
    vatNumber: row.vatNumber || "",
    description: row.description || "",
    avatar: row.avatar || "/Assets/hub.jpg",
    ratings: Number(row.ratings || 4.5),
    totalProducts: productCount,
    totalReviews: reviewCount,
    createdAt: row.createdAt,
  };
}

function formatProductRow(row) {
  if (!row) return null;
  const vendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(row.vendorId);
  const reviews = db
    .prepare("SELECT id, userName AS user, avatar, rating, comment, createdAt FROM reviews WHERE productId = ? ORDER BY id DESC")
    .all(row.id);

  let parsedImages = [];
  try {
    parsedImages = JSON.parse(row.images || "[]").map(resolveImageUrl);
  } catch {
    parsedImages = [];
  }
  const mainImage = resolveImageUrl(row.image_URL);
  if (parsedImages.length === 0) parsedImages = [mainImage];

  let parsedFeatures = [];
  try {
    parsedFeatures = JSON.parse(row.features || "[]");
  } catch {
    parsedFeatures = [];
  }

  const vendorSanitized = vendor ? sanitizeVendor(vendor) : null;

  return {
    id: row.id,
    vendorId: row.vendorId,
    name: row.name,
    description: row.description,
    category: row.category,
    tags: row.tags || "",
    price: Number(row.price),
    originalPrice: Number(row.price),
    discount_price: Number(row.discount_price),
    discountPrice: Number(row.discount_price),
    stock: Number(row.stock),
    total_sell: Number(row.total_sell),
    ratings: Number(row.ratings),
    image_URL: mainImage,
    images: parsedImages,
    type: row.type || "product",
    capacity: row.capacity || "",
    warranty: row.warranty || "",
    features: parsedFeatures,
    createdAt: row.createdAt,
    reviews,
    shop: vendorSanitized
      ? {
          id: vendorSanitized.id,
          name: vendorSanitized.companyName,
          description: vendorSanitized.description,
          address: vendorSanitized.companyAddress,
          phoneNumber: vendorSanitized.contactNumber,
          createdAt: vendorSanitized.createdAt,
          totalProducts: vendorSanitized.totalProducts,
          totalReviews: vendorSanitized.totalReviews,
          ratings: vendorSanitized.ratings,
          shop_avatar: {
            public_id: `vendor-${vendorSanitized.id}`,
            url: vendorSanitized.avatar,
          },
        }
      : {
          id: 1,
          name: "Energy Matrix Vendor",
          ratings: 4.5,
          shop_avatar: { public_id: "default", url: "/Assets/hub.jpg" },
        },
  };
}

function formatOrderRow(orderRow) {
  if (!orderRow) return null;
  const items = db
    .prepare("SELECT * FROM order_items WHERE orderId = ?")
    .all(orderRow.id);

  let shippingAddress = {};
  let paymentInfo = {};
  try {
    shippingAddress = JSON.parse(orderRow.shippingAddress || "{}");
  } catch {
    shippingAddress = {};
  }
  try {
    paymentInfo = JSON.parse(orderRow.paymentInfo || "{}");
  } catch {
    paymentInfo = {};
  }

  const mappedItems = items.map((it) => ({
    id: it.id,
    productId: it.productId,
    vendorId: it.vendorId,
    vendorName: it.vendorName,
    name: it.name,
    image_URL: resolveImageUrl(it.image_URL),
    images: [{ url: resolveImageUrl(it.image_URL) }],
    discount_price: Number(it.discount_price),
    discountPrice: Number(it.discount_price),
    qty: Number(it.qty),
    isReviewed: Boolean(it.isReviewed),
  }));

  const totalQty = mappedItems.reduce((sum, it) => sum + it.qty, 0);

  return {
    id: orderRow.id,
    _id: orderRow.orderNumber,
    orderNumber: orderRow.orderNumber,
    customerId: orderRow.customerId,
    user: {
      id: orderRow.customerId,
      name: orderRow.customerName,
      email: orderRow.customerEmail,
      phoneNumber: orderRow.customerPhone,
    },
    shippingAddress,
    paymentInfo,
    subTotalPrice: Number(orderRow.subTotalPrice),
    shipping: Number(orderRow.shipping),
    discountPrice: Number(orderRow.discountPrice),
    totalPrice: Number(orderRow.totalPrice),
    orderStatus: orderRow.orderStatus,
    qty: totalQty,
    orderItems: mappedItems,
    cart: mappedItems,
    createdAt: orderRow.createdAt,
  };
}

function getCustomerCart(customerId) {
  const rows = db
    .prepare(
      `SELECT ci.qty, p.* FROM cart_items ci
       JOIN products p ON ci.productId = p.id
       WHERE ci.customerId = ?
       ORDER BY ci.id DESC`
    )
    .all(customerId);

  return rows.map((r) => ({
    ...formatProductRow(r),
    qty: Number(r.qty),
  }));
}

function getCustomerWishlist(customerId) {
  const rows = db
    .prepare(
      `SELECT p.* FROM wishlist_items wi
       JOIN products p ON wi.productId = p.id
       WHERE wi.customerId = ?
       ORDER BY wi.id DESC`
    )
    .all(customerId);

  return rows.map((r) => ({
    ...formatProductRow(r),
    qty: 1,
  }));
}

// ==================== HEALTH ====================
app.get("/status", (req, res) => {
  res.status(200).json({ message: "Server is up and running", db: "sqlite" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, db: "sqlite" });
});

// ==================== CUSTOMER AUTH ====================
async function handleCustomerSignup(req, res) {
  const { email, fullName, password, phoneNumber } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanName = (fullName || "").trim();

  if (!cleanEmail || !cleanName || !password) {
    return res.status(400).json({ error: "Full name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const existing = db.prepare("SELECT id FROM customers WHERE lower(email) = ?").get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const hashed = await hashPassword(password);
    const result = db
      .prepare("INSERT INTO customers (email, fullName, password, phoneNumber) VALUES (?, ?, ?, ?)")
      .run(cleanEmail, cleanName, hashed, (phoneNumber || "").trim());

    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(result.lastInsertRowid);
    const token = signToken({ id: customer.id, email: customer.email, role: "customer" });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeCustomer(customer),
      email: customer.email,
      fullName: customer.fullName,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Error registering user" });
  }
}

async function handleCustomerLogin(req, res) {
  const { email, password } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const customer = db.prepare("SELECT * FROM customers WHERE lower(email) = ?").get(cleanEmail);
    if (!customer) {
      return res.status(404).json({ error: "No customer account found with this email." });
    }

    const match = await comparePassword(password, customer.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = signToken({ id: customer.id, email: customer.email, role: "customer" });
    return res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeCustomer(customer),
      email: customer.email,
      fullName: customer.fullName,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

app.post("/Signup", handleCustomerSignup);
app.post("/api/auth/signup", handleCustomerSignup);
app.post("/login", handleCustomerLogin);
app.post("/api/auth/login", handleCustomerLogin);

app.get("/api/auth/me", requireCustomer, (req, res) => {
  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.customer.id);
  if (!customer) return res.status(404).json({ error: "User not found" });
  const addresses = db
    .prepare("SELECT * FROM addresses WHERE customerId = ? ORDER BY id DESC")
    .all(customer.id);
  return res.status(200).json({ user: sanitizeCustomer(customer), addresses });
});

async function handleUpdateName(req, res) {
  const { email, fullName, phoneNumber } = req.body;
  try {
    let targetId = req.customer?.id;
    if (!targetId && email) {
      const c = db.prepare("SELECT id FROM customers WHERE lower(email) = ?").get(email.trim().toLowerCase());
      if (c) targetId = c.id;
    }
    if (!targetId) return res.status(401).json({ error: "Authentication required" });
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (phoneNumber !== undefined) {
      db.prepare("UPDATE customers SET fullName = ?, phoneNumber = ? WHERE id = ?").run(
        fullName.trim(),
        phoneNumber.trim(),
        targetId
      );
    } else {
      db.prepare("UPDATE customers SET fullName = ? WHERE id = ?").run(fullName.trim(), targetId);
    }

    const updated = db.prepare("SELECT * FROM customers WHERE id = ?").get(targetId);
    return res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizeCustomer(updated),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

app.post("/update-name", handleUpdateName);
app.put("/api/auth/profile", requireCustomer, handleUpdateName);

async function handleUpdateProfilePicture(req, res) {
  try {
    const email = req.body.email;
    let targetId = req.customer?.id;
    if (!targetId && email) {
      const c = db.prepare("SELECT id FROM customers WHERE lower(email) = ?").get(email.trim().toLowerCase());
      if (c) targetId = c.id;
    }
    if (!targetId) return res.status(401).json({ error: "Authentication required" });
    if (!req.file) return res.status(400).json({ error: "No profile picture file received" });

    const publicPath = `/uploads/profile-pictures/${req.file.filename}`;
    db.prepare("UPDATE customers SET profilePicture = ? WHERE id = ?").run(publicPath, targetId);
    const updated = db.prepare("SELECT * FROM customers WHERE id = ?").get(targetId);

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: publicPath,
      user: sanitizeCustomer(updated),
    });
  } catch (error) {
    console.error("Profile picture update error:", error);
    return res.status(500).json({ error: "Error updating profile picture" });
  }
}

app.post("/update-profile-picture", uploadProfilePicture.single("profilePicture"), handleUpdateProfilePicture);
app.post("/api/auth/profile-picture", requireCustomer, uploadProfilePicture.single("profilePicture"), handleUpdateProfilePicture);

async function handleChangePassword(req, res) {
  const { email, oldPassword, newPassword, confirmPassword } = req.body;
  try {
    let customer = null;
    if (req.customer?.id) {
      customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.customer.id);
    } else if (email) {
      customer = db.prepare("SELECT * FROM customers WHERE lower(email) = ?").get(email.trim().toLowerCase());
    }

    if (!customer) return res.status(404).json({ message: "User not found", error: "User not found" });
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All password fields are required", error: "All password fields are required" });
    }
    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match", error: "Passwords do not match" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters", error: "New password must be at least 6 characters" });
    }

    const match = await comparePassword(oldPassword, customer.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect old password", error: "Incorrect old password" });
    }

    const hashed = await hashPassword(newPassword);
    db.prepare("UPDATE customers SET password = ? WHERE id = ?").run(hashed, customer.id);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

app.post("/change-password", handleChangePassword);
app.post("/api/auth/change-password", requireCustomer, handleChangePassword);

// ==================== ADDRESSES ====================
app.get("/api/addresses", requireCustomer, (req, res) => {
  const addresses = db
    .prepare("SELECT * FROM addresses WHERE customerId = ? ORDER BY id DESC")
    .all(req.customer.id);
  res.status(200).json({ addresses });
});

app.post("/api/addresses", requireCustomer, (req, res) => {
  const { addressType, country, city, address1, address2, zipCode } = req.body;
  if (!addressType || !country || !city || !address1 || !zipCode) {
    return res.status(400).json({ error: "Please fill all required address fields." });
  }

  const result = db
    .prepare(
      `INSERT INTO addresses (customerId, addressType, country, city, address1, address2, zipCode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.customer.id, addressType, country, city, address1, address2 || "", String(zipCode));

  const created = db.prepare("SELECT * FROM addresses WHERE id = ?").get(result.lastInsertRowid);
  const addresses = db.prepare("SELECT * FROM addresses WHERE customerId = ? ORDER BY id DESC").all(req.customer.id);
  res.status(201).json({ message: "Address saved successfully", address: created, addresses });
});

app.delete("/api/addresses/:id", requireCustomer, (req, res) => {
  const info = db
    .prepare("DELETE FROM addresses WHERE id = ? AND customerId = ?")
    .run(Number(req.params.id), req.customer.id);
  if (info.changes === 0) return res.status(404).json({ error: "Address not found" });
  const addresses = db.prepare("SELECT * FROM addresses WHERE customerId = ? ORDER BY id DESC").all(req.customer.id);
  res.status(200).json({ message: "Address deleted successfully", addresses });
});

// ==================== VENDOR AUTH & SHOP ====================
async function handleVendorRegister(req, res) {
  const {
    companyName,
    contactPersonName,
    contactEmail,
    contactNumber,
    companyAddress,
    vatNumber,
    password,
    description,
  } = req.body;
  const cleanEmail = (contactEmail || "").trim().toLowerCase();

  if (!companyName || !contactPersonName || !cleanEmail || !password) {
    return res.status(400).json({ error: "Company name, contact person, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const existing = db.prepare("SELECT id FROM vendors WHERE lower(contactEmail) = ?").get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: "A vendor account with this email already exists." });
    }

    const licensePath = req.file ? `/uploads/license-pictures/${req.file.filename}` : "";
    const hashed = await hashPassword(password);

    const result = db
      .prepare(
        `INSERT INTO vendors (
          companyName, contactPersonName, contactEmail, contactNumber,
          companyAddress, businessLicense, vatNumber, description, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        companyName.trim(),
        contactPersonName.trim(),
        cleanEmail,
        (contactNumber || "").trim(),
        (companyAddress || "").trim(),
        licensePath,
        (vatNumber || "").trim(),
        (description || "Verified solar equipment vendor on Energy Matrix.").trim(),
        hashed
      );

    const vendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(result.lastInsertRowid);
    const token = signToken({ id: vendor.id, email: vendor.contactEmail, role: "vendor" });

    return res.status(201).json({
      message: "Vendor registered successfully",
      token,
      vendor: sanitizeVendor(vendor),
    });
  } catch (error) {
    console.error("Vendor register error:", error);
    return res.status(500).json({ error: "Error registering vendor" });
  }
}

async function handleVendorLogin(req, res) {
  const { email, password } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const vendor = db.prepare("SELECT * FROM vendors WHERE lower(contactEmail) = ?").get(cleanEmail);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor account not found." });
    }

    const match = await comparePassword(password, vendor.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = signToken({ id: vendor.id, email: vendor.contactEmail, role: "vendor" });
    return res.status(200).json({
      message: "Vendor login successful",
      token,
      vendor: sanitizeVendor(vendor),
      email: vendor.contactEmail,
      company: vendor.companyName,
    });
  } catch (error) {
    console.error("Vendor login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

app.post("/register-vendor", uploadLicensePicture.single("businessLicense"), handleVendorRegister);
app.post("/api/vendor/register", uploadLicensePicture.single("businessLicense"), handleVendorRegister);
app.post("/vendor-login", handleVendorLogin);
app.post("/api/vendor/login", handleVendorLogin);

app.get("/api/vendor/me", requireVendor, (req, res) => {
  const vendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(req.vendor.id);
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  return res.status(200).json({ vendor: sanitizeVendor(vendor) });
});

app.put("/api/vendor/profile", requireVendor, (req, res) => {
  const { companyName, contactPersonName, contactNumber, companyAddress, description, vatNumber } = req.body;
  const existing = db.prepare("SELECT * FROM vendors WHERE id = ?").get(req.vendor.id);
  if (!existing) return res.status(404).json({ error: "Vendor not found" });

  db.prepare(
    `UPDATE vendors
     SET companyName = ?, contactPersonName = ?, contactNumber = ?, companyAddress = ?, description = ?, vatNumber = ?
     WHERE id = ?`
  ).run(
    (companyName || existing.companyName).trim(),
    (contactPersonName || existing.contactPersonName).trim(),
    contactNumber !== undefined ? contactNumber.trim() : existing.contactNumber,
    companyAddress !== undefined ? companyAddress.trim() : existing.companyAddress,
    description !== undefined ? description.trim() : existing.description,
    vatNumber !== undefined ? vatNumber.trim() : existing.vatNumber,
    req.vendor.id
  );

  const updated = db.prepare("SELECT * FROM vendors WHERE id = ?").get(req.vendor.id);
  res.status(200).json({ message: "Shop profile updated successfully", vendor: sanitizeVendor(updated) });
});

app.get("/api/vendors/:id", (req, res) => {
  const vendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(Number(req.params.id));
  if (!vendor) return res.status(404).json({ error: "Shop not found" });

  const productRows = db
    .prepare("SELECT * FROM products WHERE vendorId = ? ORDER BY id DESC")
    .all(vendor.id);
  const products = productRows.map(formatProductRow);
  const reviews = products.flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, productName: p.name, productId: p.id }))
  );

  res.status(200).json({
    vendor: sanitizeVendor(vendor),
    products,
    reviews,
  });
});

// ==================== PRODUCTS & PACKAGES ====================
app.get("/api/products", (req, res) => {
  const { type, category, search, vendorId, sort } = req.query;
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (type && type !== "all") {
    query += " AND type = ?";
    params.push(type);
  }
  if (category && category !== "All") {
    query += " AND lower(category) = ?";
    params.push(category.trim().toLowerCase());
  }
  if (vendorId) {
    query += " AND vendorId = ?";
    params.push(Number(vendorId));
  }
  if (search && search.trim()) {
    const like = `%${search.trim().toLowerCase()}%`;
    query += " AND (lower(name) LIKE ? OR lower(category) LIKE ? OR lower(description) LIKE ? OR lower(tags) LIKE ?)";
    params.push(like, like, like, like);
  }

  if (sort === "bestseller") {
    query += " ORDER BY total_sell DESC, id ASC";
  } else if (sort === "price_asc") {
    query += " ORDER BY discount_price ASC";
  } else if (sort === "price_desc") {
    query += " ORDER BY discount_price DESC";
  } else {
    query += " ORDER BY id DESC";
  }

  const rows = db.prepare(query).all(...params);
  res.status(200).json({ products: rows.map(formatProductRow) });
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  let row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  // Support legacy package links /solar-package/1..7 by mapping 1..7 -> 101..107 if needed
  if (!row && req.query.type === "package" && id < 100) {
    row = db.prepare("SELECT * FROM products WHERE id = ?").get(id + 100);
  }
  if (!row) return res.status(404).json({ error: "Product not found" });
  res.status(200).json({ product: formatProductRow(row) });
});

async function handleCreateProduct(req, res) {
  try {
    const {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountedPrice,
      discountPrice,
      stock,
      vendorEmail,
      type,
      capacity,
      warranty,
      features,
    } = req.body;

    let vendorId = req.vendor?.id;
    if (!vendorId && vendorEmail) {
      const v = db
        .prepare("SELECT id FROM vendors WHERE lower(contactEmail) = ?")
        .get(vendorEmail.trim().toLowerCase());
      if (v) vendorId = v.id;
    }
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor authentication required to create products." });
    }

    const finalDiscountPrice = Number(discountPrice ?? discountedPrice);
    const finalOriginalPrice = Number(originalPrice || finalDiscountPrice);
    const finalStock = Number(stock);

    if (!name || !description || !category || category === "Choose a category") {
      return res.status(400).json({ error: "Name, description, and category are required." });
    }
    if (!Number.isFinite(finalDiscountPrice) || finalDiscountPrice <= 0) {
      return res.status(400).json({ error: "Please enter a valid discounted price." });
    }
    if (!Number.isFinite(finalStock) || finalStock < 0) {
      return res.status(400).json({ error: "Please enter a valid stock count." });
    }

    // Collect images from multer files OR base64 fields (image0, image1, ...) OR JSON images array
    const imagePaths = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      for (const f of req.files) {
        imagePaths.push(`/uploads/products-pictures/${f.filename}`);
      }
    }
    if (Array.isArray(req.body.images)) {
      for (const img of req.body.images) {
        if (typeof img === "string" && img.startsWith("data:image/")) {
          const saved = saveBase64Image(img);
          if (saved) imagePaths.push(saved);
        } else if (typeof img === "string" && img.trim()) {
          imagePaths.push(img.trim());
        }
      }
    }
    for (const key of Object.keys(req.body)) {
      if (/^image\d+$/.test(key) && typeof req.body[key] === "string") {
        const saved = saveBase64Image(req.body[key]);
        if (saved) imagePaths.push(saved);
      }
    }

    const mainImage = imagePaths[0] || "/Assets/solarpanel.jpg";
    const finalImages = imagePaths.length > 0 ? imagePaths : [mainImage];

    let parsedFeatures = [];
    if (Array.isArray(features)) parsedFeatures = features;
    else if (typeof features === "string" && features.trim()) {
      parsedFeatures = features.split(",").map((f) => f.trim()).filter(Boolean);
    }

    const result = db
      .prepare(
        `INSERT INTO products (
          vendorId, name, description, category, tags, price, discount_price,
          stock, total_sell, ratings, image_URL, images, type, capacity, warranty, features
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 5.0, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        vendorId,
        name.trim(),
        description.trim(),
        category.trim(),
        (tags || "").trim(),
        finalOriginalPrice,
        finalDiscountPrice,
        finalStock,
        mainImage,
        JSON.stringify(finalImages),
        type === "package" ? "package" : "product",
        (capacity || "").trim(),
        (warranty || "").trim(),
        JSON.stringify(parsedFeatures)
      );

    const created = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json({
      message: "Product created successfully",
      product: formatProductRow(created),
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

app.post("/create-product", uploadProductsPictures.array("productPictures", 5), handleCreateProduct);
app.post("/api/products", requireVendor, uploadProductsPictures.array("productPictures", 5), handleCreateProduct);

app.delete("/api/products/:id", requireVendor, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Product not found" });
  if (existing.vendorId !== req.vendor.id) {
    return res.status(403).json({ error: "You can only delete your own products." });
  }
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  res.status(200).json({ message: "Product deleted successfully" });
});

app.post("/api/products/:id/reviews", requireCustomer, (req, res) => {
  const productId = Number(req.params.id);
  const { rating, comment, orderItemId } = req.body;
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.customer.id);
  const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

  db.prepare(
    `INSERT INTO reviews (productId, customerId, userName, avatar, rating, comment)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    productId,
    customer.id,
    customer.fullName,
    customer.profilePicture || "/Assets/hub.jpg",
    numRating,
    (comment || "").trim() || "Great product!"
  );

  if (orderItemId) {
    db.prepare("UPDATE order_items SET isReviewed = 1 WHERE id = ?").run(Number(orderItemId));
  }

  // Recalculate product & vendor average rating
  const avgProduct = db
    .prepare("SELECT AVG(rating) AS avgRating FROM reviews WHERE productId = ?")
    .get(productId).avgRating;
  db.prepare("UPDATE products SET ratings = ? WHERE id = ?").run(
    Number(Number(avgProduct || 5).toFixed(1)),
    productId
  );

  const avgVendor = db
    .prepare(
      "SELECT AVG(r.rating) AS avgRating FROM reviews r JOIN products p ON r.productId = p.id WHERE p.vendorId = ?"
    )
    .get(product.vendorId).avgRating;
  if (avgVendor) {
    db.prepare("UPDATE vendors SET ratings = ? WHERE id = ?").run(
      Number(Number(avgVendor).toFixed(1)),
      product.vendorId
    );
  }

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  res.status(201).json({
    message: "Review submitted successfully!",
    product: formatProductRow(updated),
  });
});

// ==================== CART ====================
app.get("/api/cart", requireCustomer, (req, res) => {
  res.status(200).json({ cart: getCustomerCart(req.customer.id) });
});

app.get("/get-cart-items", (req, res) => {
  const email = (req.query.email || "").trim().toLowerCase();
  if (!email) return res.status(200).json([]);
  const customer = db.prepare("SELECT id FROM customers WHERE lower(email) = ?").get(email);
  if (!customer) return res.status(200).json([]);
  res.status(200).json(getCustomerCart(customer.id));
});

function handleAddToCart(req, res) {
  const { email, item, productId, qty } = req.body;
  let customerId = req.customer?.id;
  if (!customerId && email) {
    const c = db.prepare("SELECT id FROM customers WHERE lower(email) = ?").get(email.trim().toLowerCase());
    if (c) customerId = c.id;
  }
  if (!customerId) {
    return res.status(401).json({ error: "Please log in to manage your cart." });
  }

  const targetProductId = Number(productId || item?.id);
  const addQty = Math.max(1, Number(qty || item?.qty || 1));
  if (!targetProductId) return res.status(400).json({ error: "Invalid product ID." });

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(targetProductId);
  if (!product) return res.status(404).json({ error: "Product not found." });
  if (product.stock < 1) return res.status(400).json({ error: "Product is out of stock." });

  const existing = db
    .prepare("SELECT * FROM cart_items WHERE customerId = ? AND productId = ?")
    .get(customerId, targetProductId);

  if (existing) {
    const newQty = Math.min(product.stock, existing.qty + addQty);
    db.prepare("UPDATE cart_items SET qty = ? WHERE id = ?").run(newQty, existing.id);
  } else {
    db.prepare("INSERT INTO cart_items (customerId, productId, qty) VALUES (?, ?, ?)").run(
      customerId,
      targetProductId,
      Math.min(product.stock, addQty)
    );
  }

  res.status(200).json({
    message: "Item added to cart successfully",
    cart: getCustomerCart(customerId),
  });
}

app.post("/add-to-cart", handleAddToCart);
app.post("/api/cart", requireCustomer, handleAddToCart);

app.put("/api/cart/:productId", requireCustomer, (req, res) => {
  const productId = Number(req.params.productId);
  const qty = Number(req.body.qty);
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (qty <= 0) {
    db.prepare("DELETE FROM cart_items WHERE customerId = ? AND productId = ?").run(
      req.customer.id,
      productId
    );
  } else {
    if (qty > product.stock) {
      return res.status(400).json({ error: "Product stock limited!" });
    }
    db.prepare("UPDATE cart_items SET qty = ? WHERE customerId = ? AND productId = ?").run(
      qty,
      req.customer.id,
      productId
    );
  }

  res.status(200).json({ cart: getCustomerCart(req.customer.id) });
});

app.delete("/api/cart/:productId", requireCustomer, (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE customerId = ? AND productId = ?").run(
    req.customer.id,
    Number(req.params.productId)
  );
  res.status(200).json({ cart: getCustomerCart(req.customer.id) });
});

app.delete("/api/cart", requireCustomer, (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE customerId = ?").run(req.customer.id);
  res.status(200).json({ message: "Cart emptied", cart: [] });
});

// ==================== WISHLIST ====================
app.get("/api/wishlist", requireCustomer, (req, res) => {
  res.status(200).json({ wishlist: getCustomerWishlist(req.customer.id) });
});

function handleAddToWishlist(req, res) {
  const { email, item, productId } = req.body;
  let customerId = req.customer?.id;
  if (!customerId && email) {
    const c = db.prepare("SELECT id FROM customers WHERE lower(email) = ?").get(email.trim().toLowerCase());
    if (c) customerId = c.id;
  }
  if (!customerId) return res.status(401).json({ error: "Please log in to save wishlist items." });

  const targetProductId = Number(productId || item?.id);
  if (!targetProductId) return res.status(400).json({ error: "Invalid product ID." });

  db.prepare("INSERT OR IGNORE INTO wishlist_items (customerId, productId) VALUES (?, ?)").run(
    customerId,
    targetProductId
  );

  res.status(200).json({
    message: "Item added to wishlist",
    wishlist: getCustomerWishlist(customerId),
  });
}

app.post("/api/add-to-wishlist", handleAddToWishlist);
app.post("/api/wishlist", requireCustomer, handleAddToWishlist);

app.delete("/api/wishlist/:productId", requireCustomer, (req, res) => {
  db.prepare("DELETE FROM wishlist_items WHERE customerId = ? AND productId = ?").run(
    req.customer.id,
    Number(req.params.productId)
  );
  res.status(200).json({ wishlist: getCustomerWishlist(req.customer.id) });
});

// ==================== COUPONS ====================
app.get("/api/coupons/vendor", requireVendor, (req, res) => {
  const coupons = db
    .prepare("SELECT * FROM coupons WHERE vendorId = ? ORDER BY id DESC")
    .all(req.vendor.id);
  res.status(200).json({ coupons });
});

app.post("/api/coupons", requireVendor, (req, res) => {
  const { name, value, minAmount, maxAmount, selectedProduct } = req.body;
  const code = (name || "").trim().toUpperCase();
  const discountVal = Number(value);

  if (!code || !Number.isFinite(discountVal) || discountVal <= 0 || discountVal > 95) {
    return res.status(400).json({ error: "Valid coupon code name and percentage (1-95) are required." });
  }

  const existing = db.prepare("SELECT id FROM coupons WHERE upper(name) = ?").get(code);
  if (existing) {
    return res.status(400).json({ error: "Coupon code already exists." });
  }

  const result = db
    .prepare(
      `INSERT INTO coupons (vendorId, name, value, minAmount, maxAmount, selectedProduct)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.vendor.id,
      code,
      discountVal,
      Number(minAmount || 0),
      Number(maxAmount || 0),
      selectedProduct || ""
    );

  const created = db.prepare("SELECT * FROM coupons WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ message: "Coupon created successfully", coupon: created });
});

app.delete("/api/coupons/:id", requireVendor, (req, res) => {
  const info = db
    .prepare("DELETE FROM coupons WHERE id = ? AND vendorId = ?")
    .run(Number(req.params.id), req.vendor.id);
  if (info.changes === 0) return res.status(404).json({ error: "Coupon not found" });
  res.status(200).json({ message: "Coupon deleted successfully" });
});

app.post("/api/coupons/apply", (req, res) => {
  const { code, subTotalPrice } = req.body;
  const cleanCode = (code || "").trim().toUpperCase();
  const subTotal = Number(subTotalPrice || 0);

  if (!cleanCode) return res.status(400).json({ error: "Please enter a coupon code." });
  const coupon = db.prepare("SELECT * FROM coupons WHERE upper(name) = ?").get(cleanCode);
  if (!coupon) return res.status(404).json({ error: "Coupon code doesn't exist!" });

  if (coupon.minAmount > 0 && subTotal < coupon.minAmount) {
    return res.status(400).json({
      error: `Minimum order amount for this coupon is $${coupon.minAmount}.`,
    });
  }
  if (coupon.maxAmount > 0 && subTotal > coupon.maxAmount) {
    return res.status(400).json({
      error: `Maximum order amount for this coupon is $${coupon.maxAmount}.`,
    });
  }

  const discountAmount = Number(((subTotal * coupon.value) / 100).toFixed(2));
  res.status(200).json({
    message: `Coupon ${coupon.name} applied (${coupon.value}% off)!`,
    coupon,
    discountAmount,
  });
});

// ==================== ORDERS ====================
app.post("/api/orders", requireCustomer, (req, res) => {
  const {
    cart,
    shippingAddress,
    paymentInfo,
    subTotalPrice,
    shipping,
    discountPrice,
    totalPrice,
    customerName,
    customerEmail,
    customerPhone,
  } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }
  if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.country || !shippingAddress.city) {
    return res.status(400).json({ error: "Complete shipping address is required." });
  }

  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.customer.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  try {
    db.exec("BEGIN TRANSACTION;");

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        orderNumber, customerId, customerName, customerEmail, customerPhone,
        shippingAddress, paymentInfo, subTotalPrice, shipping, discountPrice, totalPrice, orderStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing')
    `);

    const orderRes = insertOrder.run(
      orderNumber,
      customer.id,
      (customerName || customer.fullName).trim(),
      (customerEmail || customer.email).trim(),
      (customerPhone || customer.phoneNumber || "").trim(),
      JSON.stringify(shippingAddress),
      JSON.stringify(paymentInfo || { type: "Cash On Delivery", status: "Pending" }),
      Number(subTotalPrice || 0),
      Number(shipping || 0),
      Number(discountPrice || 0),
      Number(totalPrice || 0)
    );
    const orderId = Number(orderRes.lastInsertRowid);

    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, vendorId, vendorName, name, image_URL, discount_price, qty, isReviewed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    const updateStock = db.prepare(
      "UPDATE products SET stock = MAX(0, stock - ?), total_sell = total_sell + ? WHERE id = ?"
    );

    for (const item of cart) {
      const pid = Number(item.id || item.productId);
      const product = pid ? db.prepare("SELECT * FROM products WHERE id = ?").get(pid) : null;
      const vendorId = product ? product.vendorId : item.vendorId || 1;
      const vendor = db.prepare("SELECT companyName FROM vendors WHERE id = ?").get(vendorId);
      const itemQty = Math.max(1, Number(item.qty || 1));

      insertItem.run(
        orderId,
        product ? product.id : null,
        vendorId,
        vendor?.companyName || item.shop?.name || "Energy Matrix Vendor",
        product ? product.name : item.name,
        product ? product.image_URL : item.image_URL || "/Assets/solarpanel.jpg",
        Number(product ? product.discount_price : item.discount_price || 0),
        itemQty
      );

      if (product) {
        updateStock.run(itemQty, itemQty, product.id);
      }
    }

    db.prepare("DELETE FROM cart_items WHERE customerId = ?").run(customer.id);
    db.exec("COMMIT;");

    const created = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    return res.status(201).json({
      message: "Order placed successfully!",
      order: formatOrderRow(created),
    });
  } catch (error) {
    try {
      db.exec("ROLLBACK;");
    } catch {}
    console.error("Create order error:", error);
    return res.status(500).json({ error: "Failed to place order." });
  }
});

app.get("/api/orders/user", requireCustomer, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM orders WHERE customerId = ? ORDER BY id DESC")
    .all(req.customer.id);
  res.status(200).json({ orders: rows.map(formatOrderRow) });
});

app.get("/api/orders/vendor", requireVendor, (req, res) => {
  const rows = db
    .prepare(
      `SELECT DISTINCT o.* FROM orders o
       JOIN order_items oi ON oi.orderId = o.id
       WHERE oi.vendorId = ?
       ORDER BY o.id DESC`
    )
    .all(req.vendor.id);
  res.status(200).json({ orders: rows.map(formatOrderRow) });
});

app.get("/api/orders/:id", requireAnyAuth, (req, res) => {
  const param = req.params.id;
  let order = db.prepare("SELECT * FROM orders WHERE orderNumber = ?").get(param);
  if (!order && /^\d+$/.test(param)) {
    order = db.prepare("SELECT * FROM orders WHERE id = ?").get(Number(param));
  }
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (req.authUser.role === "customer" && order.customerId !== req.authUser.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.status(200).json({ order: formatOrderRow(order) });
});

app.put("/api/orders/:id/status", requireVendor, (req, res) => {
  const { status } = req.body;
  const allowed = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "Received",
    "On the way",
    "Delivered",
    "Processing refund",
    "Refund Success",
  ];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid order status." });
  }

  const param = req.params.id;
  let order = db.prepare("SELECT * FROM orders WHERE orderNumber = ?").get(param);
  if (!order && /^\d+$/.test(param)) {
    order = db.prepare("SELECT * FROM orders WHERE id = ?").get(Number(param));
  }
  if (!order) return res.status(404).json({ error: "Order not found" });

  db.prepare("UPDATE orders SET orderStatus = ? WHERE id = ?").run(status, order.id);
  if (status === "Delivered") {
    let payInfo = {};
    try {
      payInfo = JSON.parse(order.paymentInfo || "{}");
    } catch {}
    payInfo.status = "Succeeded";
    db.prepare("UPDATE orders SET paymentInfo = ? WHERE id = ?").run(
      JSON.stringify(payInfo),
      order.id
    );
  }

  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(order.id);
  res.status(200).json({ message: "Order status updated!", order: formatOrderRow(updated) });
});

app.post("/api/orders/:id/refund", requireCustomer, (req, res) => {
  const param = req.params.id;
  let order = db.prepare("SELECT * FROM orders WHERE orderNumber = ?").get(param);
  if (!order && /^\d+$/.test(param)) {
    order = db.prepare("SELECT * FROM orders WHERE id = ?").get(Number(param));
  }
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.customerId !== req.customer.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  db.prepare("UPDATE orders SET orderStatus = 'Processing refund' WHERE id = ?").run(order.id);
  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(order.id);
  res.status(200).json({ message: "Refund request submitted!", order: formatOrderRow(updated) });
});

// ==================== MESSAGES / INBOX ====================
app.get("/api/messages", requireAnyAuth, (req, res) => {
  const isCustomer = req.authUser.role === "customer";
  const rows = isCustomer
    ? db
        .prepare(
          `SELECT m.*, v.companyName AS vendorName, v.avatar AS vendorAvatar, c.fullName AS customerName
           FROM messages m
           JOIN vendors v ON m.vendorId = v.id
           JOIN customers c ON m.customerId = c.id
           WHERE m.customerId = ?
           ORDER BY m.id ASC`
        )
        .all(req.authUser.id)
    : db
        .prepare(
          `SELECT m.*, v.companyName AS vendorName, v.avatar AS vendorAvatar, c.fullName AS customerName, c.email AS customerEmail
           FROM messages m
           JOIN vendors v ON m.vendorId = v.id
           JOIN customers c ON m.customerId = c.id
           WHERE m.vendorId = ?
           ORDER BY m.id ASC`
        )
        .all(req.authUser.id);

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.conversationId]) {
      grouped[row.conversationId] = {
        conversationId: row.conversationId,
        customerId: row.customerId,
        customerName: row.customerName,
        customerEmail: row.customerEmail || "",
        vendorId: row.vendorId,
        vendorName: row.vendorName,
        vendorAvatar: row.vendorAvatar,
        messages: [],
      };
    }
    grouped[row.conversationId].messages.push({
      id: row.id,
      senderRole: row.senderRole,
      text: row.text,
      createdAt: row.createdAt,
    });
  }

  res.status(200).json({ conversations: Object.values(grouped) });
});

app.post("/api/messages", requireAnyAuth, (req, res) => {
  const { vendorId, customerId, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Message text cannot be empty." });
  }

  const targetCustomerId =
    req.authUser.role === "customer" ? req.authUser.id : Number(customerId);
  const targetVendorId =
    req.authUser.role === "vendor" ? req.authUser.id : Number(vendorId);

  if (!targetCustomerId || !targetVendorId) {
    return res.status(400).json({ error: "Both customer and vendor are required for a conversation." });
  }

  const conversationId = `conv-${targetCustomerId}-${targetVendorId}`;
  const result = db
    .prepare(
      `INSERT INTO messages (conversationId, customerId, vendorId, senderRole, text)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(conversationId, targetCustomerId, targetVendorId, req.authUser.role, text.trim());

  const created = db.prepare("SELECT * FROM messages WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ message: created, conversationId });
});

// ==================== CONTACT / QUOTE REQUESTS ====================
app.post("/api/contact", (req, res) => {
  const { firstName, lastName, email, mobile, company, city, message } = req.body;
  if (!firstName || !lastName || !city) {
    return res.status(400).json({ error: "First name, last name, and city are required." });
  }

  const result = db
    .prepare(
      `INSERT INTO contact_requests (firstName, lastName, email, mobile, company, city, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      firstName.trim(),
      lastName.trim(),
      (email || "").trim(),
      (mobile || "").trim(),
      (company || "").trim(),
      city.trim(),
      (message || "").trim()
    );

  res.status(201).json({
    message: "Your quote request has been submitted! Our team will contact you shortly.",
    id: Number(result.lastInsertRowid),
  });
});

app.listen(port, () => {
  console.log(`Energy Matrix backend server running on http://localhost:${port}`);
});
