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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT), // Convert to number
    secure: process.env.SMTP_PORT === "465", // Correct comparison
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendMail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOption = {
            from: `"${process.env.MAIL_FROM}" <${process.env.SMTP_EMAIL}>`,
            to: mailOptions.to,
            subject: mailOptions.subject, // Fixed typo
            html: mailOptions.html,
        };
        yield transporter.sendMail(mailOption);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMail = sendMail;
