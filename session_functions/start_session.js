const chokidar = require('chokidar');
const ptp = require('pdf-to-printer')
const fs = require('fs');
const Path = require('path')

const PathDB = require('../models/path');
const pdf = require('pdf-parse')
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1278443",
    key: "ccb9776a436a9a03d270",
    secret: "e4b5b7852b7412725adc",
    cluster: "ap2",
    useTLS: true
});
//Models
//
const Queue = require('../models/queue')
const Company = require('../models/company')
const Sent = require('../models/sent')

//Functions 
//const print_pdf = require('./print_pdf');
const esd_watcher = require('./esd_watcher');
const delete_file = require('./delete_file')




const start_session = (req, res) => {
  
    let session = []
    let printed = []
    const { data } = req.body
    const options = {
        ignoredInitial: true
    }
    chokidar.watch(data.pdf, options).on('add', (path_, stats) => {
       
        console.log(session)

        let filter = session.filter((x) => {
            return x === path_
        })
        if (filter.length > 0) {
            delete_file(path_)
        }
        else if (filter.length < 1) {
            session.push(path_);
            var ext = Path.extname(path_);
            if (ext === '.pdf') {
                let dataBuffer = fs.readFileSync(path_);
                pdf(dataBuffer).then(async function (data) {
                    if (data) {
                        let array = data.text.split('\n')
                        if (array.length > 0) {
                            for await (let item of array) {
                                Company.findOne({ company: item }, async (err, company) => {
                                    if (company) {
                                        let filter = printed.filter((x)=>{
                                            return x === path_
                                        })
                                        
                                        if(filter.length < 1)
                                        {
                                            const printer_name = req.body.data.printer;
                                            const options = {
                                                printer: printer_name
                                            }
                                            ptp
                                                .print(path_, options)
                                                .then( (response) => {
                                                    printed.push(path_)
                                                    esd_watcher(path_, req.body.data, company)
                                                })
                                                .catch((err) => {
                                                    delete_file(path_)
                                                });
                                        }
                                       
                                    }
                                })
                            }
                        }
                        else {
                            delete_file(path_)
                        }
                    }
                })
            }
        }




    })
}
module.exports = start_session