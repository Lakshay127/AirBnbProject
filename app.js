if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { listingSchema } = require('./schema.js');
const Review = require('./models/review.js'); 
const review = require('./models/review.js');
const listings = require('./routes/listing.js');
const wrapAsync = require('./utils/wrapAsync.js');
const Session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStragety = require('passport-local');
const User = require('./models/user.js');
const userRouter = require('./routes/user.js');
const port = process.env.PORT || 6000;






const dbURL = process.env.ATLASDB_URL;


main().then(()=>{
console.log("connected to DB");
})
.catch((err)=>{
console.log(err);
});


async function main(){
    await mongoose.connect(dbURL);
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine ('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});
store.on("error", ()=>{ 
    console.log("Session store error", error);
});

const sessionOptions={
    store: store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },

};






app.use(Session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragety(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {

res.locals.success = req.flash('success');
res.locals.error = req.flash('error');
res.locals.currUser = req.user;
next();
});

app.use("/listings", listings);
app.use("/", userRouter);


app.get("/demoUser", async (req, res) => {
let fakeUser = new User({
    email:"student@gmail.com",
    username:"student"
});

let registeredUser = await User.register(fakeUser,"hello123");
res.send(registeredUser);

});







app.post("/listings/:id/reviews", async (req,res)=>{
    console.log(req.params.id);
    let listing =  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);
    
     await newReview.save();
    await listing.save();
    
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${listing._id}`);
    
    });
    
    
    app.delete("/listings/:id/reviews/:reviewId", async (req,res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
    });
    




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
