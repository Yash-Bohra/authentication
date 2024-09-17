const express = require("express")
const app = express()
users=[]
app.use(express.json())
function generateToken() {  //returns a random long string randomly 
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}
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
let foundUser = null
const userFound = users.find(function(u){
    if(u.username==username && u.password==password){
        return true
    }else{
        return false
    }
})
// for(let i=0;i<users.length;i++){
//     if(users[i].username==username && users[i].password==password){
//         foundUser = users[i]
//     }
// }
if(userFound){
    const token = generateToken()
    userFound.token = token
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
    const token = req.headers.token //headers not header
    // const userFound = null
    // for(let i=0; i<users.length;i++){
    //     if(users[i].token == token){
    //         userFound = users[i]
    //     }
    // }
    const userFound = users.find(function(u){
    if(u.token == token){
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