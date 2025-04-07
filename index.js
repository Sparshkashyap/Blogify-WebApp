const express = require('express');
const app =express();
const port =3000;
const path = require('path');
const {ConnectDB} = require('./config/connect');
const Routelinks = require('./routes/route');
const cookieParser = require('cookie-parser');
const {checkuserAuthenticationToken} = require('./middleware/authentication');
const favicon = require('serve-favicon');
const USER = require('./models/user');
const passport = require('passport');
const session = require('express-session');

require('./controllers/passport');


// connected the database
ConnectDB();

// connected the ejs file
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views')); 

//fix the middlewares

app.use(session({
  secret: 'sparsh@1234',   // 🔐 use an env variable in production!
  resave: false,
  saveUninitialized: false
}));


app.use(express.json());        
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/user/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user/signin');
  });


app.use(checkuserAuthenticationToken("token"));
app.use(express.static("public"))
app.use(favicon(__dirname + '/public/images/sk.png'));

  





// use the routes

app.use('/',Routelinks);
app.use("/user",Routelinks);






// listen the port
app.listen(port,'0.0.0.0',()=>console.log(`Server connected...${port}🎉`));
