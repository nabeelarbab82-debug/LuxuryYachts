// Script to create an admin user
// Usage: node scripts/create-admin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  "mongodb+srv://hammad:Hammad12345.@e-commerce.y3w9cfo.mongodb.net/dinner_cruise";

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "superadmin"],
    default: "admin",
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Admin credentials
    const adminData = {
      email: "admin@arbyacht.com",
      password: "Admin@123",
      name: "Admin User",
      role: "superadmin",
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists with email:", adminData.email);
      console.log("\n📧 Email:", adminData.email);
      console.log("🔑 Password: (unchanged - use your existing password)");
      process.exit(0);
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Create admin
    console.log("Creating admin user...");
    await Admin.create({
      email: adminData.email,
      password: hashedPassword,
      name: adminData.name,
      role: adminData.role,
    });

    console.log("✅ Admin created successfully!");
    console.log("\n========================");
    console.log("ADMIN CREDENTIALS");
    console.log("========================");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);
    console.log("========================\n");
    console.log("⚠️  Please change the password after first login!");
    console.log("🌐 Login at: http://localhost:3000/admin/login\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  }
}

createAdmin();
