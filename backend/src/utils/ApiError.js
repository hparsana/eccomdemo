class ApiError extends Error {
  constructor(
    statusCode,
    message = "something is wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
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
      data: null,
      success: false,
      error: this.error,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export { ApiError };
