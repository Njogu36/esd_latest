const mongoose = require('mongoose');
const pathSchema = mongoose.Schema({
   no:Number,
   esd:String,
   pdf:String,
   printer:String,
   email:String,
   message:String,
   saveFolder:String
});
const Path = mongoose.model('Path',pathSchema);
module.exports = Path