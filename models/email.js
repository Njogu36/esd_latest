const mongoose = require('mongoose');
const emailSchema = mongoose.Schema({
 no:Number,
 host:String,
 port:Number,
 email:String,
 password:String
})
const Email = mongoose.model('Email',emailSchema);
module.exports = Email