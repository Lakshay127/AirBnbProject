const { access, cp } = require("fs");
const Listing = require("../models/listing");
const { Query } = require("mongoose");
const { response } = require("express");




module.exports.index =async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings", {allListings});
    };


    module.exports.renderNewForm = (req,res)=>{
        res.render("listings/new.ejs");
      };

      module.exports.showListing =  (async(req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner");
        if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
        }
        console.log(listing);
          res.render("listings/show.ejs", {listing});
      });


      module.exports.createListing = (async (req,res)=>{
      
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing =  new Listing(req.body.listing);
        newListing.image = {url,filename};
       
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "Successfully created a new listing!");
         res.redirect("/listings");
      
      });


        module.exports.renderEditForm =(async (req,res)=>{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        let originalImageUrl = listing.image.url;
      originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", {listing , originalImageUrl});

 
      



        });


        module.exports.updateListing = (async (req,res)=>{
            let { id } = req.params;
            let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

            if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
          listing.image = {url,filename};
          await listing.save();
        }
               req.flash("success", "Successfully updated the listing!");
            res.redirect(`/listings/${id}`);
            
            });


            module.exports.deleteListing =( async (req,res)=>{
                let {id} = req.params;
                 let deletedListing  = await Listing.findByIdAndDelete(id);
                console.log(deletedListing);
                req.flash("success", "Successfully deleted the listing!");
                res.redirect("/listings");
                });