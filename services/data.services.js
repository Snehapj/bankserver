//import jwt
const { use } = require('express/lib/application')
const jwt = require('jsonwebtoken')

const db = require('./db')

database = {
  1000: { acno: 1000, uname: "Neer", password: "1000", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Raja", password: "1001", balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "Ammu", password: "1002", balance: 5000, transaction: [] }

}

const register = (acno, uname, password) => {

  // let database = this.data
  return db.User.findOne({ acno })//asynchronous event :do not use semi coloumn
    .then(user => {
      if (user) {
        return {
          status: false,
          statusCode: 401,
          message: "Account already exist!!! Please log in "
        }
      }
      else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []

        })
        newUser.save()
        return {
          status: true,
          statusCode: 200,
          message: "Account successfully created"
        }
      }

    })

  // if (acno in database) {
  //   return {
  //     status: false,
  //     statusCode: 401,
  //     message: "Account already exist!!! Please log in "
  //   }

  // }
  // else {
  //   database[acno] = {
  //     acno,
  //     uname,
  //     password,
  //     balance: 0,
  //     transaction: []
  //   }
  //   console.log(database);
  //   return {
  //     status: true,
  //     statusCode: 200,
  //     message: "Account successfully created"
  //   }
  // }
}

const login = (acno, password) => {
  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (user) {
      currentUsername = user.uname

      //store acno in session
      //req.session.currentAcno = acno

      //token generation
      const token = jwt.sign({
        currentAcno: acno

      }, 'secretkey123')
      //console.log(req.session);

      return {
        status: true,
        statusCode: 200,
        message: "Login successfull",
        currentUsername: currentUsername,
        currentAcno: acno,
        token
      }

    }
    else {
      return {
        status: false,
        statusCode: 401,
        message: "Invalid accountno or password"
      }
    }
  })
  // if (acno in database) {
  //   if (pswd == database[acno]["password"]) {
  // currentUsername = database[acno]["uname"]

  // //store acno in session
  // //req.session.currentAcno = acno

  // //token generation
  // const token = jwt.sign({
  //   currentAcno: acno

  // }, 'secretkey123')
  // //console.log(req.session);

  // return {
  //   status: true,
  //   statusCode: 200,
  //   message: "Login successfull",
  //   currentUsername: currentUsername,
  //   currentAcno: acno,
  //   token
  // }

  //   }
  //   else {

  //     return {
  //       status: false,
  //       statusCode: 401,
  //       message: "Invalid password"
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     statusCode: 401,
  //     message: "User does not exist"
  //   }
  // }

}


const deposit = (acno, password, amt) => {
  var amount = parseInt(amt)
  // console.log(currentAcno);
  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (!user) {
      return {
        status: false,
        statusCode: 401,
        message: "Invalid accountno or password"
      }
    }

    user.balance += amount
    user.transaction.push({
      amount: amount,
      type: "CREDIT"
    })
    user.save()
    return {
      status: true,
      statusCode: 200,
      message: amount + "credited. New balance is :" + user.balance

    }

  })

  // if (acno in database) {
  //   if (pswd == database[acno]["password"]) {
  //     database[acno]["balance"] = database[acno]["balance"] + amount
  //     database[acno]["transaction"].push({
  //       amount: amount,
  //       type: "CREDIT"
  //     })

  //     return {
  //       status: true,
  //       statusCode: 200,
  //       message: amount + "credited. New balance is :" + database[acno]["balance"]

  //     }


  //   }
  //   else {
  //     return {
  //       status: false,
  //       statusCode: 401,
  //       message: "Invalid password"
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     statusCode: 401,
  //     message: "User does not exist"
  //   }
  // }
}


const withdraw = (req, acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (req.currentAcno != acno) {
      return {
        status: false,
        statusCode: 401,
        message: "Operation Denied"
      }
    }
    if (!user) {
      return {
        status: false,
        statusCode: 401,
        message: "Invalid accountno or password"
      }
    }
    if (user.balance < amount) {
      return {
        status: false,
        statusCode: 401,
        message: "Insufficient balance"
      }
    }

    user.balance -= amount
    user.transaction.push({
      amount: amount,
      type: "DEBIT"
    })
    user.save()
    return {
      status: true,
      statusCode: 200,
      message: amount + "debited. New balance is :" + user.balance

    }

  })

  // if (acno in database) {
  //   if (pswd == database[acno]["password"]) {
  //     if (database[acno]["balance"] > amount) {
  //       database[acno]["balance"] = database[acno]["balance"] - amount
  //       database[acno]["transaction"].push({
  //         amount: amount,
  //         type: "DEBIT"

  //       })

  //       return {
  //         status: true,
  //         statusCode: 200,
  //         message: amount + "debited. New balance is :" + database[acno]["balance"]

  //       }
  //     }
  //     else {
  //       return {
  //         status: false,
  //         statusCode: 401,
  //         message: "Insufficient balance"
  //       }
  //     }


  //   }
  //   else {
  //     return {
  //       status: false,
  //       statusCode: 401,
  //       message: "Invalid password"
  //     }
  //   }
  // }

  // else {
  //   return {
  //     status: false,
  //     statusCode: 401,
  //     message: "User does not exist"
  //   }
  // }
}


const getTransaction = (acno) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (!user) {
        return {
          status: false,
          statusCode: 401,
          message: "User does not exist"
        }
      }
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction

      }
    })
  // if (acno in database) {
  //   return {
  //     status: true,
  //     statusCode: 200,
  //     transaction: database[acno]["transaction"]

  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     statusCode: 401,
  //     message: "User does not exist"
  //   }
  // }
}


//deleteAcc
const deleteAcc = (acno) => {
  return db.User.deleteOne({
    acno
  }).then(user=>{
    if(!user){
      return {
            status: false,
            statusCode: 401,
            message: "User does not exist"
          }
    }
    return {
              status: true,
              statusCode: 200,
              message: "Account Number"+acno+"deleted successfully"
    
            }
  })
}


module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}