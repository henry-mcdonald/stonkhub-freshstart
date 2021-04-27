const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const rowdy = require('rowdy-logger')
const axios = require('axios')
const models = require('./models')
const cookieParser = require('cookie-parser')
require('dotenv').config()
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js")



// Variables
const app = express();
const rowdyResults = rowdy.begin(app)

const SECRET_STRING = process.env.SECRET_STRING
const API_KEY = process.env.API_KEY

app.use(express.static(__dirname + "/public"))



// Middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('morgan')('tiny'))
app.set('view engine', 'ejs')
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

console.log("app is starting")

app.use(async(req, res, next) => {
    try{
    const decrypted = AES.decrypt(req.cookies.encryptedUserId,SECRET_STRING)
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    console.log(plaintext)
    user = await models.user.findByPk(plaintext)
    // console.log("billy")
    // console.log(user)
    // console.log("billy")
    req.user = user
    }
    catch(err){
        console.log("error in base")
        console.log(err)
        user = undefined
    }
    if(typeof(user) !== "undefined"){
        if(user === null){
        console.log("user does not exist! Invalid Cookie")
        } else{
            //console.log(user)
            console.log("User has been found in the system! Congrats")
        }
    }
    console.log("at base")
    console.log(res.user)
    console.log("at base again")
    //res.user = user
    console.log(res.user)
    next()
})



app.use('/user', require('./controllers/userController'))
app.use('/account', require('./controllers/accountController'))

app.get('/', async (req, res) => {
    console.log(req.user)
    console.log("index SHOULD be rednered")

    try{
    res.render('index',{user:req.user})
    //console.log(body)
    }
    catch(err){
        console.log("error in root")
        console.log(err)
    }
})


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`Server is listening on port ${PORT}`)
})