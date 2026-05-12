const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://dharani:dhara83@ac-vetubp0-shard-00-00.5hwqi1f.mongodb.net:27017,ac-vetubp0-shard-00-01.5hwqi1f.mongodb.net:27017,ac-vetubp0-shard-00-02.5hwqi1f.mongodb.net:27017/passkey?ssl=true&replicaSet=atlas-7bdctd-shard-0&authSource=admin&appName=Cluster0").then(function(){
    console.log("Connected to DB")
}).catch(function(error){console.log(error)})

const User = mongoose.model("User", {
    user: String,
    pass: String},
  "Credentials");

const credential = mongoose.model("credential",{},"bulkmail")

const Email = mongoose.model("Email",{
        subject:String,
        message:String,
        recipients:[String],
        status:String,
        date:{
            type:Date,
            default:Date.now
        }
    })

app.post("/login", async function(req, res) {

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ user: username });
        console.log("LOGIN USER:", user);

        if (!user) {
            return res.send({ status: false, msg: "User not found" });
        }

        if (user.pass !== password) {
            return res.send({ status: false, msg: "Wrong password" });
        }

        res.send({ status: true, msg: "Login success" });

    } catch (err) {
        console.log(err);
        res.send({ status: false, msg: "Error" });
    }
});


app.post("/sendemail",function(req,res){

    const msg = req.body.msg
    const emailList = req.body.emailList
    const subject = req.body.subject

   
    credential.find().then(function(data){
        console.log(data)
        
         if(data.length === 0){
        console.log("No credentials found");
        return res.send(false)
    }

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
    },
});



 new Promise(async function(resolve,reject){
    try{
        for(var i=0;i<emailList.length;i++){
        await transporter.sendMail(
            {
                from:"dd1452327@gmail.com",
                to:emailList[i],
                subject:subject,
                text:msg
            })
            console.log("Email  send to:" + emailList[i])
        }

        await Email.create({
        subject:subject,
        message:msg,
        recipients:emailList,
        status:"Success"
    })
        resolve("Success")
    }
    catch(error){
        await Email.create({
        subject:subject,
        message:msg,
        recipients:emailList,
        status:"Failed"
    })
        console.log("EMAIL ERROR:", error);
        reject("Failed")
    }
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })

}).catch(function(error){
    console.log("EMAIL ERROR:", error);
})

});

app.get("/gethistory", async function(req,res){

    const history = await Email.find().sort({date:-1})

    res.send(history)
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log("Server Started on port " + PORT);
});

