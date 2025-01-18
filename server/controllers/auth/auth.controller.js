import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const userRegister = async (req, res) => {
  const { username, email, password, role } = req.body;

  // check if username or email already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "username or email already exists",
    });
  }

  // create new user
  const newUser = new User({
    username,
    email,
    password,
    role,
  });

  await newUser.save();

  // send response
  res.status(201).json({
    success: true,
    message: "user registered successfully",
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "invalid credentials",
    });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    success: true,
    message: "user logged in successfully",
    data: {
      accessToken,
      user,
    },
  });
};

export { userRegister, userLogin };
