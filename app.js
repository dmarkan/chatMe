const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://darko:darmar1986@cluster0.62x42.mongodb.net/chatMeDB?retryWrites=true&w=majority");

const messagesSchema = {
    text: String
}

const Message = mongoose.model("Message", messagesSchema);

app.get("/", function (req, res) {
    res.render("index.ejs")
})

app.post("/", function (req, res) {
    const messageContent = req.body.newMessage;

    const message = new Message ({
        text: messageContent
    });

    message.save();
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server is running on port 3000");
})