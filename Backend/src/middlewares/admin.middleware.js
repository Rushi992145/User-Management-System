import { ApiError } from "../utils/ApiError.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized - User not authenticated");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(403, "Forbidden - Admin access required");
        }

        next();
    } catch (error) {
        next(error);
    }
};

