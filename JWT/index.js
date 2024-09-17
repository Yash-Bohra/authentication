const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "iamYASHBOHRA"
const app = express()
users=[]
app.use(express.json())
app.post("/sign-up",function(req,res){
const username = req.body.username;
const password = req.body.password;
users.push({
    username:username,
    password:password
})
res.json({
    msg:`account created successfully`
})
console.log(users)
})
app.post("/sign-in",function(req,res){
const username = req.body.username
const password = req.body.password
const userFound = users.find(function(u){
    if(u.username==username && u.password==password){
        return true
    }else{
        return false
    }
})
if(userFound){
    const token = jwt.sign({        //converting username into a JWT token using JWT_SECRET
        username:username 
    }, JWT_SECRET )
    res.json({
        token:token
    })
    console.log(users)
}else{
    res.status(403).send({
        msg:`invalid username or password`
    })
}
})
app.get("/me", function(req,res){
    const token = req.headers.token
    const decodedUsername = jwt.verify(token,JWT_SECRET)  //get original username using JWT_SECRET
    const username = decodedUsername.username
    const userFound = users.find(function(u){
    if(u.username == username){
        return true;
    }else{
        return false;
    }
    })
    if(userFound){
        res.json({
            username:userFound.username,
            password:userFound.password
        })
    }else{
        res.json({
            msg:`token expired or invalid token; please try logging in`
        })
    }
})
app.listen(3000)