//import express
const express = require('express')

const dataService = require('./services/data.services')

const session = require('express-session')

const jwt = require('jsonwebtoken')

const cors=require('cors')
const req = require('express/lib/request')

//create app using express
const app = express()

//use cors
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))

//use session
app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}))

//parse JSON
app.use(express.json())

//application specific middleware
app.use((req, res, next) => {
    console.log("Application Specific Middleware");
    next()
})

//router specific middleware
const logMiddleware = (req, res, next) => {
    if (!req.session.currentAcno) {

        res.json({
            status: false,
            statusCode: 401,
            message: "Please log in"
        })
    }
    else {
        next()
    }
}

//jwt middleware
const jwtMiddleware = (req, res, next) => {
    try {
        //fetching token from request header
        const token = req.headers["x-access-token"]
        //token validation
        const data = jwt.verify(token, 'secretkey123')
        req.currentAcno = data.currentAcno
        next()
    }
    catch {
        res.json({
            status: false,
            statusCode: 401,
            message: "Please log in"
        })
    }
}

//token API- for testing
app.post('/token', jwtMiddleware, (req, res) => {
    res.send("Token : " + req.currentAcno)
})

//define default router
app.get('/', (req, res) => {
    res.status(401).send("GET")
})

app.post('/', (req, res) => {
    res.send("POST")
})

app.put('/', (req, res) => {
    res.send("PUT")
})

app.patch('/', (req, res) => {
    res.send("PATCH")
})

app.delete('/', (req, res) => {
    res.send("DELETE")
})


//register API
app.post('/register', (req, res) => {
    //console.log(req.body);
    dataService.register(req.body.acno, req.body.uname, req.body.password)
        .then(result => {
            //console.log(result);
            res.status(result.statusCode).json(result)
        })

})

//login API
app.post('/login', (req, res) => {
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
        .then(result => {
            console.log(result);
            res.status(result.statusCode).json(result)
        })
})

//deposit API
app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
        //console.log(result);
        res.status(result.statusCode).json(result)
    })
})


//withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.withdraw(req,req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})


//transaction API
app.post('/transaction', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.getTransaction(req.body.acno)
    .then(result => {
        console.log(result);
        res.status(result.statusCode).json(result)
    })})

//DeleteAcc Api
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result => {
        //console.log(result);
        res.status(result.statusCode).json(result)
    })
})

//set port
app.listen(3000, () => {
    console.log("Server started at port number 3000");
})