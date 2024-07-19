const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALTROUNDS = 10;

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String, 
  email: String
});

userSchema.pre('save', async function(next) {
    try {
      if (!this.password || typeof this.password !== 'string') {
        throw new Error(`Password must be provided and must be a string; but it is: ${typeof this.password}`);
      }
  
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, SALTROUNDS);
      }
      next();
    } catch (error) {
      next(error); 
    }
  });

module.exports = mongoose.model('User', userSchema);
