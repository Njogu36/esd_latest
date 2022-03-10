const nodemailer = require('nodemailer');
const Email = require('../models/email');
const Queue = require('../models/queue');
const delete_file = require('./delete_file')

const send_email = (path,data,company)=>{
    if(company.emails.length > 0)
    {
        Email.findOne({ no: 1 }, (err, email) => {
            if(err)
            {
                delete_file(path)
            }
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
                    cc: data.email,
                    subject: company.company + '.pdf',
                    text: data.message,
                    attachments: [{
                        filename: company.company + '-INVOICE.pdf',
                        path: path,
                        cid: company.company + "-INVOICE"
                    }]
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (info) {
                        let data = new Queue({
                            invoice: company.company,
                            invoice_link: path,
                            email: company.emails,
                            reason: 'Email Sent',
                            status: 'Sent',
                            created_on: new Date(),
                        })
                        data.save(() => {

                        })
                      

                      delete_file(path)
                        
                    }
                    else {
                        delete_file(path)
                    }
                })
            }
            else {

                delete_file(path)
            }
        })

    }
    else
    {
        console.log('DO nothing')
    }

}
module.exports = send_email