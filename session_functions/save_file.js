
const fs = require('fs-extra')
const Path = require('path')
const delete_file = require('./delete_file')
const send_email = require('./send_email')
const save_file = (path,data,company)=>{
   const co = Path.parse(path).name;

    const nw = co+".pdf";
    const src = path;
    const dest = data.saveFolder  + nw;
    console.log(dest,src)

    fs.copy(src, dest)
        .then(async() => {
            await send_email(path,data,company);
        })
        .catch(err => {
            delete_file(path)
        })
}
module.exports = save_file