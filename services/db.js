//import mongoose
const mongoose = require('mongoose')

//connect server and mongoDB
mongoose.connect('mongodb://localhost:27017/bank', {
    useNewUrlParser: true
})

//model creation for User
const User = mongoose.model('User',{
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transaction: []
})

//model creation for Transaction
const Transaction=mongoose.model('Transaction',{
    "amount":Number,
    "type":String
})

//export model
module.exports={
    User
} 