const express = require('express');
const app =express();
const port =3000;
const path = require('path');
const {ConnectDB} = require('./config/connect');
const Routelinks = require('./routes/route');
const cookieParser = require('cookie-parser');
const {checkuserAuthenticationToken} = require('./middleware/authentication');


// connected the database
ConnectDB();

// connected the ejs file
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views')); 

//fix the middlewares


app.use(express.json());        
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use(checkuserAuthenticationToken("token"));
app.use(express.static("public"))
app.use('/images', express.static('images'));   
// app.use(express.static(path.resolve("./public")));   





// use the routes

app.use('/',Routelinks);
app.use("/user",Routelinks);




// listen the port
app.listen(port,()=>console.log(`Server connected...${port}🎉`));
