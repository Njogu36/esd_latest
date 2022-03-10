var DirectoryWatcher = require('directory-watcher');
const update_pdf = require('./update_pdf')
const Path = require('path')
const fs =require('fs')
const delete_file = require('./delete_file')
const chokidar = require('chokidar');

const Bfile = require('../models/bfile');
let session = []
const esd_watcher = (path,data,company)=>{

    let filter = session.filter((x)=>{
        return x === path
    })
    if(filter.length > 0)
    {
        delete_file(path)
    }
    else if(filter.length < 1)
    {
        session.push(path)
        DirectoryWatcher.create(data.esd, function (err, watcher) {
    
            watcher.on('add', function (files) {
            
                const file = files[0];
                const ext = Path.extname(file);
                const esd_path = data.esd + '/' + file
               
    
                if (ext === '.txt') {
                    if (file.includes("_b") === true) {
                        fs.readFile(esd_path, 'utf8', async (err, b_data) => {
                            if (err) {
                                delete_file(path)
                            }
                            if (b_data) {
                                Bfile.findOne({bdata:b_data},(err,b)=>{
                                    if(b)
                                    {
    
                                    }
                                    else
                                    {
                                        let dat = new Bfile()
                                        dat.bdata  = b_data;
                                        dat.save(()=>{
                                            update_pdf(path,data,company,b_data)
                                        })
                                       
                                    }
                                })
                              
                            }
                        })
                    }
                    else if (file.includes("_b") === false) {
                   
                    }
                }
                else {
                  
                }
            });
        });
    }

   

}
module.exports = esd_watcher