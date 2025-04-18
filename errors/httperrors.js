// errors/error.js

class CustomAPIError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  class BadRequestError extends CustomAPIError {
    constructor(message) {
      super(message, 400);
    }
  }
  
  class UnAuthenticatedError extends CustomAPIError {
    constructor(message) {
      super(message, 401);
    }
  }
  
  // module.exports = {
  //   CustomAPIError,
  //   BadRequestError,
  //   UnAuthenticatedError,
  // };
  
  // Or using ES Modules syntax (if your package.json has "type": "module")
  export { CustomAPIError, BadRequestError, UnAuthenticatedError };