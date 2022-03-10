const express = require('express');
const router = express.Router();

const start_session =  require('../session_functions/start_session');
const check_data =  require('../session_functions/check_data');

router.get('/check_data', check_data)
router.post('/start_session', start_session)

module.exports = router