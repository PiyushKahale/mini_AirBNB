if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    // If not in production, load environment variables from .env file  
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');

// // Models
// const Listing = require('./models/listing.js');
// const Review = require('./models/review.js')

const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")

// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require('./utils/ExpressError');
// const { listingSchema, reviewSchema } = require("./schema.js")

const session = require("express-session")
const flash = require("connect-flash")

const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")

// Router Implementation
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

// DB connection
const mongo_url = 'mongodb://localhost:27017/travelbugg';

main()
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

async function main() {
    await mongoose.connect(mongo_url);
}

// Set view Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
// To use ejaMate engine and boilerplate code
app.engine('ejs', ejsMate)
// To use/serve  static files
app.use(express.static(path.join(__dirname, "/public")));

// Session middleware
// Session is used to store data on the server side and send a cookie to the client side
const sessionConfig = {
    secret: "pyush0604",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
    // store: new MongoStore({ mongooseConnection: mongoose.connection }) // To store session in MongoDB    
};


// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });



app.use(session(sessionConfig));
app.use(flash());

//  Passport middleware for authentication, authorization and session management
// Use ""pbkdf2""" hashing algorithm to hash the password and store it in the database

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

// store user info session
// when user logs in, store user info in session
passport.serializeUser(User.serializeUser());
// remove user info from session
// when user logs out, remove user info from session
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // current user info
    next();
})


// app.get("/fakeUser", async (req, res) => {
//     const user = new User({ 
//         email: "fakeuser@example.com",
//         username: "fakeuser",
//     });

//     const newUser = await User.register(user, "password")
//     // await newUser.save();
//     res.send("Fake user created!");
// });


app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


// Error handler middleware
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: err });
});  

// Server is running on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
