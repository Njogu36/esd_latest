const nodemailer = require('nodemailer')
const Company = require('../models/company')
const Queue = require('../models/queue')
const Email = require('../models/email')
const Sent = require('../models/sent')
const fs = require('fs')
const fs2 = require('fs-extra')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1278443",
    key: "ccb9776a436a9a03d270",
    secret: "e4b5b7852b7412725adc",
    cluster: "ap2",
    useTLS: true
});

const send_email = (pdf_path, default_email, company_id, save, path) => {


    Company.findById(company_id, (err, company) => {

       
       
  
        if (company) {
            Queue.findOne({ invoice: company.company,
                invoice_link: pdf_path,
           
                reason: 'Email Sent',
                status: 'Sent'},(err,q)=>{
                  if(q)
                  {
            
                  }
                  else
                  {
                    if (path.saveFolder !== "") {
                        const co = company.company.split(" ");
                        const random = Math.floor(100000 + Math.random() * 900000)
                        const nw = co[0] + "_" +co[1]+"_"+random+ ".pdf";
                        const src = pdf_path;
                        const dest = path.saveFolder  + nw;
                        fs2.copy(src, dest)
                            .then(() => console.log('success!'))
                            .catch(err => console.error(err))
                    };
                    if (company.emails.length > 0) {
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
                                    to: company.emails,
                                    cc: default_email,
                                    subject: company.company + '.pdf',
                                    text: path.message,
                                    attachments: [{
                                        filename: company.company + '-INVOICE.pdf',
                                        path: pdf_path,
                                        cid: company.company + "-INVOICE"
                                    }]
        
                                }
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (info) {
                                        let data = new Queue({
                                            invoice: company.company,
                                            invoice_link: pdf_path,
                                            email: company.emails,
                                            reason: 'Email Sent',
                                            status: 'Sent',
                                            created_on: new Date(),
                                        })
                                        data.save(() => {
        
                                        })
                                      
        
                                        fs.unlink(pdf_path, () => {
                                            console.log('Email Sent Successfully - ' + company.company)
                                        })
                                        pusher.trigger("esd", "failed", {
                                            message: 'Success',
                                            success: true,
                                        });
                                    }
                                    else {
                                        let data = new Queue({
                                            invoice: company.company,
                                            invoice_link: pdf_path,
                                            email: company.emails,
                                            reason: 'Email not sent',
                                            status: 'Failed',
                                            created_on: new Date(),
                                        })
                                        data.save(() => {
                                            fs.unlink(pdf_path, () => {
                                                console.log('Email Not Sent')
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
                                    invoice: company.company,
                                    invoice_link: pdf_path,
                                    email: company.emails,
                                    reason: 'Email not sent',
                                    status: 'Failed',
                                    created_on: new Date(),
                                })
                                data.save(() => {
                                    fs.unlink(pdf_path, () => {
                                        console.log('Email Not Sent')
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
                            reason: 'No Company Emails Found.',
                            status: 'Failed',
                            created_on: new Date(),
                        })
                        data.save(() => {
                            pusher.trigger("esd", "failed", {
                                message: 'failed',
                                success: false,
                            });
                            fs.unlink(pdf_path, () => {
                                console.log('No Company Emails Found.',)
                                return
                            })
        
        
                        })
        
                    }
                  }
              })
           
        }
        else {

            let data = new Queue({
                invoice: 'UNKNcOWN',
                invoice_link: pdf_path,
                email: '',
                reason: 'No Company Found.',
                status: 'Failed',
                created_on: new Date(),
            })
            data.save(() => {
                pusher.trigger("esd", "failed", {
                    message: 'failed',
                    success: false,
                });
                fs.unlink(pdf_path, () => {
                    console.log('No Company Found.',)
                    return
                })


            })
        }


    })

}

module.exports = send_email