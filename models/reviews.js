const mongoose = require('mongoose');

const newSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
    },
});   

module.exports=mongoose.model("Reviews",newSchema);