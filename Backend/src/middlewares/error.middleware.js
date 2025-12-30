import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors && err.errors.length > 0 && { errors: err.errors })
        });
    }

    // Handle other errors
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

export { errorHandler };

