const User = require("../../models/User");
const AppError = require("../../utils/appError"); // Assuming you have a custom error class

// Function 1: Change ThemeMode
exports.ChangeThemeMode = async (req, res, next) => {
  const userId = req.params.id; 
  const { themeMode } = req.body; 

  try {
    const user = await User.findByIdAndUpdate(userId, { themeMode: themeMode }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Theme mode updated successfully", user });
  } catch (error) {
    next(error);
  }
};