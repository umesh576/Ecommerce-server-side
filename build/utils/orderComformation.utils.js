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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConformationEmail = void 0;
// import mongoose from "mongoose";
const sendEmail_utils_1 = require("./sendEmail.utils");
const sendOrderConformationEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // const ;
    const { to, orderDetails } = options;
    const html = `
  <h1>Your order is placed sucessfully</h1>
  <p>OrderId:${orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.orderId}</p>
  <h1>Order:</h1>
  <ol>
    ${orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.items.map((item) => `<li>${item.product.name} -${item.product.price} X ${item.quantity}</li>`).join("")}
  </ol>
  <p>Total: Rs.${orderDetails === null || orderDetails === void 0 ? void 0 : orderDetails.totalAmount.toFixed(2)}</p>
  <P>Order garnu Bhayeko ma dhanybaad.</P>
  
  `;
    const mailOption = {
        html,
        subject: "orderplaced",
        to,
    };
    yield (0, sendEmail_utils_1.sendMail)(mailOption);
});
exports.sendOrderConformationEmail = sendOrderConformationEmail;
