const Company = require('../models/Company');
const AppError = require('../utils/appError');

// Function 1: Create a Company (consider associating with the logged-in user)
exports.createCompany = async (req, res, next) => {
    try {
        // ... Logic to associate company with logged-in user ...

        const newCompany = await Company.create(req.body);
        res.status(201).json(newCompany);
    } catch (error) {
        next(error);
    }
}

// Function 2: Get All Companies (Basic - you might add filtering and sorting)
exports.getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.json(companies); 
    } catch (error) {
        next(error);
    }
}

// Function 3: Get a Single Company
exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id); 
        if (!company) {
            return next(new AppError('Company not found', 404)); 
        }
        res.json(company);
    } catch (error) {
        next(error);
    }
}

// Function 4: Update a Company
exports.updateCompany = async (req, res, next) => {
    try {
        // ... Authorization logic to ensure only relevant users/admins can modify ...

        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run validators on the update
        });

        if (!updatedCompany) {
            return next(new AppError('Company not found', 404)); 
        }

        res.json(updatedCompany);
    } catch (error) {
        next(error);
    }
}

// Function 5: Delete a Company
exports.deleteCompany = async (req, res, next) => {
    // ... Authorization logic to ensure only relevant users/admins can delete ...
}
