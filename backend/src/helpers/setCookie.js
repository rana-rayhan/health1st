const setAccessTokenCookie = (res, token) => {
  res.cookie("accessToken", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    httpOnly: true,
    // secure: true,
    sameSite: "none",
  });
};
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    // secure: true,
    sameSite: "None",
  });
};

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
};
