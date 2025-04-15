const levels = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  debug: "DEBUG",
};

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${levels[level]}] ${message}`;
}

export const logger = {
  info(message) {
    const formatted = formatMessage("info", message);
    console.log(formatted);
  },

  warn(message) {
    const formatted = formatMessage("warn", message);
    console.warn(formatted);
  },

  error(message) {
    const formatted = formatMessage("error", message);
    console.error(formatted);
  },

  debug(message) {
    if (process.env.NODE_ENV !== "production") {
      const formatted = formatMessage("debug", message);
      console.debug(formatted);
    }
  },
};
