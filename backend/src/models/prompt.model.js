// Import mongoose
const mongoose = require("mongoose");

// Define the schema for our prompt data
const promptDataSchema = new mongoose.Schema(
    {
        prompt: {
            type: String,
            required: true,
            trim: true,
        },

        response: {
            type: String,
            required: true,
        },

        metadata: {
            category: {
                type: String,
                required: true,
            },
            subcategory: {
                type: String,
                required: true,
            },
            concept: {
                type: String,
                required: true,
            },
            question_type: {
                type: String,
                required: true,
            },
            generated_at: {
                type: Date,
                required: true,
            },
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);

// Create the model
// 3rd argument "data" tells Mongoose to use the "data" collection (not the default "prompts")
const Prompt = mongoose.model("Prompt", promptDataSchema, "data");

// Export the model so we can use it in other files
module.exports = Prompt;
