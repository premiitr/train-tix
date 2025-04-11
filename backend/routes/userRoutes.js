const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/register/', userCtrl.register);
router.post('/login/', userCtrl.login);
router.post('/book/', userCtrl.bookSeats);
router.post('/cancel/', userCtrl.cancelSeats);
router.post('/reset_all/', userCtrl.resetAll);
router.get('/booked_seats/', userCtrl.getBookedSeats);

module.exports = router;
