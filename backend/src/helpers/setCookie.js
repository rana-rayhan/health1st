const setAccessTokenCookie = (res, token) => {
  res.cookie("accessToken", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production, false in development
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None for production, Lax for development
  });
};
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production, false in development
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None for production, Lax for development
  });
};

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
};
