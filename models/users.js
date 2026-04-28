const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const newSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

newSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Users", newSchema);