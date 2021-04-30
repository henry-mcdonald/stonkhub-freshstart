const mongoose = require('mongoose')

const holdingSchema = new mongoose.Schema({
   user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ticker: String,
  latest_price: Number,
  holding_size: Number
},{
  timestamps: true
})

const Holding = mongoose.model('Holding', holdingSchema)
module.exports = Holding