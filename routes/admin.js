const express = require('express');
const router = express.Router();

// FUNCTIONS
const index = require('../main_functions/index');

const auth = (req,res,next)=>{
    if(!req.user)
    {
    req.flash('danger','You are logged out. Please login.');
    res.redirect('/')
    }
    else
    {
        next()
    }
}


// COMPANY
router.get('/',auth,index.index)
router.get('/delete_company/:id',auth,index.delete_company)
router.get('/delete_email/:id/:email',auth,index.delete_email)
router.post('/add_company',auth,index.add_company)
router.post('/add_email',auth,index.add_email)
router.post('/import_companies',auth,index.import_companies)


// QUEUE
router.get('/queue',auth,index.queue)
router.get('/clear_all',auth,index.clear_all)

// SETTINGS

router.get('/settings',auth,index.settings)
router.post('/add_path',auth,index.add_path)
router.post('/add_email_conf',auth,index.add_email_conf)



module.exports = router;