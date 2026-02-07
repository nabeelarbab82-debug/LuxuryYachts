// Run this script to seed initial data to your MongoDB database
// Usage: node scripts/seed.js

const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://hammad:Hammad12345.@e-commerce.y3w9cfo.mongodb.net/dinner_cruise";

// Package Schema
const PackageSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
  description: String,
  inclusions: [String],
  featured: Boolean,
  order: Number,
  active: Boolean,
});

// FAQ Schema
const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
  order: Number,
  active: Boolean,
});

const Package =
  mongoose.models.Package || mongoose.model("Package", PackageSchema);
const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);

const packages = [
  {
    name: "Shared Dinner Cruise",
    type: "shared",
    price: 250,
    description: "Experience luxury dining with other guests",
    inclusions: [
      "Buffet dinner",
      "Soft drinks",
      "Live entertainment",
      "Standard seating",
      "2.5-3 hour cruise",
    ],
    featured: false,
    order: 1,
    active: true,
  },
  {
    name: "Premium Dinner Cruise",
    type: "premium",
    price: 450,
    description: "Elevated experience with premium service",
    inclusions: [
      "Plated premium menu",
      "Welcome drink",
      "Priority seating",
      "Live entertainment",
      "Complimentary photos",
    ],
    featured: true,
    order: 2,
    active: true,
  },
  {
    name: "VIP Private Deck",
    type: "vip",
    price: 750,
    description: "Exclusive private deck experience",
    inclusions: [
      "Private seating area",
      "Premium service",
      "Best views",
      "Dedicated host",
      "Premium beverages",
    ],
    featured: false,
    order: 3,
    active: true,
  },
  {
    name: "Full Yacht Buyout",
    type: "buyout",
    price: 0,
    description: "Complete yacht for your private event",
    inclusions: [
      "Exclusive yacht access",
      "Custom menu & décor",
      "Ideal for events",
      "Dedicated crew",
      "Flexible timing",
    ],
    featured: false,
    order: 4,
    active: true,
  },
];

const faqs = [
  {
    question: "Is this cruise suitable for families?",
    answer:
      "Yes! Our cruise is perfect for families with children of all ages. We provide a safe, comfortable environment with activities and entertainment suitable for everyone.",
    order: 1,
    active: true,
  },
  {
    question: "Are drinks included in the package?",
    answer:
      "Soft drinks are included in the Shared Dinner package. Premium packages include welcome drinks and select beverages. Alcoholic drinks can be purchased separately onboard.",
    order: 2,
    active: true,
  },
  {
    question: "Can we book the entire yacht for a private event?",
    answer:
      "Absolutely! We offer full yacht buyout options for up to 135 guests, perfect for corporate events, weddings, anniversaries, and other special celebrations. Contact us for custom packages.",
    order: 3,
    active: true,
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellations made 48 hours or more before the cruise receive a full refund. Cancellations within 24-48 hours receive 50% refund. No refund for cancellations less than 24 hours before departure.",
    order: 4,
    active: true,
  },
  {
    question: "Is live entertainment included in all packages?",
    answer:
      "Yes, live entertainment and music are included in all our packages. We feature talented performers to enhance your dining experience.",
    order: 5,
    active: true,
  },
  {
    question: "What should I wear?",
    answer:
      "We recommend smart casual attire. Comfortable clothing is fine, but please avoid beachwear, flip-flops, or overly casual clothing. The evening can be breezy, so bringing a light jacket is advisable.",
    order: 6,
    active: true,
  },
  {
    question: "Is parking available at the marina?",
    answer:
      "Yes, Dubai Marina has ample parking facilities available. We recommend arriving 30 minutes before boarding time to find parking and check in comfortably.",
    order: 7,
    active: true,
  },
  {
    question: "Can dietary requirements be accommodated?",
    answer:
      "Yes, we can accommodate most dietary requirements including vegetarian, vegan, halal, and allergies. Please inform us of any special requirements when booking.",
    order: 8,
    active: true,
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await Package.deleteMany({});
    await FAQ.deleteMany({});
    console.log("✅ Cleared existing data");

    // Insert packages
    console.log("Inserting packages...");
    await Package.insertMany(packages);
    console.log("✅ Inserted packages");

    // Insert FAQs
    console.log("Inserting FAQs...");
    await FAQ.insertMany(faqs);
    console.log("✅ Inserted FAQs");

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
