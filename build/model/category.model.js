"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });
const Category = mongoose_1.default.model("category", categorySchema);
exports.default = Category;
