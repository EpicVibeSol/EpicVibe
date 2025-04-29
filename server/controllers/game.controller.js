const aiService = require('../services/ai.service');
const tokenService = require('../services/token.service');
const GAME_TEMPLATES = require('../data/game-templates.json');
const STYLE_TEMPLATES = require('../data/style-templates.json');

// Mock database for demo purposes
const gamesDB = [];

// Generate some sample games
for (let i = 0; i < 12; i++) {
  const gameType = GAME_TEMPLATES[i % GAME_TEMPLATES.length].type;
  const gameStyle = STYLE_TEMPLATES[i % STYLE_TEMPLATES.length].style;
  const baseColor = gameStyle === 'Cyberpunk' ? '252525/31CCCC' : 
                   (gameStyle === 'Retro Synthwave' ? '252525/FF56B1' : 
                   (gameStyle === 'Pixel Art' ? '252525/56FF83' : '252525/FFDD00'));
  
  gamesDB.push({
    id: `game_${i + 1}`,
    title: `Sample ${gameStyle} ${gameType} ${i + 1}`,
    description: `This is a ${gameStyle.toLowerCase()} style ${gameType.toLowerCase()} game showcasing the EpicVibe platform capabilities.`,
    creator: {
      id: `user_${(i % 5) + 1}`,
      username: `creator${(i % 5) + 1}`,
      walletAddress: `WALLET${(i % 5) + 1}XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
    },
    gameType: gameType,
    gameStyle: gameStyle,
    complexity: i % 2 === 0 ? 'Simple' : 'Advanced',
    mainImage: `https://placehold.co/600x400/${baseColor}/png?text=${gameType}+${i+1}`,
    createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
    updatedAt: new Date(Date.now() - (i * 43200000)).toISOString(),
    stats: {
      plays: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 200),
      tokensEarned: Math.floor(Math.random() * 100)
    },
    hash: `GAME${i + 1}HASH${Math.random().toString(36).substring(2, 10)}`,
    playUrl: `/play/${i + 1}`,
    isPublished: true
  });
}

/**
 * Game Controller - Handles game-related API requests
 */
