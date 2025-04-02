"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controller/review.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
// create review
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), review_controller_1.create);
router.put("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), review_controller_1.update);
// get all reviews
router.get("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), review_controller_1.getAll);
router.get("/:productId", review_controller_1.getAll);
exports.default = router;
