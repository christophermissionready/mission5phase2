#!/usr/bin/env node

const { MongoClient } = require("mongodb");
const { program } = require("commander");
const fs = require("fs");
require("dotenv").config();

// Load environment variables
const {
  MONGO_URI,
  DB_NAME,
  COLLECTION_NAME,
  MONGO_USERNAME,
  MONGO_PASSWORD,
} = process.env;

// CLI definition
program
  .version("1.0.0")
  .description("Auction Items Seeder for MongoDB")
  .option("-f, --file <path>", "Path to the JSON file containing auction items", "auction_items.json")
  .parse(process.argv);

// Main seed function
async function seedData(filePath) {
  try {
    // Build the connection string with authentication
    const uri = MONGO_URI || `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017`;

    const client = new MongoClient(uri, {
      auth: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
      }
    });

    await client.connect();
    console.log(`Connected to MongoDB at: ${uri}`);

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Read and parse JSON file
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Clear existing data
    await collection.deleteMany({});
    console.log("Cleared existing data from the collection.");

    // Insert new data
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} items into the "${COLLECTION_NAME}" collection.`);

    await client.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("Error seeding data:", err.message);
    process.exit(1);
  }
}

// Execute seed function
seedData(program.opts().file);
