const express = require('express');
const { getPsychologists } = require('../controllers/common');

const router = express.Router();

router.get('/psychologists', getPsychologists)

module.exports = router;
