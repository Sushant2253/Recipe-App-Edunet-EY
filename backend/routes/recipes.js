const router = require('express').Router();
const Recipe = require('../models/Recipe');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Get all recipes with search
router.get('/', async (req, res) => {
    try {
        const { search, type } = req.query;
        let query = {};

        if (search && search.trim() !== '') {
            if (type === 'name') {
                query.name = { $regex: search, $options: 'i' };
            } else if (type === 'cuisine') {
                query.cuisine = { $regex: search, $options: 'i' };
            }
        }

        const recipes = await Recipe.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'username'); // Optional: if you want to show who created the recipe

        res.json({
            success: true,
            recipes
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching recipes' 
        });
    }
});

// Get single recipe
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching recipe with ID:', req.params.id); // Debug log
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            console.log('Recipe not found'); // Debug log
            return res.status(404).json({ 
                success: false,
                message: 'Recipe not found' 
            });
        }

        console.log('Found recipe:', recipe); // Debug log
        res.json({
            success: true,
            recipe
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching recipe' 
        });
    }
});

// Create recipe (protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log('User from token:', req.user); // Debug log
        console.log('Recipe data received:', req.body); // Debug log

        const recipe = new Recipe({
            ...req.body,
            userId: req.user.id
        });

        const savedRecipe = await recipe.save();
        console.log('Saved recipe:', savedRecipe); // Debug log

        res.status(201).json({
            success: true,
            _id: savedRecipe._id,
            ...savedRecipe._doc
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating recipe',
            error: error.message 
        });
    }
});

// Update recipe (protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ 
                success: false, 
                message: 'Recipe not found' 
            });
        }

        if (recipe.userId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this recipe' 
            });
        }

        // Clean and validate the update data
        const updateData = {
            name: req.body.name,
            cuisine: req.body.cuisine,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions
        };

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found after update'
            });
        }

        res.json({
            success: true,
            recipe: updatedRecipe
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating recipe',
            error: error.message
        });
    }
});

// Delete recipe (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user owns the recipe
        if (recipe.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe' });
    }
});

module.exports = router; 