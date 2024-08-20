function validateSignUpInput(username, password, email) {
    if (!username || !password || !email) {
      return "All fields are required";
    }
    if (username.length < 3 || username.length > 30) {
      return "Username must be between 3 and 30 characters long";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email must be valid";
    }
    return null;
}
  
module.exports = validateSignUpInput;