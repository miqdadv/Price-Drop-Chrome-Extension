const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/User");


async function update(item, req){
    try{
        const filter = { email: "req.body.email" };
        const options = { upsert: true };
        // create a document that sets the plot of the movie
        const mail = req.body.email;
        console.log("search for this mail" , mail);
        // this might have the error >>>> below <<<<
        let user = await User.findOne({
            mail
        });
        console.log(user);
        const query = { email: mail };
        const updateDocument = {
        $push: {"products": item }
        };
        const result = await user.updateOne(updateDocument);
        console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
        console.log(result);
        return result;
    }catch(err){
        console.log("Error in reaching DB");
        console.log(err);
        return ({
            message : "error reaching DB"
        })
    }
}

router.post("/insert" , function(req,res,next){
    console.log("inside /user/insert")
    console.log(req.body);
    var item = {
        name : req.body.name,
        price : req.body.price,
        item_n : req.body.itemNumber,
    }
    let result = update(item , req);
    return res.json(result);
});

module.exports = router;