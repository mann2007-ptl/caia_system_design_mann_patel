const mongoose = require("mongoose");

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
            language: {
                type: String,
                default: "",
            },
            difficulty: {
                type: String,
                default: "",
            },
            generated_at: {
                type: Date,
                required: true,
            },
        },
        views: {
            type: Number,
            default: 0,
        },
        isBookmarked: {
            type: Boolean,
            default: false,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Prompt = mongoose.model("Prompt", promptDataSchema, "data");

module.exports = Prompt;
