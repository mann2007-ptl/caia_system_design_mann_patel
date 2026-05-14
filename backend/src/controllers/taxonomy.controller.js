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

module.exports = {
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
    getAllTags,
    getConceptsByTag,
    getAllPatterns,
    getConceptsByPattern,
};
