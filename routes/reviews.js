const express= require('express')
const router=express.Router({mergeParams:true});

const {  reviewSchema } = require("../schemas");
const Review = require("../models/review");
const review = require("../controller/Review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn,isReviewAuthor } = require("../middleware");


const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",isLoggedIn,
  catchAsync(review.addReview)
);

router.delete(
  "/:revId",isLoggedIn,
  catchAsync(review.deleteReview)
);

module.exports=router;