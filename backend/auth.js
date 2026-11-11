const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "energy_matrix_solar_secret_2026";
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf8");
}

function signToken(payload) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = base64UrlEncode(
    JSON.stringify({ ...payload, iat: now, exp: now + TOKEN_TTL_SECONDS })
  );
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(body));
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hashed) {
  if (!password || !hashed) return false;
  return bcrypt.compare(password, hashed);
}

function extractBearerToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  return null;
}

function requireCustomer(req, res, next) {
  const token = extractBearerToken(req);
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "customer") {
    return res.status(401).json({ error: "Authentication required. Please log in as a customer." });
  }
  req.customer = decoded;
  next();
}

function requireVendor(req, res, next) {
  const token = extractBearerToken(req);
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "vendor") {
    return res.status(401).json({ error: "Vendor authentication required. Please log in as a vendor." });
  }
  req.vendor = decoded;
  next();
}

function requireAnyAuth(req, res, next) {
  const token = extractBearerToken(req);
  const decoded = verifyToken(token);
  if (!decoded || !["customer", "vendor"].includes(decoded.role)) {
    return res.status(401).json({ error: "Authentication required." });
  }
  req.authUser = decoded;
  next();
}

module.exports = {
  signToken,
  verifyToken,
  hashPassword,
  comparePassword,
  requireCustomer,
  requireVendor,
  requireAnyAuth,
};
