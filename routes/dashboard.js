const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');


router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/:page?', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.item);

router.get('/dashboard/add_note', isLoggedIn, dashboardController.addItem);
router.post('/dashboard/add_note', isLoggedIn, dashboardController.submitItem);

router.put('/dashboard/item/:id', isLoggedIn, dashboardController.updateItem);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteItem);

router.get('/dashboard/search', isLoggedIn, dashboardController.search);
router.post('/dashboard/search', isLoggedIn, dashboardController.searchSubmit);

module.exports = router;