const mongoose = require('mongoose');
const bfileSchema = mongoose.Schema({
    bdata:String
})
const Bfile = mongoose.model('Bfile',bfileSchema);
module.exports = Bfile