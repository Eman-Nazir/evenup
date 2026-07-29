import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import * as authService from '../services/auth.service.js';
import env from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const sendAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  sendAuthCookies(res, accessToken, refreshToken);
  successResponse(res, 201, 'Account created successfully', { user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
  sendAuthCookies(res, accessToken, refreshToken);
  successResponse(res, 200, 'Logged in successfully', { user });
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);
  sendAuthCookies(res, accessToken, refreshToken);
  successResponse(res, 200, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  successResponse(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  successResponse(res, 200, 'User fetched successfully', { user: req.user });
});