const gameController = {
  /**
   * Get a list of games with optional filtering
   */
  getGames: async (req, res) => {
    try {
      const { type, style, creator, limit = 20, offset = 0, sort = 'recent' } = req.query;
      
      // Filter games based on query parameters
      let filteredGames = [...gamesDB];
      
      if (type) {
        filteredGames = filteredGames.filter(game => game.gameType === type);
      }
      
      if (style) {
        filteredGames = filteredGames.filter(game => game.gameStyle === style);
      }
      
      if (creator) {
        filteredGames = filteredGames.filter(game => game.creator.id === creator || game.creator.username === creator);
      }
      
      // Sort games
      if (sort === 'recent') {
        filteredGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'popular') {
        filteredGames.sort((a, b) => b.stats.plays - a.stats.plays);
      } else if (sort === 'trending') {
        // Weighted score based on recent plays, likes, and shares
        filteredGames.sort((a, b) => {
          const scoreA = a.stats.plays * 1 + a.stats.likes * 2 + a.stats.shares * 3;
          const scoreB = b.stats.plays * 1 + b.stats.likes * 2 + b.stats.shares * 3;
          return scoreB - scoreA;
        });
      }
      
      // Paginate results
      const paginatedGames = filteredGames.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
      
      res.json({
        status: 'success',
        data: {
          games: paginatedGames,
          total: filteredGames.length,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error('Error getting games:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get games',
        error: error.message
      });
    }
  },
  
  /**
   * Get a single game by ID
   */
  getGameById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const game = gamesDB.find(game => game.id === id);
      
      if (!game) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${id} not found`
        });
      }
      
      res.json({
        status: 'success',
        data: {
          game
        }
      });
    } catch (error) {
      console.error(`Error getting game ${req.params.id}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get game',
        error: error.message
      });
    }
  },
  
  /**
   * Generate a new game based on natural language description
   */
  generateGame: async (req, res) => {
    try {
      const { description, gameType, gameStyle, complexity = 'Simple' } = req.body;
      
      if (!description) {
        return res.status(400).json({
          status: 'error',
          message: 'Game description is required'
        });
      }
      
      // Use AI service to generate the game
      const generatedGame = await aiService.generateGame({
        description,
        gameType,
        gameStyle,
        complexity
      });
      
      // Create a new game object
      const newGame = {
        id: `game_${gamesDB.length + 1}`,
        title: generatedGame.title,
        description: generatedGame.description,
        creator: {
          id: req.user.id,
          username: req.user.username,
          walletAddress: req.user.walletAddress
        },
        gameType: generatedGame.gameType,
        gameStyle: generatedGame.gameStyle,
        complexity: generatedGame.complexity,
        mainImage: generatedGame.assets.mainImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          plays: 0,
          likes: 0,
          shares: 0,
          tokensEarned: 0
        },
        hash: generatedGame.hash,
        playUrl: `/play/${gamesDB.length + 1}`,
        isPublished: false,
        assets: generatedGame.assets,
        mechanics: generatedGame.mechanics,
        code: generatedGame.code
      };
      
      // For demo purposes, we'll add the game to our mock database
      // In production, this would be stored in a real database and blockchain
      gamesDB.push(newGame);
      
      res.status(201).json({
        status: 'success',
        data: {
          game: newGame
        }
      });
    } catch (error) {
      console.error('Error generating game:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate game',
        error: error.message
      });
    }
  },
  
  /**
   * Save a game to the blockchain
   */
  saveGame: async (req, res) => {
    try {
      const { gameId } = req.body;
      
      // Find the game
      const gameIndex = gamesDB.findIndex(game => game.id === gameId);
      
      if (gameIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${gameId} not found`
        });
      }
      
      // Check ownership
      if (gamesDB[gameIndex].creator.id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to save this game'
        });
      }
      
      // Update game status
      gamesDB[gameIndex].isPublished = true;
      gamesDB[gameIndex].updatedAt = new Date().toISOString();
      
      // Award tokens for game creation (if first time publishing)
      if (gamesDB[gameIndex].stats.tokensEarned === 0) {
        const tokenReward = 25; // Base reward for creating a game
        
        // In production, this would interact with the blockchain
        const tokenTransaction = await tokenService.awardTokens(
          gamesDB[gameIndex].creator.walletAddress,
          tokenReward,
          'game_creation'
        );
        
        // Update token stats
        gamesDB[gameIndex].stats.tokensEarned += tokenReward;
        
        return res.json({
          status: 'success',
          data: {
            game: gamesDB[gameIndex],
            transaction: tokenTransaction
          },
          message: `Game published successfully and earned ${tokenReward} $EPIC tokens!`
        });
      }
      
      res.json({
        status: 'success',
        data: {
          game: gamesDB[gameIndex]
        },
        message: 'Game published successfully'
      });
    } catch (error) {
      console.error('Error saving game:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save game',
        error: error.message
      });
    }
  },
  
  /**
   * Update a game's metadata
   */
  updateGame: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      
      // Find the game
      const gameIndex = gamesDB.findIndex(game => game.id === id);
      
      if (gameIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${id} not found`
        });
      }
      
      // Check ownership
      if (gamesDB[gameIndex].creator.id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to update this game'
        });
      }
      
      // Update game data
      if (title) gamesDB[gameIndex].title = title;
      if (description) gamesDB[gameIndex].description = description;
      gamesDB[gameIndex].updatedAt = new Date().toISOString();
      
      res.json({
        status: 'success',
        data: {
          game: gamesDB[gameIndex]
        },
        message: 'Game updated successfully'
      });
    } catch (error) {
      console.error(`Error updating game ${req.params.id}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update game',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a game
   */
  deleteGame: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the game
      const gameIndex = gamesDB.findIndex(game => game.id === id);
      
      if (gameIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${id} not found`
        });
      }
      
      // Check ownership
      if (gamesDB[gameIndex].creator.id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to delete this game'
        });
      }
      
      // Remove game from database
      const deletedGame = gamesDB.splice(gameIndex, 1)[0];
      
      res.json({
        status: 'success',
        data: {
          game: deletedGame
        },
        message: 'Game deleted successfully'
      });
    } catch (error) {
      console.error(`Error deleting game ${req.params.id}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete game',
        error: error.message
      });
    }
  },
  
  /**
   * Record a game play and award tokens
   */
  playGame: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the game
      const gameIndex = gamesDB.findIndex(game => game.id === id);
      
      if (gameIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${id} not found`
        });
      }
      
      // Increment play count
      gamesDB[gameIndex].stats.plays += 1;
      
      // Award tokens to creator (in production with rate limiting)
      const creatorReward = 0.1; // Small reward per play
      
      // In production, this would interact with the blockchain
      await tokenService.awardTokens(
        gamesDB[gameIndex].creator.walletAddress,
        creatorReward,
        'game_play_creator'
      );
      
      // Update creator token stats
      gamesDB[gameIndex].stats.tokensEarned += creatorReward;
      
      // Award tokens to player (in production with rate limiting)
      const playerReward = 0.5; // Reward for playing
      
      // In production, this would interact with the blockchain
      const playerTransaction = await tokenService.awardTokens(
        req.user.walletAddress,
        playerReward,
        'game_play_player'
      );
      
      res.json({
        status: 'success',
        data: {
          game: gamesDB[gameIndex],
          reward: playerReward,
          transaction: playerTransaction
        },
        message: `Earned ${playerReward} $EPIC tokens for playing!`
      });
    } catch (error) {
      console.error(`Error playing game ${req.params.id}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to record game play',
        error: error.message
      });
    }
  },
  
  /**
   * Like a game and award tokens to creator
   */
  likeGame: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the game
      const gameIndex = gamesDB.findIndex(game => game.id === id);
      
      if (gameIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${id} not found`
        });
      }
      
      // Increment like count
      gamesDB[gameIndex].stats.likes += 1;
      
      // Award tokens to creator
      const creatorReward = 1; // Reward per like
      
      // In production, this would interact with the blockchain
      const transaction = await tokenService.awardTokens(
        gamesDB[gameIndex].creator.walletAddress,
        creatorReward,
        'game_like'
      );
      
      // Update creator token stats
      gamesDB[gameIndex].stats.tokensEarned += creatorReward;
      
      res.json({
        status: 'success',
        data: {
          game: gamesDB[gameIndex],
          transaction: transaction
        },
        message: `You liked the game! Creator earned ${creatorReward} $EPIC tokens.`
      });
    } catch (error) {
      console.error(`Error liking game ${req.params.id}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to like game',
        error: error.message
      });
    }
  },
  
  /**
   * Share a game and get token rewards
   */
  shareGame: async (req, res) => {
    try {
      const { id } = req.params;
      const { platform } = req.body; // e.g., 'twitter', 'discord'
      
      // Find the game
      const gameIndex = gamesDB.findIndex(game => game.id === id);
      
      if (gameIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: `Game with ID ${id} not found`
        });
      }
      
      // Increment share count
      gamesDB[gameIndex].stats.shares += 1;
      
      // Award tokens to sharer
      const sharerReward = 2; // Reward for sharing
      
      // In production, this would interact with the blockchain
      const transaction = await tokenService.awardTokens(
        req.user.walletAddress,
        sharerReward,
        `game_share_${platform || 'unknown'}`
      );
      
      res.json({
        status: 'success',
        data: {
          game: gamesDB[gameIndex],
          reward: sharerReward,
          transaction: transaction
        },
        message: `Earned ${sharerReward} $EPIC tokens for sharing!`
      });
    } catch (error) {
      console.error(`Error sharing game ${req.params.id}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to share game',
        error: error.message
      });
    }
  },
  
  /**
   * Get games created by a specific user
   */
  getUserGames: async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Filter games by creator
      const userGames = gamesDB.filter(game => 
        game.creator.id === userId || game.creator.username === userId
      );
      
      res.json({
        status: 'success',
        data: {
          games: userGames,
          total: userGames.length
        }
      });
    } catch (error) {
      console.error(`Error getting games for user ${req.params.userId}:`, error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get user games',
        error: error.message
      });
    }
  },
  
  /**
   * Get trending games based on plays, likes, and shares
   */
  getTrendingGames: async (req, res) => {
    try {
      const { limit = 5 } = req.query;
      
      // Sort games by a weighted score of plays, likes, and shares
      const trendingGames = [...gamesDB]
        .sort((a, b) => {
          const scoreA = a.stats.plays * 1 + a.stats.likes * 2 + a.stats.shares * 3;
          const scoreB = b.stats.plays * 1 + b.stats.likes * 2 + b.stats.shares * 3;
          return scoreB - scoreA;
        })
        .slice(0, parseInt(limit));
      
      res.json({
        status: 'success',
        data: {
          games: trendingGames,
          total: trendingGames.length
        }
      });
    } catch (error) {
      console.error('Error getting trending games:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get trending games',
        error: error.message
      });
    }
  },
  
  /**
   * Get available game styles
   */
  getGameStyles: async (req, res) => {
    try {
      // Extract style information from templates
      const styles = STYLE_TEMPLATES.map(style => ({
        id: style.style,
        name: style.style,
        description: style.description,
        colors: style.colors,
        background: style.background
      }));
      
      res.json({
        status: 'success',
        data: {
          styles: styles
        }
      });
    } catch (error) {
      console.error('Error getting game styles:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get game styles',
        error: error.message
      });
    }
  },
  
  /**
   * Get available game types
   */
  getGameTypes: async (req, res) => {
    try {
      // Extract type information from templates
      const types = GAME_TEMPLATES.map(type => ({
        id: type.type,
        name: type.type,
        description: type.description,
        difficulty: type.difficulty,
        mechanics: type.mechanics
      }));
      
      res.json({
        status: 'success',
        data: {
          types: types
        }
      });
    } catch (error) {
      console.error('Error getting game types:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get game types',
        error: error.message
      });
    }
  }
};

module.exports = gameController; 