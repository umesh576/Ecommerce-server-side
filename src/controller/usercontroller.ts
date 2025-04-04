import { Request, Response } from "express";
import User from "../model/user.model";
import { hash, compare } from "../utils/bcrypt.utils";
import { generateToken } from "../utils/jwt.utils";
import { IPayload } from "../@types/global.types";
import { asyncHandler } from "../utils/asyncHandler.utils";
import CustomError from "../middleware/errorhandler.middleware";
import { getPagination } from "../utils/pagenation.utils";

// import { regex } from "uuidv4";

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { limit, page, query } = req.query;
  const queryLimit = parseInt(limit as string) || 10;
  const currentPage = parseInt(page as string) || 1;
  const skip = (currentPage - 1) * queryLimit;
  const filter: Record<string, any> = {};
  if (query) {
    filter.$or = [
      {
        fullName: { $regex: query, $options: "i" },
      },
      {
        lastName: { $regex: query, $options: "i" },
      },
      {
        phoneNumber: { $regex: query, $options: "i" },
      },
      {
        email: { $regex: query, $option: "i" },
      },
    ];
  }

  const users = await User.find(filter)
    .select("-password") // Exclude password from results
    .skip(skip)
    .limit(queryLimit)
    .sort({ createdAt: -1 });
  const totalCount = await User.countDocuments(filter);
  const pagination = getPagination(currentPage, queryLimit, totalCount);

  res.status(200).json({
    success: true,
    status: "success",
    data: {
      data: users,
      pagination,
    },
    message: "User fetched successfully!",
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  if (!body.password) {
    throw new CustomError("password is required", 400);
  }
  const hashedPassword = await hash(body.password);

  console.log(
    "👊 ~ user.controller.ts:11 ~ register ~ hashedPassword:",
    hashedPassword
  );

  //
  body.password = hashedPassword;

  const user = await User.create(body);
  // const user = new User()

  res.status(201).json({
    status: "success",
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { firstName, lastName, gender, phoneNumber } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      gender,
      phoneNumber,
    },
    { new: true }
  );

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(201).json({
    status: "success",
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  // 1. email pass <-- body

  const { email, password } = req.body;

  if (!email) {
    throw new CustomError("Email is required", 400);
  }

  if (!password) {
    throw new CustomError("Password is required", 400);
  }

  // 2.const user= user.findOne({email:email})

  const user = await User.findOne({ email });

  // 3 if !user ->  error
  if (!user) {
    throw new CustomError("Email or password does not match", 400);

    return;
  }

  // 4. compare hash

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new CustomError("Email or password does not match", 400);

    return;
  }

  const payload: IPayload = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  const token = generateToken(payload);

  console.log("👊 ~ user.controller.ts:151 ~ login ~ token:", token);

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({
      status: "success",
      success: true,
      message: "Login success",
      token,
    });
});
