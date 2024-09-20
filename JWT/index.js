const express = require("express")
const jwt = require("jsonwebtoken")
const JWT_SECRET = ""
const app = express()
users=[]
app.use(express.json())
console.log(__dirname)
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
})
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
function auth(req,res,next){
    const token = req.headers.token
    const decodedUsername = jwt.verify(token,JWT_SECRET)
    if(decodedUsername.username){
        req.username = decodedUsername.username 
        next()
    }else{
        res.json({
            msg:`You are not logged in !`
        })
    }

}
app.get("/me", auth, function(req,res){
    const userFound = users.find(function(u){
    if(u.username == req.username){
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
