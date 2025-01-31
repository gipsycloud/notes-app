const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.item);

router.get('/dashboard/add_note', isLoggedIn, dashboardController.addItem);
router.post('/dashboard/add_note', isLoggedIn, dashboardController.submitItem);

router.put('/dashboard/item/:id', isLoggedIn, dashboardController.updateItem);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteItem);

module.exports = router;