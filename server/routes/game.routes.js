const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const gameController = require('../controllers/game.controller');

/**
 * @route GET /api/games
 * @description Get list of games
 * @access Public
 */
router.get('/', gameController.getGames);

/**
 * @route GET /api/games/:id
 * @description Get a single game by ID
 * @access Public
 */
router.get('/:id', gameController.getGameById);

/**
 * @route POST /api/games/generate
 * @description Generate a new game based on natural language description
 * @access Private
 */
router.post('/generate', authMiddleware, gameController.generateGame);

/**
 * @route POST /api/games
 * @description Save a game to the blockchain
 * @access Private
 */
router.post('/', authMiddleware, gameController.saveGame);

/**
 * @route PUT /api/games/:id
 * @description Update a game's metadata
 * @access Private
 */
router.put('/:id', authMiddleware, gameController.updateGame);

/**
 * @route DELETE /api/games/:id
 * @description Delete a game
 * @access Private
 */
router.delete('/:id', authMiddleware, gameController.deleteGame);

/**
 * @route POST /api/games/:id/play
 * @description Record a game play and award tokens
 * @access Private
 */
router.post('/:id/play', authMiddleware, gameController.playGame);

/**
 * @route POST /api/games/:id/like
 * @description Like a game and award tokens to creator
 * @access Private
 */
router.post('/:id/like', authMiddleware, gameController.likeGame);

/**
 * @route POST /api/games/:id/share
 * @description Share a game and get token rewards
 * @access Private
 */
router.post('/:id/share', authMiddleware, gameController.shareGame);

/**
 * @route GET /api/games/user/:userId
 * @description Get games created by a specific user
 * @access Public
 */
router.get('/user/:userId', gameController.getUserGames);

/**
 * @route GET /api/games/trending
 * @description Get trending games based on plays, likes, and shares
 * @access Public
 */
router.get('/trending', gameController.getTrendingGames);

/**
 * @route GET /api/games/styles
 * @description Get available game styles
 * @access Public
 */
router.get('/styles', gameController.getGameStyles);

/**
 * @route GET /api/games/types
 * @description Get available game types
 * @access Public
 */
router.get('/types', gameController.getGameTypes);

module.exports = router; 