const mongoose = require('mongoose');
const CompanySchema = mongoose.Schema({
    company:String,
    emails:[]
});
const Company = mongoose.model('Company',CompanySchema)
module.exports = Company