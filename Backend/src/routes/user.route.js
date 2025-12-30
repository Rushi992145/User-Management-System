import Router from "express";
import { 
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
} from "../controllers/user.controller.js";

import { varifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes - User functions
router.get("/me", varifyJWT, getCurrentUser);
router.post("/logout", varifyJWT, logoutUser);
router.get("/profile", varifyJWT, getUserProfile);
router.put("/profile", varifyJWT, updateProfile);
router.put("/change-password", varifyJWT, changePassword);

// Protected routes - Admin functions
router.get("/all", varifyJWT, verifyAdmin, getAllUsers);
router.put("/activate/:userId", varifyJWT, verifyAdmin, activateUser);
router.put("/deactivate/:userId", varifyJWT, verifyAdmin, deactivateUser);

export default router;