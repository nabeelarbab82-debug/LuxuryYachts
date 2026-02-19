// Script to debug admin login
// Usage: node scripts/debug-admin.js

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

async function debugAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const testEmail = "admin@arbyacht.com";
    const testPassword = "Admin@123";

    // Find admin
    console.log("\n🔍 Looking for admin with email:", testEmail);
    const admin = await Admin.findOne({ email: testEmail });

    if (!admin) {
      console.log("❌ Admin not found in database!");
      console.log("Run: node scripts/reset-admin.js");
      process.exit(1);
    }

    console.log("✅ Admin found!");
    console.log("\nAdmin Details:");
    console.log("- ID:", admin._id.toString());
    console.log("- Email:", admin.email);
    console.log("- Name:", admin.name);
    console.log("- Role:", admin.role);
    console.log("- Active:", admin.active);
    console.log("- Password Hash:", admin.password.substring(0, 20) + "...");

    // Check active status
    console.log("\n🔍 Checking active status...");
    if (!admin.active) {
      console.log("❌ Admin account is NOT active!");
      console.log("Setting admin to active...");
      admin.active = true;
      await admin.save();
      console.log("✅ Admin activated");
    } else {
      console.log("✅ Admin is active");
    }

    // Test password
    console.log("\n🔐 Testing password comparison...");
    console.log("Test password:", testPassword);

    const isValid = await bcrypt.compare(testPassword, admin.password);

    if (isValid) {
      console.log("✅ Password comparison SUCCESSFUL!");
      console.log("\n========================");
      console.log("Login should work with:");
      console.log("📧 Email:", testEmail);
      console.log("🔑 Password:", testPassword);
      console.log("========================\n");
    } else {
      console.log("❌ Password comparison FAILED!");
      console.log("The password in database doesn't match!");
      console.log("\nRun this to fix: node scripts/reset-admin.js");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  }
}

debugAdmin();
