const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const languages = ["JavaScript", "Python", "Java", "C++", "Go"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const collection = mongoose.connection.db.collection("data");
        const docs = await collection.find({}).toArray();
        console.log(`Found ${docs.length} documents`);

        let updatedCount = 0;

        for (const doc of docs) {
            await collection.updateOne(
                { _id: doc._id },
                {
                    $set: {
                        "metadata.language": pickRandom(languages),
                        "metadata.difficulty": pickRandom(difficulties),
                    },
                }
            );
            updatedCount++;
        }

        console.log(`Updated ${updatedCount} documents`);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
