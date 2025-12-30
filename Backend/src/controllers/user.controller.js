import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidEmail, validatePasswordStrength } from "../utils/validation.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError(404, "User not found");
        }
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};

    } catch (error) {
        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Something went wrong while generating access token");
    }
}


const registerUser = async(req,res,next) => {
    try {
        const {name,email,password,birthDate} = req.body;

        // Validate required fields
        if([name,email,password,birthDate].some((field)=> !field || field?.trim()==="")) {
            return next(new ApiError(400, "All fields are required"));
        }

        // Validate email format
        if(!isValidEmail(email)) {
            return next(new ApiError(400, "Invalid email format"));
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if(!passwordValidation.valid) {
            return next(new ApiError(400, passwordValidation.message));
        }
        
        // Check if user already exists
        const existedUser = await User.findOne({ email });
        if(existedUser) {
            return next(new ApiError(409, "User with this email already exists"));
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            birthDate
        });

        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if(!createdUser) {
            return next(new ApiError(500, "Something went wrong while registering user"));
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res.status(201)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
            success:true,
            message:"User registered successfully",
            data:createdUser
        });
    } catch (error) {
        return next(error);
    }
};

const loginUser = async(req,res,next) => {
    try {
        const {email,password} = req.body;

        // Validate required fields
        if([email,password].some((field)=> !field || field?.trim()==="")) {
            return next(new ApiError(400, "Both email and password are required"));
        }

        // Validate email format
        if(!isValidEmail(email)) {
            return next(new ApiError(400, "Invalid email format"));
        }

        // Find user
        const user = await User.findOne({ email });
        if(!user) { 
            return next(new ApiError(404, "User does not exist"));
        }

        // Check if user is active
        if(user.status !== "active") {
            return next(new ApiError(403, "User account is inactive"));
        }

        // Verify password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid) {
            return next(new ApiError(401, "Invalid password"));
        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
            success:true,
            message:"User logged in successfully",
            data: loggedInUser
        });
    } catch (error) {
        return next(error);
    }
};


const getCurrentUser = async(req,res,next) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        
        if(!user) {
            return next(new ApiError(404, "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        return next(error);
    }
};

const logoutUser = async(req,res,next) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: null
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        return next(error);
    }
};

const getAllUsers = async(req,res,next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password -refreshToken")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    limit,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        return next(error);
    }
};

const activateUser = async(req,res,next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if(!user) {
            return next(new ApiError(404, "User not found"));
        }

        if(user.status === "active") {
            return next(new ApiError(400, "User is already active"));
        }

        user.status = "active";
        await user.save();

        const updatedUser = await User.findById(userId).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

const deactivateUser = async(req,res,next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if(!user) {
            return next(new ApiError(404, "User not found"));
        }

        if(user.status === "inactive") {
            return next(new ApiError(400, "User is already inactive"));
        }

        user.status = "inactive";
        await user.save();

        const updatedUser = await User.findById(userId).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

const getUserProfile = async(req,res,next) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        
        if(!user) {
            return next(new ApiError(404, "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user
        });
    } catch (error) {
        return next(error);
    }
};

const updateProfile = async(req,res,next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;

        // Validate that at least one field is provided
        if(!name && !email) {
            return next(new ApiError(400, "At least one field (name or email) is required"));
        }

        // Validate email format if provided
        if(email && !isValidEmail(email)) {
            return next(new ApiError(400, "Invalid email format"));
        }

        // Check if email is already taken by another user
        if(email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if(existingUser) {
                return next(new ApiError(409, "Email is already taken"));
            }
        }

        // Update user
        const updateData = {};
        if(name) updateData.name = name;
        if(email) updateData.email = email;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        if(!updatedUser) {
            return next(new ApiError(404, "User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

const changePassword = async(req,res,next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if(!oldPassword || !newPassword) {
            return next(new ApiError(400, "Both old password and new password are required"));
        }

        // Validate new password strength
        const passwordValidation = validatePasswordStrength(newPassword);
        if(!passwordValidation.valid) {
            return next(new ApiError(400, passwordValidation.message));
        }

        // Get user with password
        const user = await User.findById(userId);
        if(!user) {
            return next(new ApiError(404, "User not found"));
        }

        // Verify old password
        const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
        if(!isOldPasswordValid) {
            return next(new ApiError(401, "Old password is incorrect"));
        }

        // Check if new password is same as old password
        const isSamePassword = await user.isPasswordCorrect(newPassword);
        if(isSamePassword) {
            return next(new ApiError(400, "New password must be different from old password"));
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return next(error);
    }
};

export { 
    registerUser, 
    loginUser, 
    getCurrentUser, 
    logoutUser,
    getAllUsers,
    activateUser,
    deactivateUser,
    getUserProfile,
    updateProfile,
    changePassword
};