"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.getAll = exports.remove = exports.update = exports.create = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const product_model_1 = __importDefault(require("../model/product.model"));
const errorhandler_middleware_1 = __importDefault(require("../middleware/errorhandler.middleware"));
const deleteFiles_1 = require("../utils/deleteFiles");
const category_model_1 = __importDefault(require("../model/category.model"));
const pagenation_utils_1 = require("../utils/pagenation.utils");
exports.create = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const product = yield product_model_1.default.create(body);
    const { coverImage, images } = req.files;
    if (!coverImage) {
        throw new errorhandler_middleware_1.default("Cover image is required", 400);
    }
    product.coverImage = (_a = coverImage[0]) === null || _a === void 0 ? void 0 : _a.path;
    if (images && images.length > 0) {
        const imagePath = images.map((image, index) => image.path);
        product.images = imagePath;
    }
    yield product.save();
    res.status(201).json({
        status: "success",
        success: true,
        data: product,
        message: "Product created successfully!",
    });
}));
// update product
exports.update = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { deletedImages, name, description, price, categoryId } = req.body;
    const id = req.params.id;
    const { coverImage, images } = req.files;
    const product = yield product_model_1.default.findByIdAndUpdate(id, { name, description, price }, { new: true });
    if (!product) {
        throw new errorhandler_middleware_1.default("Product not found", 404);
    }
    if (categoryId) {
        const category = yield category_model_1.default.findById(categoryId);
        if (!category) {
            throw new errorhandler_middleware_1.default("Category not found", 404);
        }
        product.category = categoryId;
    }
    if (coverImage) {
        yield (0, deleteFiles_1.deleteFiles)([product.coverImage]);
        product.coverImage = (_a = coverImage[0]) === null || _a === void 0 ? void 0 : _a.path;
    }
    if (deletedImages && deletedImages.length > 0) {
        yield (0, deleteFiles_1.deleteFiles)(deletedImages);
        product.images = product.images.filter((image) => !deletedImages.includes(image));
    }
    if (images && images.length > 0) {
        const imagePath = images.map((image, index) => image.path);
        product.images = [...product.images, ...imagePath];
    }
    yield product.save();
    res.status(201).json({
        status: "success",
        success: true,
        data: product,
        message: "Product updated successfully!",
    });
}));
// delete product
exports.remove = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new errorhandler_middleware_1.default("Product not found", 404);
    }
    if (product.images && product.images.length > 0) {
        yield (0, deleteFiles_1.deleteFiles)(product.images);
    }
    yield product_model_1.default.findByIdAndDelete(product._id);
    res.status(201).json({
        status: "success",
        success: true,
        data: product,
        message: "Product deleted successfully!",
    });
}));
exports.getAll = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query, category, minPrice, maxPrice, sortBy = "createdAt", order = "DESC", } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (minPrice && maxPrice) {
        filter.price = {
            $lte: parseFloat(maxPrice),
            $gte: parseFloat(minPrice),
        };
    }
    if (query) {
        filter.$or = [
            {
                name: { $regex: query, $options: "i" },
            },
            {
                description: { $regex: query, $options: "i" },
            },
        ];
    }
    const products = yield product_model_1.default.find(filter)
        .skip(skip)
        .limit(queryLimit)
        .populate("createdBy")
        .populate("category")
        .sort({ [sortBy]: order === "DESC" ? -1 : 1 });
    const totalCount = yield product_model_1.default.countDocuments(filter);
    const pagination = (0, pagenation_utils_1.getPagination)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: "success",
        data: {
            data: products,
            pagination,
        },
        message: "Products fetched successfully!",
    });
}));
exports.getById = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_model_1.default.findById(id).populate("createdBy");
    res.status(200).json({
        success: true,
        status: "success",
        data: product,
        message: "Product fetched successfully!",
    });
}));
