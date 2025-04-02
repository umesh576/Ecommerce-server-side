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
exports.clearWishlist = exports.getWishlist = exports.removeFromWishlist = exports.addToWishlist = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = __importDefault(require("../middleware/errorhandler.middleware"));
const product_model_1 = __importDefault(require("../model/product.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
//add to wishlist
exports.addToWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const user = req.user;
    if (!productId) {
        throw new errorhandler_middleware_1.default("Product Id is required", 404);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.default("Product not found", 404);
    }
    const userDocument = yield user_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.default("user not found", 404);
    }
    //if product exists already in watchlist
    if (userDocument.wishList.some((item) => item.toString() === productId)) {
        throw new errorhandler_middleware_1.default("Product already in wishlist", 400);
    }
    userDocument.wishList.push(new mongoose_1.default.Types.ObjectId(productId));
    yield userDocument.save();
    res.status(201).json({
        status: "success",
        success: true,
        message: "Product added to wishlist successfully!",
        data: userDocument.wishList,
    });
}));
// Remove product from wisilist
exports.removeFromWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    console.log(req.body);
    const user = req.user;
    if (!productId) {
        throw new errorhandler_middleware_1.default("Product Id is required", 400);
    }
    const userDocument = yield user_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.default("User not found", 404);
    }
    // Check if product exists in wishlist
    if (!userDocument.wishList.some((item) => item.toString() === productId)) {
        throw new errorhandler_middleware_1.default("Product not in wishlist", 404);
    }
    // Remove product from wishlist
    userDocument.wishList = userDocument.wishList.filter((item) => item.toString() !== productId);
    yield userDocument.save();
    res.status(200).json({
        status: "success",
        success: true,
        message: "Product removed from wishlist successfully!",
    });
}));
// Get user's wishlist
exports.getWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userDocument = yield user_model_1.default.findById(user._id).populate("wishList");
    if (!userDocument) {
        throw new errorhandler_middleware_1.default("User not found", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: userDocument,
        message: "Wishlist fetched successfully!",
    });
}));
// Clear entire wishlist
exports.clearWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userDocument = yield user_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.default("User not found", 404);
    }
    userDocument.wishList = [];
    yield userDocument.save();
    res.status(200).json({
        status: "success",
        success: true,
        message: "Wishlist cleared successfully!",
    });
}));
