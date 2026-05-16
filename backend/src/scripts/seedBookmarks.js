const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Prompt = require("../models/prompt.model");

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅  Connected to MongoDB");

        // Find 2 random prompts and set isBookmarked to true
        const prompts = await Prompt.find().limit(2);

        if (prompts.length === 0) {
            console.log("⚠️  No prompts found in the database. Please run other seeders first.");
            return;
        }

        for (const prompt of prompts) {
            prompt.isBookmarked = true;
            await prompt.save();
        }

        console.log(`✅  Successfully bookmarked ${prompts.length} concepts for testing.`);
    } catch (error) {
        console.error("❌  Error seeding bookmarks data:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌  Disconnected from MongoDB");
    }
}

seed();
