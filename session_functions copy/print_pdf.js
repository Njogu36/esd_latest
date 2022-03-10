const ptp = require('pdf-to-printer')
var nodemailer = require('nodemailer');
const fs = require("fs")
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1278443",
    key: "ccb9776a436a9a03d270",
    secret: "e4b5b7852b7412725adc",
    cluster: "ap2",
    useTLS: true
});

const esd_watcher = require('./esd_watcher')


// MODELS
const Queue = require('../models/queue')
const Email = require('../models/email')

const print_pdf = (pdf_path, printer, default_email, company_id,path) => {
    // esd_watcher(pdf_path, default_email, company_id);
    const options = {
        printer: printer
    }
    ptp
        .print(pdf_path, options)
        .then(async (response) => {
            esd_watcher(pdf_path, default_email, company_id,path);
            return
        })
        .catch((err) => {

            Email.findOne({ no: 1 }, (err, email) => {
                if (email) {
                    var transporter = nodemailer.createTransport({
                        host: email.host, // hostname
                        secureConnection: false, // TLS requires secureConnection to be false
                        port: parseInt(email.port), // port for secure SMTP
                        tls: {
                            ciphers: 'SSLv3'
                        },
                        auth: {
                            user: email.email,
                            pass: email.password
                        }
                    });
                    var mailOptions = {
                        from: email.email,
                        to: default_email,
                        subject: 'PDF not printed.',
                        text: 'PDF not printed'
                    }
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            let data = new Queue({
                                invoice: 'UNKNOWN',
                                invoice_link: pdf_path,
                                email: '',
                                reason: 'PDF not Printed. Invalid Printer Name',
                                status: 'Failed',
                                created_on: new Date(),
                            })
                            data.save(() => {
                                
                                fs.unlink(pdf_path, () => {
                                    //console.log(error)
                                    return
                                })
                                pusher.trigger("esd", "failed", {
                                    message: 'failed',
                                    success: false,
                                });

                            })


                        }
                        else {
                            let data = new Queue({
                                invoice: 'UNKNOWN',
                                invoice_link: pdf_path,
                                email: '',
                                reason: 'PDF not Printed. Invalid Printer Name',
                                status: 'Failed',
                                created_on: new Date(),
                            })
                            data.save(() => {
                                
                                fs.unlink(pdf_path, () => {
                                    console.log('Email sent. PDF NOT PRINTED.....')
                                    return
                                })
                                pusher.trigger("esd", "failed", {
                                    message: 'failed',
                                    success: false,
                                });
                            })
                        }
                    })
                }
                else {
                    let data = new Queue({
                        invoice: 'UNKNOWN',
                        invoice_link: pdf_path,
                        email: '',
                        reason: 'PDF not Printed. Invalid Printer Name',
                        status: 'Failed',
                        created_on: new Date(),
                    })
                    data.save(() => {  
                        fs.unlink(pdf_path, () => {
                            console.log('Email sent. PDF NOT PRINTED.....')
                            return
                        })
                        pusher.trigger("esd", "failed", {
                            message: 'failed',
                            success: false,
                        });
                    })

                }
            })

        });

}
module.exports = print_pdf


