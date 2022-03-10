var DirectoryWatcher = require('directory-watcher');
const fs = require('fs');
const pat = require('path')

const Path = require('../models/path');
const Queue = require('../models/queue')

const update_pdf = require('./update_pdf');
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1278443",
    key: "ccb9776a436a9a03d270",
    secret: "e4b5b7852b7412725adc",
    cluster: "ap2",
    useTLS: true
  });
const esd_watcher = (pdf_path, default_email, company_id,path) => {

    console.log('ESD FOLDER WATCHING.....')
    Path.findOne({ no: 1 }, (err, path) => {
        if (path) {
            const esd = path.esd;
            const save = path.sav
            DirectoryWatcher.create(esd, function (err, watcher) {
                watcher.on('add', function (files) {
                    const file = files[0];
                    const ext = pat.extname(file);
                    const pah = esd + '/' + file

                    if (ext === '.txt') {
                        if (file.includes("_b") === true) {
                            fs.readFile(pah, 'utf8', async (err, data) => {
                                if (err) {
                                    pusher.trigger("esd", "failed", {
                                        message: 'failed',
                                        success: false,
                                    });
                                    let data = new Queue({
                                        invoice: 'UNKNOWN',
                                        invoice_link: pdf_path,
                                        email: '',
                                        reason: 'Error reading .txt file.',
                                        status: 'Failed',
                                        created_on: new Date(),
                                    })
                                    data.save(() => {
                                        return

                                    })

                                }
                                if (data) {
                                   await update_pdf(pdf_path, data, default_email, company_id, save,path)
                                    return
                                }
                            })
                        }
                        else if (file.includes("_b") === false) {
                            let data = new Queue({
                                invoice: 'UNKOWN',
                                invoice_link: pdf_path,
                                email: "",
                                reason: "Can't find the b file",
                                status: "Failed",
                                created_on: new Date(),
                                added_on: ""
                            });
                            data.save(() => {
                                pusher.trigger("esd", "failed", {
                                    message:'failed',
                                    success: false,
                                });
                                return

                            })

                        }
                    }
                    else {
                        let data = new Queue({
                            invoice: 'UNKNOWN',
                            invoice_link: pdf_path,
                            email: '',
                            reason: '.txt file not found in the ESD Folder.',
                            status: 'Failed',
                            created_on: new Date(),
                        })
                        data.save(() => {
                            pusher.trigger("esd", "failed", {
                                message:'failed',
                                success: false,
                            });
                            fs.unlink(pdf_path, () => {
                                console.log(".txt file not found in the ESD Folderss")
                                return
                            })
                        
                        })
                       
                    }
                });
            });
        }
    })
}

module.exports = esd_watcher