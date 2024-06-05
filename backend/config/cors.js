const { FRONTEND_BASE_URL } = require("../utils/constants");

const corsOptions = {
  origin: FRONTEND_BASE_URL,
  // optionsSuccessStatus: 200,
};

module.exports = {
  corsOptions
};