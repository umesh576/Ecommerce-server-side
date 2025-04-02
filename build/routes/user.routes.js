"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usercontroller_1 = require("../controller/usercontroller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
// register user
router.post("/", usercontroller_1.register);
// get all users
router.get("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), usercontroller_1.getAll);
// update user profile
router.put("/:id", (0, authentication_middleware_1.Authenticate)(), usercontroller_1.update);
// login
router.post("/login", usercontroller_1.login);
exports.default = router;
