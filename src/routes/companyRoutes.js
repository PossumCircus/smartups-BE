const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming this exists

router.route('/')  
      .post(authMiddleware.protect, /* Add specific role check? */ companyController.createCompany) 
      .get(companyController.getAllCompanies);

router.route('/:id')
      .get(companyController.getCompany)
      .patch(authMiddleware.protect, /* Add authorization logic */ companyController.updateCompany) 
      .delete(authMiddleware.protect, /* Add authorization logic */ companyController.deleteCompany); 

module.exports = router;
