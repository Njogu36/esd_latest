const chokidar = require('chokidar');
const fs = require('fs');
const Path = require('path')
const DirectoryWatcher = require('directory-watcher');
const PathDB = require('../models/path');
const check_data = (req, res) => {
    PathDB.findOne({ no: 1 }, (err, data) => {
        if (data) {
            if (data.esd === "") {
                res.send({ success: false, message: "ESD folder path is required. Kindly login." })
            }
            else if (data.pdf === "") {
                res.send({ success: false, message: "PDF folder path is required. Kindly login." })
            }
            else if (data.printer === "") {
                res.send({ success: false, message: "Printer name is required. Kindly login." })
            }
            else if (data.email === "") {
                res.send({ success: false, message: "Default company email is required. Kindly login." })
            }
            else {
                // check pdf file path exist
                // check esd file path exist
                if (!fs.existsSync(data.esd)) {
                    res.send({ success: false, message: "ESD folder doesn't exists." })

                }
                else if (!fs.existsSync(data.pdf)) {
                    res.send({ success: false, message: "PDF folder doesn't exists." })
                }
                else {
                    res.send({success:true,path:data})
                   
                }

            }
        }
        else {
            res.send({ success: false, message: 'Path details not found. Kindly login.' })
        }
    })
}
module.exports = check_data