const router = require('express').Router()
const db = require('../models')
require('dotenv').config()
const axios = require('axios')
const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js")
const models = require('../models')


const API_KEY = process.env.API_KEY
const SECRET_STRING = process.env.SECRET_STRING


//router.get('/', (req, res) => {
//    console.log("blank account screen")
//    res.redirect('account/dashboard')
//})


// router.get('/', (req, res, next) => {
//     console.log("blank account screen")
//     next()
// })

router.get('/dashboard', async(req, res) => {
    console.log("dashboard should be rendereds")
    
    const decrypted = AES.decrypt(req.cookies.encryptedUserId, SECRET_STRING)
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    const user = await models.user.findByPk(plaintext)

    let user_holdings = await models.holding.findAll({
        where: {user_id: user.id}
    })
    let user_transactions = await models.transaction.findAll({
        where: {user_id: user.id}
    })
    //res.send(user_transactions)
    res.render('account/dashboard', {
        user: user,
        user_holdings:user_holdings,
        user_transactions:user_transactions
    })


})

router.get('/placetrade', async(req, res) => {
    console.log("trading window should be rendereds")
    const decrypted = AES.decrypt(req.cookies.encryptedUserId, SECRET_STRING)
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    const user = await models.user.findByPk(plaintext)
    res.render('account/placetrade',{user:user})

})

router.post('/placetrade', async (req, res) => {

    const decrypted = AES.decrypt(req.cookies.encryptedUserId, SECRET_STRING)
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    const user = await models.user.findByPk(plaintext)

    console.log("this should place a trade")
    console.log("tx table should be appended and user table + holdings table should be updated")
    const ticker = req.body.ticker
    const qty = req.body.quantity
    const orderType = req.body.ordertype
    let signedqty
    let transactionIsValid = true 
    let tradeMessage

    const holding = await models.holding.findOne({
        where: { user_id: user.id, ticker: ticker }
    })

    //If order is a buy, then check to see if cash is available. 
    // If order is a sell, check to see if shares are available
    let price = null
    try {
        let api_call = `https://cloud.iexapis.com/stable/tops?token=${API_KEY}&symbols=${ticker}`
        let api_result = await axios.get(api_call)
        price = api_result.data[0].lastSalePrice
    }
    catch (err) {
        console.log(err)
    }
    if(!price){
       tradeMessage = `trade has been received for ${qty} shares of ${ticker} but could not be executed due to an unsupported ticker or issue with our data vendor. Please contact support with any inquiries.`
        transactionIsValid = false
    }

    if (orderType === "Buy") {
        signedqty = qty
        const cashNeeded = price*qty
        if(cashNeeded > user.cashvalue){
            transactionIsValid = false
            tradeMessage = `$${cashNeeded} but only ${user.cashvalue} available`
        }
    } else if (orderType === "Sell") {
        signedqty = -1 * qty
        if(!holding || qty>holding.holding_size){
            transactionIsValid = false
            tradeMessage = "not enough shares to execute this sell order"
        }
    }
    if(isNaN(qty)){
        transactionIsValid = false
        tradeMessage = "please enter a numerical share count!"
    }
    if(qty<0){
        transactionIsValid = false
        tradeMessage = "please enter a positive share count!"
    }



    const costOfTransaction = price * signedqty

    if (transactionIsValid) {
        const appendTx = await models.transaction.create({
            user_id: user.id,
            ticker: ticker,
            buy_or_sell: orderType,
            tx_price: price,
            tx_qty: qty
        })


        if (!holding) {

            const newHolding = await models.holding.create({
                user_id: user.id,
                ticker: ticker,
                latest_price: price,
                holding_size: signedqty
            })
        } else {
            const updatedHolding = await holding.update({
                holding_size: parseFloat(holding.holding_size) + parseFloat(signedqty),
                latest_price: price
            })

        }

        const updateUser = await user.update({
            cashvalue: user.cashvalue - costOfTransaction
        })

    tradeMessage = `Your ${orderType} order was entered for ${qty} shares of ${ticker} at price $${price}`

    } 

    console.log(holding)



    res.render('account/placetrade', { message: tradeMessage , user:user})
})

router.post('/addcomment',async(req,res)=>{
    const decrypted = AES.decrypt(req.cookies.encryptedUserId, SECRET_STRING)
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    const user = await models.user.findByPk(plaintext)
    res.render('account/placetrade',{user:user,message:"comment added!"})

    const appendTx = await models.transaction.create({
        user_id: user.id,
        comment:req.body.comment
    })
        
})


module.exports = router

