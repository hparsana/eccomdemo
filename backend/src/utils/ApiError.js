class ApiError extends Error {
  constructor(
    statusCode,
    message = "something is wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    this.data = null;
    this.success = false;
    this.error = error;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Add a custom toJSON method to ensure message is included
  toJSON() {
    return {
      data: this.data,
      success: this.success,
      error: this.error,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export { ApiError };
