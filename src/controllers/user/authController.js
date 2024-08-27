const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // Built-in Node.js module for generating tokens
const { sendEmail } = require("../../utils/emailService");
const { generateAuthToken } = require("../../middleware/authMiddleware");
const AppError = require("../../utils/appError"); // Assuming you have a custom error class

// Function 1: Signup
exports.signup = async (req, res, next) => {
  try {
    // Input validation (use Joi or similar for robust validation)
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400)); // Conflict error
    }

    const newUser = await User.create(req.body);
    const token = generateAuthToken(newUser._id);

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error); // 오류 로그 추가
    next(error);
  }
};

// Function 2: Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // Include password field
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401)); // Unauthorized error
    }

    // const token = generateAuthToken(user._id);
    const userData = user.toObject();
    delete userData.password;
    delete userData.fullName;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// Function 3: Get current logged-in user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // Assuming you have an auth middleware in place
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Function 4: Check Email Validation
exports.checkEmail = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("이메일중복", existingUser);
      return res.status(200).json({ message: "이미 존재하는 이메일입니다!!!" });
    }
    return res.status(200).json({ message: false });
  } catch (error) {
    console.error("Error during email validation:", error);
    next(new AppError("Server error during email validation", 500));
  }
};

// Function 5: Check UserName Validation
exports.checkUserName = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      console.log("닉네임중복", existingUser);
      return res.status(200).json({ message: "이미 존재하는 닉네임입니다!!!" });
    }
    return res.status(200).json({ message: false });
  } catch (error) {
    console.error("Error during username validation:", error);
    next(new AppError("Server error during username validation", 500));
  }
};

// Function 6: Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("No user found with that email", 404));
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // Skip validation to save only the token

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`; // Adjust if your setup is different

    // Send email
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on this link to reset your password: ${resetURL}.\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      });

      res.status(200).json({ message: "Token sent to email" });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new AppError("Unable to send password reset email. Please try again", 500));
    }
  } catch (error) {
    next(error);
  }
};

// Function 7: Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    // Get token from URL, hash it
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    // Find user and check if the token is valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    // Change password, clear reset fields
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};