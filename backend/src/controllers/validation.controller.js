const mongoose = require("mongoose");

const validateConcept = async (req, res) => {
    try {
        const errors = [];

        if (!req.body.prompt || typeof req.body.prompt !== "string") {
            errors.push("'prompt' is required and must be a string.");
        }

        if (!req.body.response || typeof req.body.response !== "string") {
            errors.push("'response' is required and must be a string.");
        }

        if (!req.body.metadata || typeof req.body.metadata !== "object") {
            errors.push("'metadata' is required and must be an object.");
        } else {
            if (!req.body.metadata.category || typeof req.body.metadata.category !== "string") {
                errors.push("'metadata.category' is required and must be a string.");
            }

            if (!req.body.metadata.subcategory || typeof req.body.metadata.subcategory !== "string") {
                errors.push("'metadata.subcategory' is required and must be a string.");
            }

            if (!req.body.metadata.concept || typeof req.body.metadata.concept !== "string") {
                errors.push("'metadata.concept' is required and must be a string.");
            }

            if (!req.body.metadata.question_type || typeof req.body.metadata.question_type !== "string") {
                errors.push("'metadata.question_type' is required and must be a string.");
            }

            if (!req.body.metadata.generated_at) {
                errors.push("'metadata.generated_at' is required.");
            } else if (isNaN(Date.parse(req.body.metadata.generated_at))) {
                errors.push("'metadata.generated_at' must be a valid date string.");
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        return res.status(200).json({
            success: true,
            message: "Validation passed",
            data: {
                prompt: req.body.prompt,
                response: req.body.response,
                metadata: req.body.metadata
            }
        });
    } catch (error) {
        console.error("Error in validateConcept:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const validateConceptUpdate = async (req, res) => {
    try {
        const errors = [];
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            errors.push("':id' must be a valid MongoDB ObjectId (24-character hex string).");
        }

        const allowedFields = [
            "prompt", "response", "metadata", "views",
            "isBookmarked", "isArchived", "notes", "votes"
        ];

        const bodyKeys = Object.keys(req.body);
        const hasAtLeastOneField = bodyKeys.some((key) => allowedFields.includes(key));

        if (bodyKeys.length === 0) {
            errors.push("Request body cannot be empty. Provide at least one field to update.");
        } else if (!hasAtLeastOneField) {
            errors.push(`None of the provided fields are updatable. Allowed fields: ${allowedFields.join(", ")}`);
        }

        if (req.body.prompt !== undefined && typeof req.body.prompt !== "string") {
            errors.push("'prompt' must be a string.");
        }

        if (req.body.response !== undefined && typeof req.body.response !== "string") {
            errors.push("'response' must be a string.");
        }

        if (req.body.metadata !== undefined && typeof req.body.metadata !== "object") {
            errors.push("'metadata' must be an object.");
        }

        if (req.body.views !== undefined && typeof req.body.views !== "number") {
            errors.push("'views' must be a number.");
        }

        if (req.body.isBookmarked !== undefined && typeof req.body.isBookmarked !== "boolean") {
            errors.push("'isBookmarked' must be a boolean.");
        }

        if (req.body.isArchived !== undefined && typeof req.body.isArchived !== "boolean") {
            errors.push("'isArchived' must be a boolean.");
        }

        if (req.body.notes !== undefined && typeof req.body.notes !== "string") {
            errors.push("'notes' must be a string.");
        }

        if (req.body.votes !== undefined && typeof req.body.votes !== "number") {
            errors.push("'votes' must be a number.");
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        return res.status(200).json({
            success: true,
            message: "Validation passed",
            data: {
                id: id,
                fieldsToUpdate: bodyKeys.filter((key) => allowedFields.includes(key))
            }
        });
    } catch (error) {
        console.error("Error in validateConceptUpdate:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const validateSearch = async (req, res) => {
    try {
        const errors = [];
        const MAX_QUERY_LENGTH = 200;

        if (!req.body.query) {
            errors.push("'query' is required.");
        } else if (typeof req.body.query !== "string") {
            errors.push("'query' must be a string.");
        } else if (req.body.query.trim().length === 0) {
            errors.push("'query' cannot be empty or only whitespace.");
        } else if (req.body.query.trim().length > MAX_QUERY_LENGTH) {
            errors.push(`'query' must be at most ${MAX_QUERY_LENGTH} characters long.`);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        return res.status(200).json({
            success: true,
            message: "Validation passed",
            data: {
                query: req.body.query.trim()
            }
        });
    } catch (error) {
        console.error("Error in validateSearch:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const validateTags = async (req, res) => {
    try {
        const errors = [];

        if (!req.body.tags) {
            errors.push("'tags' is required.");
        } else if (!Array.isArray(req.body.tags)) {
            errors.push("'tags' must be an array.");
        } else if (req.body.tags.length === 0) {
            errors.push("'tags' array cannot be empty. Provide at least one tag.");
        } else {
            req.body.tags.forEach((tag, index) => {
                if (typeof tag !== "string") {
                    errors.push(`Tag at index ${index} must be a string.`);
                } else if (tag.trim().length === 0) {
                    errors.push(`Tag at index ${index} cannot be empty or only whitespace.`);
                }
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        const cleanedTags = req.body.tags.map((tag) => tag.trim());

        return res.status(200).json({
            success: true,
            message: "Validation passed",
            data: {
                tags: cleanedTags,
                count: cleanedTags.length
            }
        });
    } catch (error) {
        console.error("Error in validateTags:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const validateUpload = async (req, res) => {
    try {
        const errors = [];

        const ALLOWED_FILE_TYPES = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf", "application/json", "text/plain", "text/csv"
        ];

        const MAX_FILE_SIZE = 10 * 1024 * 1024;

        if (!req.body.filename) {
            errors.push("'filename' is required.");
        } else if (typeof req.body.filename !== "string") {
            errors.push("'filename' must be a string.");
        } else if (req.body.filename.trim().length === 0) {
            errors.push("'filename' cannot be empty or only whitespace.");
        }

        if (!req.body.fileType) {
            errors.push("'fileType' is required.");
        } else if (typeof req.body.fileType !== "string") {
            errors.push("'fileType' must be a string.");
        } else if (!ALLOWED_FILE_TYPES.includes(req.body.fileType)) {
            errors.push(`'fileType' must be one of: ${ALLOWED_FILE_TYPES.join(", ")}. Received: '${req.body.fileType}'`);
        }

        if (req.body.fileSize === undefined || req.body.fileSize === null) {
            errors.push("'fileSize' is required.");
        } else if (typeof req.body.fileSize !== "number") {
            errors.push("'fileSize' must be a number (in bytes).");
        } else if (req.body.fileSize <= 0) {
            errors.push("'fileSize' must be greater than 0.");
        } else if (req.body.fileSize > MAX_FILE_SIZE) {
            errors.push(`'fileSize' exceeds the maximum allowed size of ${MAX_FILE_SIZE} bytes (10 MB). Received: ${req.body.fileSize} bytes.`);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        }

        return res.status(200).json({
            success: true,
            message: "Validation passed",
            data: {
                filename: req.body.filename.trim(),
                fileType: req.body.fileType,
                fileSize: req.body.fileSize
            }
        });
    } catch (error) {
        console.error("Error in validateUpload:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    validateConcept,
    validateConceptUpdate,
    validateSearch,
    validateTags,
    validateUpload
};
