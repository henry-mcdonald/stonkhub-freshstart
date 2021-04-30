const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  hashedpassword: String,
  accountvalue: Number,
  cashvalue: Number,
  profile: String
},{
  timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports = User