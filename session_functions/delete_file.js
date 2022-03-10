const fs = require('fs')
const delete_file  =(path)=>{
    fs.unlink(path, (err) => {
        console.log('link deleted....'+path)
       
    })
}
module.exports = delete_file