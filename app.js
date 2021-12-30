const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require('path');
const fs = require("fs");
const multer = require("multer");

var imageModel = require('./models/imageModel');
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb+srv://darko:darmar1986@cluster0.62x42.mongodb.net/chatMeDB?retryWrites=true&w=majority", function (err) {
    // If no error, successfully connected
});

const messagesSchema = {
    text: String,
    date: String
}

const Message = mongoose.model("Message", messagesSchema);

const defaultMessages = [];

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
 
var upload = multer({ storage: storage })

app.get("/", function (req, res) {
    Message.find({}, function (err, foundMessages) {
        if (foundMessages.length === 0) {
            Message.insertMany(defaultMessages, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved messages into the DB");
                }
            });
            res.redirect("/");
        } else {
            res.render('index.ejs', {
                newMessages: foundMessages
            });
        }
    });

    app.post("/", function (req, res) {
        const messageContent = req.body.newMessage;
        let messageDate = new Date().toLocaleString();
        const message = new Message({
            text: messageContent,
            date: messageDate
        });
        message.save();
        res.redirect("/");
    })

    app.post("/delete", function (req, res) {
        const messageId = req.body.buttonDel;
        Message.findByIdAndRemove(messageId, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Message successfully removed");
                res.redirect("/");
            }
        });
    });

    app.post("/uploadphoto",upload.single('myImage'),(req,res)=>{
        var img = fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        var final_img = {
            contentType:req.file.mimetype,
            image:Buffer.from(encode_img,'base64')
        };
        imageModel.create(final_img,function(err,result){
            if(err){
                console.log(err);
            }else{
                console.log(result.img.Buffer);
                console.log("Image saved To database");
                res.contentType(final_img.contentType);
                // res.send(final_img.image);
                res.redirect("/");
            }
        });
    });
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
})