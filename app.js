const express = require("express");
const https = require("https");
const path = require("path");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.get("/",(req,res)=>{
    res.render('index');
});

app.post("/",(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const eMail = req.body.eMail;

    const data = {
        members: [
            {
                email_address:eMail,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const listId = "5667020aea";
    const url = "https://us20.api.mailchimp.com/3.0/lists/" + listId;

    const options = {
        method:"POST",
        auth: "dinith:5a021b5e9564cea85b8df3baf7841c4a-us20"
    }

    const request = https.request(url, options, (response)=>{
        
        if(response.statusCode>=200 || response.statusCode<=299){
            res.render('success');
            
        }
        else if(response.statusCode>=400 || response.statusCode<=499){
            res.render('failure');
        }

        response.on('data',(data)=>{
            console.log(JSON.parse(data));
        });

        request.on('error', (err)=>{
            console.log(err);
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/success",(req,res)=>{
    res.redirect("/");
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 4000,()=>{
    console.log("Server is Running...");
});