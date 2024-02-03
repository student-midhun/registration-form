const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");              //data will be made readable as the data is complex
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB__USERNAME;
const password = process.env.MONGODB__PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.x7y1wst.mongodb.net/registrationDB`, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//registration 
const registrationschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

//mode registration
const Registration = mongoose.model("Registration", registrationschema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html")
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;     //destructuring data


        const existingUser = await Registration .findOne({email:email});
        
        //checking existing user 

        if(!existingUser){
            
        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{
        alert("User already exists!");
        res.redirect("/error");
    }


    }
    catch(error) {
            console.log(error);
            res.redirect("error");
    }
})

app.get("/success",(req, res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})
app.get("/error",(req, res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port, () => {
    console.log(`Server is Running on Port ${port}`);
})