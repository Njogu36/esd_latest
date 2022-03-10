const chokidar = require('chokidar');
const fs = require('fs');
const Path = require('path')
const DirectoryWatcher = require('directory-watcher');
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
const print_pdf = require('./print_pdf')

const start_session = (req, res) => {
    const { data } = req.body
    
    chokidar.watch(data.pdf).on('all', (event, path_) => {
       
        if (event === 'add') {
         Sent.findOne({pdf:path_},(err,sent)=>{
             if(sent)
             {
                fs.unlink(path_, () => {
                    return
                })
                pusher.trigger("esd", "failed", {
                    message: 'failed',
                    success: false,
                });
             }
             else
             {
                 
                PathDB.findOne({ no: 1 }, (err, path) => {
                    if (path) {
                        const default_email = data.email;
                        const printer = data.printer;
                        const pat = path_
                        let dataBuffer = fs.readFileSync(pat);
                        console.log(path)
    
                        pdf(dataBuffer).then(async function (data) {
                            if (data) {
                                let array = data.text.split('\n')
                                if (array.length > 0) {
                                   
                                    array.map((item) => {
                                        Company.findOne({ company: item }, async (err, company) => {
                                            if (company) {
                                                if (company.company === item) {
                                                    
                                                            let data = new Sent({
                                                                pdf: pat,
                                                                company: company.company
                                                            });
                                                            data.save(() => {
                                                                print_pdf(pat, printer, default_email, company.id,path)
                                                                return
                                                            })
                                                      
                                                }
    
                                            }
                                        })
                                    })
                                }
                                else if (array.length < 1) {
                                    let data = new Queue({
                                        invoice: 'UNKNOWN',
                                        invoice_link: pat,
                                        email: '',
                                        reason: 'File has not data.',
                                        status: 'Failed',
                                        created_on: new Date(),
                                    })
                                    data.save(() => {
                                        pusher.trigger("esd", "failed", {
                                            message: 'failed',
                                            success: false,
                                        });
                                        fs.unlink(pat, () => {
                                            return
                                        })
                                    })
                                }
                            }
    
    
                        }).catch((err) => {
                            let data = new Queue({
                                invoice: 'UNKNOWN',
                                invoice_link: pat,
                                email: '',
                                reason: 'File error.',
                                status: 'Failed',
                                created_on: new Date(),
                            })
                            data.save(() => {
                                pusher.trigger("esd", "failed", {
                                    message: 'Success',
                                    success: false,
                                });
                                fs.unlink(pat, () => {
                                    return
                                })
                            })
                        })
    
    
                    }
                    else {
    
                    }
                })
             }
         })
           
        }
        else {
            console.log(event)
        }
    });

}
module.exports = start_session