import { asyncHandler } from "../utils/asyncHandler.utils";
import { Request, Response } from "express";
import { Cart } from "../model/cart.model";
import CustomError from "../middleware/errorhandler.middleware";
import Product from "../model/product.model";
import Order from "../model/order.model";
import { sendOrderConformationEmail } from "../utils/orderComformation.utils";
import { getPagination } from "../utils/pagenation.utils";

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }); /*.populate("item.product");*/
  if (!cart) {
    throw new CustomError("cart not foud", 404);
  }
  const products = await Promise.all(
    cart.items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new CustomError("product not found", 404);
      }
      return {
        product: product._id,
        quantity: item.quantity,
        totalPrice: Number(product.price) * item.quantity,
      };
    })
  );
  const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0);
  const order = new Order({
    user: userId,
    items: products,
    totalAmount,
  });
  const newOrder = await order.save();
  const pupulatedOrder = await Order.findById(newOrder._id).populate(
    "items.product"
  );
  if (!pupulatedOrder) {
    throw new CustomError("populated order not found", 400);
  }
  await sendOrderConformationEmail({
    to: req.user.email,
    orderDetails: {
      items: pupulatedOrder.items,
      orderId: pupulatedOrder.orderId,

      totalAmount: pupulatedOrder.totalAmount,
    },
  });
  await Cart.findByIdAndDelete(cart._id);
  res.status(201).json({
    success: true,
    status: "sucess",
    message: "Order placed sucess fully",
    data: order,
  });
});

export const getAllOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    page,
    limit,
    query,
    status,
    user,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  } = req.query;

  const currentPage = parseInt(page as string) || 1;
  const queryLimit = parseInt(limit as string) || 10;
  const skip = (currentPage - 1) * queryLimit;

  let filter: Record<string, any> = {};

  // Filter by status
  if (status) {
    filter.status = status;
  }

  // Filter by user
  if (user) {
    filter.user = user;
  }

  //text search query
  if (query) {
    filter.orderId = {
      $regex: query,
      $options: "i",
    };
  }

  // Filter by price range
  if (minAmount && maxAmount) {
    filter.totalAmount = {
      $gte: parseFloat(minAmount as string),
      $lte: parseFloat(maxAmount as string),
    };
  } else if (minAmount) {
    filter.totalAmount = { $gte: parseFloat(minAmount as string) };
  } else if (maxAmount) {
    filter.totalAmount = { $lte: parseFloat(maxAmount as string) };
  }

  // Filter by date range
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  } else if (startDate) {
    filter.createdAt = { $gte: new Date(startDate as string) };
  } else if (endDate) {
    filter.createdAt = { $lte: new Date(endDate as string) };
  }

  const orders = await Order.find(filter)
    .skip(skip)
    .limit(queryLimit)
    .sort({ createdAt: -1 }) // Most recent orders first
    .populate("items.product")
    .populate("user", "-password");

  const totalCount = await Order.countDocuments(filter);

  const pagination = getPagination(currentPage, queryLimit, totalCount);

  res.status(200).json({
    success: true,
    status: "success",
    data: {
      data: orders,
      pagination,
    },
    message: "Orders fetched successfully!",
  });
});

export const getByUserId = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const order = Order.findOne({ user: userId })
    .populate("items.product")
    .populate("user", "-password");
  res.status(201).json({
    sucess: true,
    status: "sucess",
    message: "Order fetched sucessfully",
    data: order,
  });
});

export const orderStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params._id;
  const { status } = req.body;
  if (!status) {
    throw new CustomError("status is required", 400);
  }
  if (!orderId) {
    throw new CustomError("status is required", 400);
  }
  const updatedOrder = Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  if (!updatedOrder) {
    throw new CustomError("order not found", 400);
  }
  res.status(201).json({
    sucess: true,
    status: "sucess",
    message: "Order status fetched sucessfully",
    data: updatedOrder,
  });
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params._id;
  if (!orderId) {
    throw new CustomError("status is required", 400);
  }
  const deleteOrder = Order.findByIdAndDelete(orderId);
  if (!deleteOrder) {
    throw new CustomError("order not found", 404);
  }
  res.status(201).json({
    sucess: true,
    status: "sucess",
    message: "Order deleted sucessuflly",
    data: deleteOrder,
  });
});
// cancel the order
// check the user is and oderId if that was corrrect then oder can cancled otherwise errror

export const cancelOrder = asyncHandler;
