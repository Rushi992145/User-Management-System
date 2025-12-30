// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Validate password strength and return detailed message
export const validatePasswordStrength = (password) => {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" };
    }
    if (password.length > 12) {
        return { valid: false, message: "Password must be at most 12 characters long" };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    if (!/[@$!%*?&]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character (@$!%*?&)" };
    }
    return { valid: true, message: "Password is valid" };
};

