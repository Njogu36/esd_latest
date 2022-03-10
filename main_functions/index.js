const fs = require('fs')
const csv = require('csvtojson')

const Path = require('../models/path');
const Queue = require('../models/queue');
const Sent = require('../models/sent')
const Company = require('../models/company')
const Email = require('../models/email')

const index = (req, res) => {

    Path.findOne({ no: 1 }, (err, path) => {
        Queue.find({}, (err, queues) => {
            Sent.find({}, (err, sents) => {
                Company.find({}, (err, companies) => {
                    res.render('companies', {
                        user: req.user,
                        path: path,
                        queues: queues,
                        sents: sents,
                        companies: companies
                    })
                })

            })
        })
    })

}
const settings = (req, res) => {
    Path.findOne({ no: 1 }, (err, path) => {
        Queue.find({}, (err, queues) => {
            Sent.find({}, (err, sents) => {
                Company.find({}, (err, companies) => {
                    Email.findOne({ no: 1 }, (err, email) => {
                        res.render('settings', {
                            user: req.user,
                            path: path,
                            queues: queues,
                            sents: sents,
                            companies: companies,
                            email: email
                        })
                    })

                })

            })
        })
    })

}

const queue = (req, res) => {
    Path.findOne({ no: 1 }, (err, path) => {
        Queue.find({}, (err, queues) => {
            Sent.find({}, (err, sents) => {
                Company.find({}, (err, companies) => {
                    res.render('queue', {
                        user: req.user,
                        path: path,
                        queues: queues,
                        sents: sents,
                        companies: companies
                    })
                })

            })
        }).sort({ _id: 1 })
    })

}

const clear_all = (req, res) => {
    Queue.remove({}, (err) => {
        req.flash('danger', 'All queues are cleared.');
        res.redirect('/admin/queue')
    })
}

const add_path = (req, res) => {
    const { esd, pdf, printer, email, message, saveFolder } = req.body;
    Path.findOne({ no: 1 }, (err, path) => {
        const esd_path = esd.replace(/\//g, "/")
        const pdf_path = pdf.replace(/\//g, "/")
        const save_folder_path = saveFolder.replace(/\//g, "/")
        if (!fs.existsSync(esd_path)) {
            req.flash('danger', "ESD Folder Path doesn't exist.")
            res.redirect('/admin/settings')
        }
        else if (!fs.existsSync(pdf_path)) {
            req.flash('danger', "PDF Folder Path doesn't exist.")
            res.redirect('/admin/settings')
        }
        else if (!fs.existsSync(save_folder_path)) {
            req.flash('danger', "Save Folder Path doesn't exist.")
            res.redirect('/admin/settings')
        }
        else {
            if (path) {
                let query =
                {
                    _id: path.id
                }
                let data = {};
                data.esd = esd_path
                data.printer = printer
                data.email = email
                data.pdf = pdf_path
                data.message = message
                data.saveFolder = save_folder_path
                Path.updateOne(query, data, () => {
                    req.flash('info', 'Info saved succesffully.')
                    res.redirect('/admin/settings')
                })
            }
            else {
                let data = new Path()
                data.esd = esd_path
                data.printer = printer;
                data.no = 1;
                data.email = email
                data.pdf = pdf_path
                data.message = message;
                data.saveFolder = save_folder_path
                data.save(() => {
                    req.flash('info', 'Info saved succesffully.')
                    res.redirect('/admin/settings')
                }
                )
            }
        }
    })
}

const add_email_conf = (req, res) => {
    const { email, host, port, password } = req.body;
    Email.findOne({ no: 1 }, (err, e) => {
        if (e) {
            let query = {
                _id: e.id
            }
            let data = {};

            data.email = email;
            data.host = host;
            data.port = parseInt(port);
            data.password = password;
            Email.updateOne(query, data, () => {
                req.flash('info', 'Info saved succesffully.')
                res.redirect('/admin/settings')
            })
        }
        else {
            let data = new Email();
            data.no = 1;
            data.email = email;
            data.host = host;
            data.port = parseInt(port);
            data.password = password;
            data.save(() => {
                req.flash('info', 'Info saved succesffully.')
                res.redirect('/admin/settings')
            })
        }
    })

}

const add_company = (req, res) => {
    const { company } = req.body
    Company.findOne({ company: company }, (err, comp) => {
        if (comp) {
            req.flash('danger', 'Company already exists.')
            res.redirect('/admin/')
        }
        else {
            let data = new Company()
            data.company = company;
            data.emails = [];
            data.save(() => {
                res.redirect('/admin/')
            })
        }
    })

}

const delete_company = (req, res) => {
    const id = req.params.id;
    Company.findByIdAndRemove(id, () => {
        req.flash('danger', 'Company deleted successfully.');
        res.redirect('/admin/')
    })
}

const add_email = (req, res) => {
    const { id, email } = req.body;
    Company.findById(id, (err, company) => {
        let query = {
            _id: id
        }
        let filter = company.emails.filter((x) => {
            return x === email
        })
        if (filter.length > 0) {
            req.flash('danger', 'Email already exists.');
            res.redirect('/admin/')
        }
        else {
            let data = {};
            data.emails = company.emails.concat([email])
            Company.updateOne(query, data, () => {
                req.flash('info', 'Email added successfully.');
                res.redirect('/admin/')
            })
        }
    })


}
const delete_email = (req, res) => {
    const { id, email } = req.params;
    Company.findById(id, (err, company) => {
        let query = {
            _id: id
        }
        let filter = company.emails.filter((x) => {
            return x !== email
        })
        let data = {};
        data.emails = filter
        Company.updateOne(query, data, () => {
            req.flash('danger', 'Email deleted successfully.');
            res.redirect('/admin/')
        })

    })
}

const import_companies = (req, res) => {

    const array = req.body;
    let total_saved = 0
    console.log(array)

    array.map((x) => {
        
        let array = []
      
        function validateEmail (email)
            {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            }

       
        if (x.Company !== "") {
            if (validateEmail(x.EMAIL) === true) {
                array.push(x.EMAIL)
            }
            if (validateEmail(x.EMAIL2) === true) {
                array.push(x.EMAIL2)
            }
            if (validateEmail(x.EMAIL3) === true) {
                array.push(x.EMAIL3)
            }
            if (validateEmail(x.EMAIL4) === true) {
                array.push(x.EMAIL4)
            }
            if (validateEmail(x.EMAIL5) === true) {
                
                array.push(x.EMAIL5)
            }
            if (validateEmail(x.EMAIL6) === true) {
                array.push(x.EMAIL6)
            }
            if (validateEmail(x.EMAIL7) === true) {
                array.push(x.EMAIL7)
            }
            if (validateEmail(x.EMAIL8) === true) {
                array.push(x.EMAIL8)
            }
            if (validateEmail(x.EMAIL9) === true) {
                array.push(x.EMAIL9)
            }
           
            Company.findOne({ company: x.Company }, (err, comp) => {
                if (comp) {
                   let query = {
                       _id:id
                   };
                   let data = {};
                   data.emails = array;
                   Company.updateOne(query,data,()=>{
                       
                   })

                }
                else {
                    let data = new Company()
                    data.company = x.Company;
                    data.emails = array;
                    data.save(() => {
                        total_saved += 1
                    })
                }
            })


        }

    })

    setTimeout(() => {
        res.send({ success: true, total_saved: total_saved })
    }, 6000)
}

module.exports = {
    index,
    add_path,
    add_company,
    delete_company,
    add_email,
    delete_email,
    settings,
    queue,
    clear_all,
    add_email_conf,
    import_companies,
}