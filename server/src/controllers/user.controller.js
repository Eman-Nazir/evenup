import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { upload } from '../middlewares/upload.middleware.js';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary.js';
import { getDashboardSummary } from '../services/dashboard.service.js';

import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true }
  );

  successResponse(res, 200, 'Profile updated successfully', { user });
});

export const uploadAvatar = [
  upload.single('avatar'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError('No file uploaded', 400);

    const result = await uploadBufferToCloudinary(req.file.buffer, 'evenup/avatars');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: { url: result.secure_url, publicId: result.public_id } },
      { new: true }
    );

    successResponse(res, 200, 'Avatar updated successfully', { user });
  }),
];

export const getDashboard = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary(req.user._id);
  successResponse(res, 200, 'Dashboard summary fetched successfully', { summary });
});