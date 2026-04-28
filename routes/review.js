const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validatereview, isLoggedIn}=require("../middleware.js");


//Reviews
//post new review
router.post("/",isLoggedIn,validatereview, wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;