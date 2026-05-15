const Prompt = require("../models/prompt.model");

const getAllCategories = async (req, res) => {
    try {
        const categories = await Prompt.distinct("metadata.category");

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getCategoryDetails = async (req, res) => {
    try {
        const categoryName = req.params.category;

        const conceptCount = await Prompt.countDocuments({
            "metadata.category": categoryName,
        });

        if (conceptCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }

        const subcategories = await Prompt.distinct("metadata.subcategory", {
            "metadata.category": categoryName,
        });

        const concepts = await Prompt.distinct("metadata.concept", {
            "metadata.category": categoryName,
        });

        res.status(200).json({
            success: true,
            data: {
                category: categoryName,
                conceptCount: conceptCount,
                subcategories: subcategories,
                concepts: concepts,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getConceptsByCategory = async (req, res) => {
    try {
        const categoryName = req.params.category;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.category": categoryName };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts found for this category",
            });
        }

        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Prompt.distinct("metadata.subcategory");

        res.status(200).json({
            success: true,
            count: subcategories.length,
            data: subcategories,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllTags = async (req, res) => {
    try {
        const tags = await Prompt.distinct("metadata.concept");

        res.status(200).json({
            success: true,
            count: tags.length,
            data: tags,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getConceptsByTag = async (req, res) => {
    try {
        const tagName = req.params.tag;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.concept": tagName };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts found for this tag",
            });
        }

        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllPatterns = async (req, res) => {
    try {
        const patterns = await Prompt.distinct("metadata.subcategory");

        res.status(200).json({
            success: true,
            count: patterns.length,
            data: patterns,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getConceptsByPattern = async (req, res) => {
    try {
        const patternName = req.params.patternName;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { "metadata.subcategory": patternName };

        const total = await Prompt.countDocuments(filter);

        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts found for this pattern",
            });
        }

        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// =============================================
// LANGUAGE ROUTES
// =============================================

// GET /api/v1/languages — fetch all supported languages
const getAllLanguages = async (req, res) => {
    try {
        // "distinct" returns an array of unique values for the given field
        const languages = await Prompt.distinct("metadata.language");

        res.status(200).json({
            success: true,
            count: languages.length,
            data: languages,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/languages/:language — fetch concepts that belong to a specific language
const getConceptsByLanguage = async (req, res) => {
    try {
        // Get the language name from the URL   e.g. /languages/JavaScript
        const languageName = req.params.language;

        // Pagination — defaults: page 1, 10 items per page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { "metadata.language": languageName };

        // Count how many documents match
        const total = await Prompt.countDocuments(filter);

        // If nothing matches, return 404
        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts found for this language",
            });
        }

        // Fetch the matching documents with pagination
        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// =============================================
// DIFFICULTY ROUTES
// =============================================

// GET /api/v1/difficulty — fetch all difficulty levels
const getAllDifficulties = async (req, res) => {
    try {
        // "distinct" returns an array of unique values for the given field
        const difficulties = await Prompt.distinct("metadata.difficulty");

        res.status(200).json({
            success: true,
            count: difficulties.length,
            data: difficulties,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/difficulty/:level — fetch concepts that match a specific difficulty level
const getConceptsByDifficulty = async (req, res) => {
    try {
        // Get the difficulty level from the URL   e.g. /difficulty/Intermediate
        const levelName = req.params.level;

        // Pagination — defaults: page 1, 10 items per page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { "metadata.difficulty": levelName };

        // Count how many documents match
        const total = await Prompt.countDocuments(filter);

        // If nothing matches, return 404
        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts found for this difficulty level",
            });
        }

        // Fetch the matching documents with pagination
        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// =============================================
// QUESTION-TYPE ROUTES
// =============================================

// GET /api/v1/question-types — fetch all available question types
const getAllQuestionTypes = async (req, res) => {
    try {
        // "distinct" returns an array of unique values for the given field
        const questionTypes = await Prompt.distinct("metadata.question_type");

        res.status(200).json({
            success: true,
            count: questionTypes.length,
            data: questionTypes,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// GET /api/v1/question-types/:type — fetch concepts that belong to a specific question type
const getConceptsByQuestionType = async (req, res) => {
    try {
        // Get the question type from the URL   e.g. /question-types/conceptual
        const typeName = req.params.type;

        // Pagination — defaults: page 1, 10 items per page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { "metadata.question_type": typeName };

        // Count how many documents match
        const total = await Prompt.countDocuments(filter);

        // If nothing matches, return 404
        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No concepts found for this question type",
            });
        }

        // Fetch the matching documents with pagination
        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// =============================================
// ARCHITECTURE ROUTES
// =============================================

// GET /api/v1/architectures/microservices — fetch all Microservices concepts
const getMicroservicesConcepts = async (req, res) => {
    try {
        // Pagination — defaults: page 1, 10 items per page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter for concepts whose category is "Microservices"
        const filter = { "metadata.category": "Microservices" };

        // Count how many documents match
        const total = await Prompt.countDocuments(filter);

        // If nothing matches, return 404
        if (total === 0) {
            return res.status(404).json({
                success: false,
                message: "No Microservices concepts found",
            });
        }

        // Fetch the matching documents with pagination
        const concepts = await Prompt.find(filter).skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: concepts.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: concepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
    getAllTags,
    getConceptsByTag,
    getAllPatterns,
    getConceptsByPattern,
    getAllLanguages,
    getConceptsByLanguage,
    getAllDifficulties,
    getConceptsByDifficulty,
    getAllQuestionTypes,
    getConceptsByQuestionType,
    getMicroservicesConcepts,
};
