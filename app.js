if(process.env.NODE_ENV!=='production')
{
  require('dotenv').config()
}
// console.log(process.env.SECRET)


const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session=require('express-session')
const flash=require('connect-flash')
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const passport=require('passport')
const LocalStrategy=require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore=require('connect-mongo')(session)

const campgrounds = require("./routes/campgrounds");
const reviews=require("./routes/reviews")
const User=require('./models/user')
const user=require('./routes/users')

const dburl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
console.log(dburl)
// o1GW8GGxeb0zYBpb;
// "mongodb://localhost:27017/yelp-camp"


const port=process.env.PORT||3000

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const secret=process.env.SECRET || "gaurav"

const store = new MongoDBStore({
  url: dburl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on('error',(e)=>{
  console.log('SESSION config eror',e)
})

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


app.use(session(sessionConfig));
app.use(flash());
// app.use(mongoSanitize);

// <----------passport middleware should be before routes---------->
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// <---------flash middleware should after flash comfiguration----------->
app.use((req,res,next)=>{

  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success')
  res.locals.error = req.flash("error");
  next()
})






app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use("/", user);







app.get("/", (req, res) => {
  res.render("home");
});





app.all("*", (req, res, next) => {
  // res.send("404!!!! Not Found")
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status, message } = err;
  if (!err.message) err.message = "Something went wrong";
  res.render("error", { err });
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
