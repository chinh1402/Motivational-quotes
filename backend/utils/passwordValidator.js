function passwordValidator(password) {
    if (password.length < 5) {
      return "Password must be at least 5 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[\W_]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
}
  
module.exports = passwordValidator;