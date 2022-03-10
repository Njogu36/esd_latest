const ptp = require('pdf-to-printer')

const esd_watcher = require('./esd_watcher')
const delete_file = require('./delete_file')
const print_pdf = (path,data,company)=>{
    const printer_name = data.printer;
    
    const options = {
        printer: printer_name
    }
    ptp
        .print(path, options)
        .then(async (response) => {
            console.log('esd watcher')
            esd_watcher(path,data,company)
        })
        .catch((err) => {
          delete_file(path)
        });
}
module.exports = print_pdf