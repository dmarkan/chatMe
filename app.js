const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://darko:darmar1986@cluster0.62x42.mongodb.net/chatMeDB?retryWrites=true&w=majority", function(err) {
    // If no error, successfully connected
  });

const messagesSchema = {
    text: String
}

const Message = mongoose.model("Message", messagesSchema);

const defaultMessages = [];

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
    
        const message = new Message ({
            text: messageContent
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
    })
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
})