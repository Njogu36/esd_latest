const mongoose = require('mongoose');
const sentSchema = mongoose.Schema({
  
    pathPDF:String
   
});
const Sent = mongoose.model('Sent',sentSchema);
module.exports = Sent