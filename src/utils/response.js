export const successResponse = (res, data, message, status = 200) => {
  res.status(status).json({
    status: "success",
    message,
    data,
  });
};
