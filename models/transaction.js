const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
user_id:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
ticker: String,
buy_or_sell: String,
tx_price: Number,
tx_qty: Number,
comment: String
},{
  timestamps: true
}
)
const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction