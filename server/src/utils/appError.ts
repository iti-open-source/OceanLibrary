class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // client errors are fail and server errors are error
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    // handled errors are considered operational
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
