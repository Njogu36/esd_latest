const mongoose = require('mongoose');
const QueueSchema = mongoose.Schema({
   invoice:String,
   invoice_link:String,
   email:String,
   reason:String,
   status:String,
   created_on:String,
});
const Queue = mongoose.model('Queue',QueueSchema);
module.exports = Queue