"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controller/order.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), order_controller_1.placeOrder);
router.get("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), order_controller_1.getAllOrder);
router.patch("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), order_controller_1.getByUserId);
exports.default = router;
