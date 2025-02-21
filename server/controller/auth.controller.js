import errorHandler from "../middleware/error.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return errorHandler(res, 400, "All fields are required");
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return errorHandler(res, 400, "Email already exists");
    const hashPassword =await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashPassword,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return errorHandler(res, 400, "All fields are required");
  }
  console.log(password)
  try {
    const existingUser = await User.findOne({ email });
    console.log("existing",existingUser);
    if (!existingUser) return errorHandler(res, 400, "user not found");
    const isMatch = await bcrypt.compare(password, existingUser.password);
    
    if (!isMatch) return errorHandler(res, 401, "Invalid password");
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const userObj = existingUser.toObject();
    delete userObj.password;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
      })
      .json(userObj);
      return;
  } catch (error) {
    next(error);
  }
};
