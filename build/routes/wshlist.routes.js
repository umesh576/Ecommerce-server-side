"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controller/wishlist.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//add to wishlist
router.post("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.addToWishlist);
//clear wishlist
router.delete("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.clearWishlist);
//get users wishlist
router.get("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.getWishlist);
//remove product from wishlist
router.delete("/remove/:productId", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), wishlist_controller_1.removeFromWishlist);
exports.default = router;
