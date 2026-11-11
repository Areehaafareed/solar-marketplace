const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadDirs = [
  path.join(__dirname, "..", "uploads"),
  path.join(__dirname, "..", "uploads", "profile-pictures"),
  path.join(__dirname, "..", "uploads", "license-pictures"),
  path.join(__dirname, "..", "uploads", "products-pictures"),
];
for (const dir of uploadDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const dbPath = process.env.DB_PATH || path.join(dataDir, "energy_matrix.db");
const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL,
    password TEXT NOT NULL,
    phoneNumber TEXT DEFAULT '',
    profilePicture TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER NOT NULL,
    addressType TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT DEFAULT '',
    zipCode TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    contactPersonName TEXT NOT NULL,
    contactEmail TEXT NOT NULL UNIQUE,
    contactNumber TEXT DEFAULT '',
    companyAddress TEXT DEFAULT '',
    businessLicense TEXT DEFAULT '',
    vatNumber TEXT DEFAULT '',
    description TEXT DEFAULT '',
    avatar TEXT DEFAULT '/Assets/hub.jpg',
    ratings REAL DEFAULT 4.5,
    password TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendorId INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    discount_price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    total_sell INTEGER NOT NULL DEFAULT 0,
    ratings REAL NOT NULL DEFAULT 4.5,
    image_URL TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    type TEXT NOT NULL DEFAULT 'product',
    capacity TEXT DEFAULT '',
    warranty TEXT DEFAULT '',
    features TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    customerId INTEGER,
    userName TEXT NOT NULL,
    avatar TEXT DEFAULT '/Assets/hub.jpg',
    rating REAL NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now')),
    UNIQUE(customerId, productId),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    UNIQUE(customerId, productId),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendorId INTEGER NOT NULL,
    name TEXT NOT NULL UNIQUE,
    value REAL NOT NULL,
    minAmount REAL DEFAULT 0,
    maxAmount REAL DEFAULT 0,
    selectedProduct TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderNumber TEXT NOT NULL UNIQUE,
    customerId INTEGER NOT NULL,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT DEFAULT '',
    shippingAddress TEXT NOT NULL,
    paymentInfo TEXT NOT NULL,
    subTotalPrice REAL NOT NULL,
    shipping REAL NOT NULL DEFAULT 0,
    discountPrice REAL NOT NULL DEFAULT 0,
    totalPrice REAL NOT NULL,
    orderStatus TEXT NOT NULL DEFAULT 'Processing',
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER,
    vendorId INTEGER,
    vendorName TEXT NOT NULL,
    name TEXT NOT NULL,
    image_URL TEXT NOT NULL,
    discount_price REAL NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    isReviewed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversationId TEXT NOT NULL,
    customerId INTEGER NOT NULL,
    vendorId INTEGER NOT NULL,
    senderRole TEXT NOT NULL,
    text TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (vendorId) REFERENCES vendors(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT DEFAULT '',
    mobile TEXT DEFAULT '',
    company TEXT DEFAULT '',
    city TEXT NOT NULL,
    message TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

function seedDatabase() {
  const vendorCount = db.prepare("SELECT COUNT(*) AS count FROM vendors").get().count;
  if (vendorCount > 0) return;

  const defaultPassHash = bcrypt.hashSync("password123", 10);

  const insertVendor = db.prepare(`
    INSERT INTO vendors (companyName, contactPersonName, contactEmail, contactNumber, companyAddress, description, avatar, ratings, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedVendors = [
    {
      companyName: "Electronics Hub",
      contactPersonName: "Ali Khan",
      contactEmail: "electronicshub@gmail.com",
      contactNumber: "+1 (555) 123-4567",
      companyAddress: "1234 Solar Street, Renewable City, Sunshine State",
      description:
        "E-HUB is a comprehensive online platform dedicated to the solar energy sector, supplying batteries, panels, and residential energy storage.",
      avatar: "/Assets/hub.jpg",
      ratings: 4.5,
    },
    {
      companyName: "Dawson Electrics",
      contactPersonName: "Mark Dawson",
      contactEmail: "dawson@energymatrix.com",
      contactNumber: "+1 (555) 234-5678",
      companyAddress: "45 Solar Avenue, Karachi",
      description: "High-efficiency residential and off-grid solar systems.",
      avatar: "/Assets/dawson.jpg",
      ratings: 4.5,
    },
    {
      companyName: "Smart Solarz Solutions",
      contactPersonName: "Sara Ahmed",
      contactEmail: "smartsolarz@energymatrix.com",
      contactNumber: "+1 (555) 345-6789",
      companyAddress: "78 Green Tech Park, Lahore",
      description: "Smart inverters and eco-friendly solar bundles.",
      avatar: "/Assets/smart.png",
      ratings: 4.2,
    },
    {
      companyName: "Amazon",
      contactPersonName: "Solar Direct Team",
      contactEmail: "amazon.solar@energymatrix.com",
      contactNumber: "+1 (555) 456-7890",
      companyAddress: "410 Terry Ave N, Seattle",
      description: "Outdoor lighting and industrial solar power solutions.",
      avatar: "/Assets/ama.png",
      ratings: 4.8,
    },
    {
      companyName: "Daraz",
      contactPersonName: "Zainab Malik",
      contactEmail: "daraz.solar@energymatrix.com",
      contactNumber: "+92 300 1234567",
      companyAddress: "Gulberg III, Lahore",
      description: "Portable solar chargers and smart home solar systems.",
      avatar: "/Assets/daraz.png",
      ratings: 4.5,
    },
    {
      companyName: "Honey's Air & Solar",
      contactPersonName: "Bilal Raza",
      contactEmail: "honeys@energymatrix.com",
      contactNumber: "+1 (555) 567-8901",
      companyAddress: "220 Sunbelt Road, Islamabad",
      description: "Solar water heaters, fans, and residential packages.",
      avatar: "/Assets/target.png",
      ratings: 4.4,
    },
    {
      companyName: "Shopping Express",
      contactPersonName: "Omar Farooq",
      contactEmail: "shoppingexpress@energymatrix.com",
      contactNumber: "+1 (555) 678-9012",
      companyAddress: "88 Commerce Way, Karachi",
      description: "Foldable solar chargers and mobile power accessories.",
      avatar: "/Assets/bestbuy.png",
      ratings: 4.6,
    },
    {
      companyName: "Kohl's",
      contactPersonName: "Hina Tariq",
      contactEmail: "kohls.solar@energymatrix.com",
      contactNumber: "+1 (555) 789-0123",
      companyAddress: "14 Garden Boulevard, Rawalpindi",
      description: "Garden solar lighting and premium residential bundles.",
      avatar: "/Assets/kohls.png",
      ratings: 4.6,
    },
  ];

  const vendorIdsByName = {};
  for (const v of seedVendors) {
    const res = insertVendor.run(
      v.companyName,
      v.contactPersonName,
      v.contactEmail,
      v.contactNumber,
      v.companyAddress,
      v.description,
      v.avatar,
      v.ratings,
      defaultPassHash
    );
    vendorIdsByName[v.companyName] = Number(res.lastInsertRowid);
  }

  // Seed demo customer
  const insertCustomer = db.prepare(`
    INSERT INTO customers (email, fullName, password, phoneNumber, profilePicture)
    VALUES (?, ?, ?, ?, ?)
  `);
  const customerRes = insertCustomer.run(
    "alice.smith@gmail.com",
    "Alice Smith",
    defaultPassHash,
    "+92 312 7685647",
    ""
  );
  const demoCustomerId = Number(customerRes.lastInsertRowid);

  db.prepare(`
    INSERT INTO addresses (customerId, addressType, country, city, address1, address2, zipCode)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    demoCustomerId,
    "Default",
    "PK",
    "SD",
    "Gulshan, A22 Commercial Street",
    "Block 13-D, Karachi",
    "75300"
  );

  // Seed products (IDs 1..9) and solar packages (IDs 101..107)
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, vendorId, name, description, category, tags, price, discount_price,
      stock, total_sell, ratings, image_URL, images, type, capacity, warranty, features
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (productId, customerId, userName, avatar, rating, comment)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seedProducts = [
    {
      id: 1,
      vendor: "Dawson Electrics",
      category: "Solar Panels",
      name: "High Efficiency Solar Panel",
      description:
        "High-efficiency solar panel for residential and commercial use. Generate clean energy and reduce your carbon footprint.",
      image_URL: "/Assets/solarpanel.jpg",
      price: 39.99,
      discount_price: 35.99,
      ratings: 4.5,
      total_sell: 50,
      stock: 20,
      reviews: [
        { user: "John", rating: 5, comment: "Great efficiency, highly recommended!" },
        { user: "Jane", rating: 4, comment: "Excellent product, very satisfied!" },
      ],
    },
    {
      id: 2,
      vendor: "Smart Solarz Solutions",
      category: "Solar Inverters",
      name: "Smart Solar Inverter",
      description:
        "Smart solar inverter with real-time monitoring. Efficiently convert solar energy into usable electricity.",
      image_URL: "/Assets/inverter.jpg",
      price: 59.99,
      discount_price: 54.99,
      ratings: 4.2,
      total_sell: 30,
      stock: 15,
      reviews: [
        { user: "Alice", rating: 4, comment: "Very smart and efficient inverter!" },
        { user: "Bob", rating: 5, comment: "Easy to install and great performance!" },
      ],
    },
    {
      id: 3,
      vendor: "Electronics Hub",
      category: "Solar Batteries",
      name: "Long Life Solar Battery",
      description:
        "Long-lasting lithium-ion battery for solar storage. Store excess energy during the day for use during the night or cloudy days.",
      image_URL: "/Assets/battery.jpg",
      price: 79.99,
      discount_price: 74.99,
      ratings: 4.0,
      total_sell: 25,
      stock: 12,
      reviews: [
        { user: "David", rating: 4, comment: "Great battery life, worth the price!" },
        { user: "Emily", rating: 4, comment: "Reliable performance, highly recommended!" },
      ],
    },
    {
      id: 4,
      vendor: "Amazon",
      category: "Solar Lights",
      name: "Outdoor Solar Lights Set",
      description:
        "Illuminate your outdoor space with this set of energy-efficient solar lights. Ideal for gardens, pathways, and outdoor decor.",
      image_URL: "/Assets/outdoor.png",
      price: 49.99,
      discount_price: 39.99,
      ratings: 4.8,
      total_sell: 40,
      stock: 18,
      reviews: [
        { user: "John", rating: 5, comment: "Great efficiency, highly recommended!" },
        { user: "Jane", rating: 5, comment: "Excellent product, very satisfied!" },
      ],
    },
    {
      id: 5,
      vendor: "Daraz",
      category: "Solar Chargers",
      name: "Portable Solar Charger",
      description:
        "Stay charged on the go with this portable solar phone charger. Perfect for camping, hiking, and outdoor adventures.",
      image_URL: "/Assets/portable.jpg",
      price: 30.99,
      discount_price: 24.99,
      ratings: 4.5,
      total_sell: 35,
      stock: 10,
      reviews: [
        { user: "Alice", rating: 5, comment: "Very handy for camping!" },
        { user: "Bob", rating: 4, comment: "Charges quickly in direct sunlight." },
      ],
    },
    {
      id: 6,
      vendor: "Honey's Air & Solar",
      category: "Solar Water Heaters",
      name: "Compact Water Heater",
      description:
        "Efficient and compact solar water heater for eco-friendly hot water solutions.",
      image_URL: "/Assets/water.jpg",
      price: 27.99,
      discount_price: 25.99,
      ratings: 4.7,
      total_sell: 30,
      stock: 20,
      reviews: [
        { user: "David", rating: 5, comment: "Great thermal retention, worth the price!" },
        { user: "Emily", rating: 4.5, comment: "Reliable performance, highly recommended!" },
      ],
    },
    {
      id: 7,
      vendor: "Shopping Express",
      category: "Solar Chargers",
      name: "Foldable Solar Charger",
      description:
        "Charge your devices on the go with this foldable solar phone charger.",
      image_URL: "/Assets/folder.jpg",
      price: 49.99,
      discount_price: 44.99,
      ratings: 4.0,
      total_sell: 45,
      stock: 14,
      reviews: [
        { user: "Alice", rating: 4, comment: "Compact and durable build!" },
        { user: "Bob", rating: 4, comment: "Easy to carry and great performance!" },
      ],
    },
    {
      id: 8,
      vendor: "Honey's Air & Solar",
      category: "Solar Fans",
      name: "Quiet Solar Powered Fan",
      description:
        "Stay cool with this quiet and energy-efficient solar-powered fan for your home or office.",
      image_URL: "/Assets/fan.jpg",
      price: 79.99,
      discount_price: 69.99,
      ratings: 4.1,
      total_sell: 35,
      stock: 9,
      reviews: [],
    },
    {
      id: 9,
      vendor: "Kohl's",
      category: "Solar Garden Lights",
      name: "Solar Garden Lights",
      description:
        "Enhance your garden with these decorative solar-powered LED lights for a magical ambiance.",
      image_URL: "/Assets/garden.jpg",
      price: 29.99,
      discount_price: 24.99,
      ratings: 4.6,
      total_sell: 30,
      stock: 12,
      reviews: [
        { user: "David", rating: 5, comment: "Beautiful warm glow at night!" },
        { user: "Emily", rating: 4.5, comment: "Reliable performance, highly recommended!" },
      ],
    },
  ];

  for (const p of seedProducts) {
    const vendorId = vendorIdsByName[p.vendor] || 1;
    insertProduct.run(
      p.id,
      vendorId,
      p.name,
      p.description,
      p.category,
      p.category.toLowerCase(),
      p.price,
      p.discount_price,
      p.stock,
      p.total_sell,
      p.ratings,
      p.image_URL,
      JSON.stringify([p.image_URL]),
      "product",
      "",
      "",
      "[]"
    );
    for (const r of p.reviews) {
      insertReview.run(p.id, null, r.user, "/Assets/hub.jpg", r.rating, r.comment);
    }
  }

  const seedPackages = [
    {
      id: 101,
      vendor: "Honey's Air & Solar",
      name: "Standard Solar Package",
      category: "Residential Solar Solutions",
      description:
        "Basic solar package for small households. Includes energy-efficient panels, easy installation, and smart monitoring.",
      image_URL: "/Assets/solar4.jpg",
      price: 1999.99,
      discount_price: 1876.99,
      capacity: "5 kW",
      warranty: "5 years",
      features: ["Energy-efficient", "Easy installation", "Smart monitoring"],
    },
    {
      id: 102,
      vendor: "Kohl's",
      name: "Premium Solar Package",
      category: "Residential Solar Solutions",
      description:
        "Advanced solar package for larger energy needs with high-efficiency panels, remote monitoring, and battery backup.",
      image_URL: "/Assets/premium.png",
      price: 2999.99,
      discount_price: 2742.99,
      capacity: "5.22 kW",
      warranty: "10 years",
      features: ["High efficiency", "Remote monitoring", "Battery backup"],
    },
    {
      id: 103,
      vendor: "Smart Solarz Solutions",
      name: "Eco-Friendly Solar Bundle",
      category: "Community Solar Projects",
      description:
        "Go green with our environmentally friendly solar bundle designed with sustainable materials and low carbon footprint.",
      image_URL: "/Assets/eco.jpg",
      price: 2499.99,
      discount_price: 2000.99,
      capacity: "8 kW",
      warranty: "7 years",
      features: ["Renewable energy", "Sustainable materials", "Low carbon footprint"],
    },
    {
      id: 104,
      vendor: "Daraz",
      name: "Smart Home Solar Solution",
      category: "Residential Solar Solutions",
      description:
        "Make your home smarter with our integrated solar solution featuring home automation and energy optimization.",
      image_URL: "/Assets/home.jpg",
      price: 3499.99,
      discount_price: 2566.99,
      capacity: "12 kW",
      warranty: "8 years",
      features: ["Home automation", "Energy optimization", "Voice control"],
    },
    {
      id: 105,
      vendor: "Dawson Electrics",
      name: "Off-Grid Power System",
      category: "Solar Energy Storage",
      description:
        "Gain independence with our off-grid solar power system with heavy-duty battery storage for remote locations.",
      image_URL: "/Assets/offgrid.jpg",
      price: 3999.99,
      discount_price: 3455.99,
      capacity: "15 kW",
      warranty: "12 years",
      features: ["Energy self-sufficiency", "Battery storage", "Remote locations"],
    },
    {
      id: 106,
      vendor: "Dawson Electrics",
      name: "Compact Solar Starter Kit",
      category: "Agricultural Solar Solutions",
      description:
        "Start your solar journey with our compact starter kit ideal for small spaces and quick setup.",
      image_URL: "/Assets/kit.jpg",
      price: 1799.99,
      discount_price: 1500.89,
      capacity: "3 kW",
      warranty: "5 years",
      features: ["Affordable", "Easy setup", "Ideal for small spaces"],
    },
    {
      id: 107,
      vendor: "Amazon",
      name: "Industrial Power Solution",
      category: "Industrial Solar Solutions",
      description:
        "Power your industrial operations with our robust 20 kW customizable solar solution using industrial-grade components.",
      image_URL: "/Assets/power.jpg",
      price: 5999.99,
      discount_price: 4000.99,
      capacity: "20 kW",
      warranty: "15 years",
      features: [
        "Heavy-duty performance",
        "Customizable configurations",
        "Industrial-grade components",
      ],
    },
  ];

  for (const pkg of seedPackages) {
    const vendorId = vendorIdsByName[pkg.vendor] || 1;
    insertProduct.run(
      pkg.id,
      vendorId,
      pkg.name,
      pkg.description,
      pkg.category,
      "solar package",
      pkg.price,
      pkg.discount_price,
      10,
      15,
      4.6,
      pkg.image_URL,
      JSON.stringify([pkg.image_URL]),
      "package",
      pkg.capacity,
      pkg.warranty,
      JSON.stringify(pkg.features)
    );
  }

  // Seed default coupons for Electronics Hub (id 1)
  db.prepare(`
    INSERT INTO coupons (vendorId, name, value, minAmount, maxAmount, selectedProduct)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(1, "SOLAR10", 10, 20, 5000, "");
  db.prepare(`
    INSERT INTO coupons (vendorId, name, value, minAmount, maxAmount, selectedProduct)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(1, "WELCOME20", 20, 50, 10000, "");

  // Seed 2 initial orders for Alice Smith / Electronics Hub so Order/Refund/Tracking views work immediately
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      orderNumber, customerId, customerName, customerEmail, customerPhone,
      shippingAddress, paymentInfo, subTotalPrice, shipping, discountPrice, totalPrice, orderStatus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (orderId, productId, vendorId, vendorName, name, image_URL, discount_price, qty, isReviewed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const o1 = insertOrder.run(
    "ORD-1001",
    demoCustomerId,
    "Alice Smith",
    "alice.smith@gmail.com",
    "+92 312 7685647",
    JSON.stringify({
      address1: "Gulshan, A22 Commercial Street",
      address2: "Block 13-D",
      city: "Karachi",
      country: "PK",
      zipCode: "75300",
    }),
    JSON.stringify({ type: "Cash On Delivery", status: "Pending" }),
    149.98,
    15.0,
    0,
    164.98,
    "Processing"
  );
  insertOrderItem.run(
    Number(o1.lastInsertRowid),
    3,
    vendorIdsByName["Electronics Hub"],
    "Electronics Hub",
    "Long Life Solar Battery",
    "/Assets/battery.jpg",
    74.99,
    2,
    0
  );

  const o2 = insertOrder.run(
    "ORD-1002",
    demoCustomerId,
    "Alice Smith",
    "alice.smith@gmail.com",
    "+92 312 7685647",
    JSON.stringify({
      address1: "Gulshan, A22 Commercial Street",
      address2: "Block 13-D",
      city: "Karachi",
      country: "PK",
      zipCode: "75300",
    }),
    JSON.stringify({ type: "Card", status: "Succeeded" }),
    35.99,
    3.6,
    0,
    39.59,
    "Delivered"
  );
  insertOrderItem.run(
    Number(o2.lastInsertRowid),
    1,
    vendorIdsByName["Dawson Electrics"],
    "Dawson Electrics",
    "High Efficiency Solar Panel",
    "/Assets/solarpanel.jpg",
    35.99,
    1,
    0
  );
}

seedDatabase();

module.exports = { db };
