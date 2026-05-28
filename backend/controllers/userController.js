import User from "../models/User.js";
import UserPreference from "../models/UserPreferences.js";

// Get Profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const preferences = await UserPreference.findByUserId(req.user.id);
    res.json({
      success: true,
      data: {
        user,
        preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.update(req.user.id, { name, email });
    res.json({
      success: true,
      message: "Profile Updated Successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update User preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const preferences = await UserPreference.upsert(req.user.id, req.body);
    res.json({
      success: true,
      message: "Preferences Updated Successfully",
      data: { preferences },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const user = await User.findByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValid = await User.verifyPassword(
      currentPassword,
      user.password_hash,
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    await User.updatePassword(req.user.id, newPassword);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Account
export const deleteAccount = async (req, res, next) => {
  try {
    await User.delete(req.user.id);
    res.json({
      success: true,
      message: "Account Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
