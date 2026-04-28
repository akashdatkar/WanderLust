const express=require("express");
const router=express.Router();
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validatelisting}=require("../middleware.js");



//all listings
router.get("/", async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//new listing
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
})

//show listing
router.get("/:id",validatelisting, async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exit!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
})

//new Listing
router.post("/", validatelisting,isLoggedIn,wrapAsync(async(req,res,next)=>{
        if(!req.body.listing){
            throw new ExpressError(400,"Send valid Data for Listing");
        }
        req.flash("success","New Listing Created!");
        let listing=req.body.listing;
        let newListing=new Listing(listing);
        newListing.owner=req.user._id;
        await newListing.save();
        res.redirect("/listings");
    })
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you request for does not exit!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs",{listing});
}))

//update listing
router.put("/:id",validatelisting,isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid Data for Listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//delete listing
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}))


module.exports=router;