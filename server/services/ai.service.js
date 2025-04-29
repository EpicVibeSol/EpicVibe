const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Game generation templates
const GAME_TEMPLATES = require('../data/game-templates.json');
const STYLE_TEMPLATES = require('../data/style-templates.json');

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-development',
});

// OpenAI API instance
const openai = new OpenAIApi(configuration);

/**
 * AI Service for game generation
 */
class AIService {
  /**
   * Generate a game based on natural language description
   * @param {Object} params - Generation parameters
   * @param {string} params.description - Natural language description of the game
   * @param {string} params.gameType - Type of game (Racing, RPG, etc.)
   * @param {string} params.gameStyle - Visual style (Cyberpunk, Retro, etc.)
   * @param {string} params.complexity - Complexity level (Simple, Advanced)
   * @returns {Promise<Object>} Generated game data
   */
  async generateGame(params) {
    const { description, gameType, gameStyle, complexity = 'Simple' } = params;
    
    try {
      // In production, this would use the actual OpenAI API
      // For demo purposes, we'll simulate the AI response
      
      console.log(`Generating game with AI: "${description}" (${gameType}, ${gameStyle})`);
      
      // Simulate AI processing time
      await this._simulateProcessingDelay();
      
      // Find appropriate templates
      const typeTemplate = GAME_TEMPLATES.find(t => t.type === gameType) || GAME_TEMPLATES[0];
      const styleTemplate = STYLE_TEMPLATES.find(s => s.style === gameStyle) || STYLE_TEMPLATES[0];
      
      // Generate game title based on description
      const gameTitle = await this._generateGameTitle(description, gameType, gameStyle);
      
      // Generate game code (simulated for demo)
      const gameCode = this._generateGameCode(typeTemplate, styleTemplate, complexity);
      
      // Generate art assets based on style
      const assets = await this._generateGameAssets(description, gameStyle, gameType);
      
      // Generate game mechanics
      const mechanics = this._generateGameMechanics(typeTemplate, complexity);
      
      return {
        title: gameTitle,
        description: description,
        gameType: gameType,
        gameStyle: gameStyle,
        complexity: complexity,
        code: gameCode,
        assets: assets,
        mechanics: mechanics,
        generatedAt: new Date().toISOString(),
        hash: this._generateUniqueHash(),
      };
    } catch (error) {
      console.error('Error generating game with AI:', error);
      throw new Error(`Failed to generate game: ${error.message}`);
    }
  }
  
  /**
   * Generate a game title using AI
   * @private
   */
  async _generateGameTitle(description, gameType, gameStyle) {
    // In production, this would use the OpenAI API
    // For demo, we'll use a simple algorithm to generate a title
    
    const keywords = description
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3 && !['game', 'with', 'that', 'this', 'have', 'about'].includes(word));
    
    if (keywords.length === 0) {
      // Fallback titles based on game type and style
      const stylePrefixes = {
        'Cyberpunk': ['Neon', 'Cyber', 'Digital', 'Synth'],
        'Retro Synthwave': ['Retro', 'Wave', 'Synth', 'Arcade'],
        'Pixel Art': ['Pixel', 'Bit', 'Dot', 'Block'],
        'Neon': ['Glow', 'Neon', 'Bright', 'Flux']
      };
      
      const typeSuffixes = {
        'Racing': ['Drift', 'Racer', 'Speed', 'Drive'],
        'RPG': ['Quest', 'Chronicles', 'Legend', 'Saga'],
        'Puzzle': ['Logic', 'Mind', 'Enigma', 'Riddle'],
        'Rhythm': ['Beat', 'Tempo', 'Pulse', 'Groove']
      };
      
      const prefix = stylePrefixes[gameStyle] ? 
        stylePrefixes[gameStyle][Math.floor(Math.random() * stylePrefixes[gameStyle].length)] : 
        'Epic';
        
      const suffix = typeSuffixes[gameType] ? 
        typeSuffixes[gameType][Math.floor(Math.random() * typeSuffixes[gameType].length)] : 
        'Vibe';
      
      return `${prefix} ${suffix}`;
    }
    
    // Select a keyword and add a thematic suffix
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    
    const suffixes = ['Vibe', 'Pulse', 'Rush', 'Epic', 'Flux', 'Wave', 'Drift', 'Saga', 'Quest'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${capitalized} ${suffix}`;
  }
  
  /**
   * Generate game code based on templates
   * @private
   */
  _generateGameCode(typeTemplate, styleTemplate, complexity) {
    // In a real implementation, this would generate actual code
    // For demo, we'll return a template string
    
    return {
      entryPoint: 'index.js',
      mainScript: `// Generated EpicVibe Game: ${new Date().toISOString()}
import { initGame, createScene, loadAssets } from './engine/core.js';
import { ${typeTemplate.mechanics.join(', ')} } from './engine/mechanics.js';
import { ${styleTemplate.assets.join(', ')} } from './assets/index.js';

// Initialize game environment
const game = initGame({
  type: '${typeTemplate.type}',
  style: '${styleTemplate.style}',
  complexity: '${complexity}',
  mechanics: [${typeTemplate.mechanics.map(m => `'${m}'`).join(', ')}],
  assets: [${styleTemplate.assets.map(a => `'${a}'`).join(', ')}]
});

// Set up game scene
const scene = createScene(game);
scene.setBackground('${styleTemplate.background}');

// Load game assets
loadAssets(game, () => {
  // Game starts here
  game.start();
});`,
      files: [
        'engine/core.js',
        'engine/mechanics.js',
        'assets/index.js',
        'assets/sprites.js',
        'assets/sounds.js',
        'assets/maps.js',
        'styles/main.css',
      ]
    };
  }
  
  /**
   * Generate game assets based on style
   * @private
   */
  async _generateGameAssets(description, gameStyle, gameType) {
    // In production, this would generate actual assets
    // For demo, we'll use placeholder URLs
    
    const baseColorMap = {
      'Cyberpunk': '252525/31CCCC',
      'Retro Synthwave': '252525/FF56B1',
      'Pixel Art': '252525/56FF83',
      'Neon': '252525/FFDD00'
    };
    
    const baseColor = baseColorMap[gameStyle] || '252525/31CCCC';
    
    // Generate game banner image
    const mainImageText = description.length > 20 ? description.substring(0, 20) + '...' : description;
    const mainImage = `https://placehold.co/1200x600/${baseColor}/png?text=${encodeURIComponent(mainImageText)}`;
    
    // Generate character images
    const characterCount = gameType === 'RPG' ? 3 : 1;
    const characters = Array(characterCount).fill(0).map((_, i) => {
      return `https://placehold.co/300x400/${baseColor}/png?text=Character+${i+1}`;
    });
    
    // Generate map/level images
    const levelCount = gameType === 'Racing' ? 3 : (gameType === 'Puzzle' ? 5 : 2);
    const levels = Array(levelCount).fill(0).map((_, i) => {
      return `https://placehold.co/600x400/${baseColor}/png?text=Level+${i+1}`;
    });
    
    return {
      mainImage,
      characters,
      levels,
      ui: {
        buttons: `https://placehold.co/200x100/${baseColor}/png?text=UI+Elements`,
        hud: `https://placehold.co/600x100/${baseColor}/png?text=Game+HUD`
      },
      sound: {
        background: 'background.mp3',
        effects: ['effect1.mp3', 'effect2.mp3']
      }
    };
  }
  
  /**
   * Generate game mechanics based on game type
   * @private
   */
  _generateGameMechanics(typeTemplate, complexity) {
    // Create game mechanics based on template and complexity
    const baseMechanics = typeTemplate.mechanics;
    const advancedMechanics = complexity === 'Advanced' ? typeTemplate.advancedMechanics || [] : [];
    
    return [
      ...baseMechanics,
      ...advancedMechanics
    ].map(mechanic => ({
      name: mechanic,
      description: `Implementation of ${mechanic} game mechanic`,
      parameters: {
        speed: Math.floor(Math.random() * 100),
        power: Math.floor(Math.random() * 100),
        duration: Math.floor(Math.random() * 60)
      }
    }));
  }
  
  /**
   * Generate a unique hash for the game
   * @private
   */
  _generateUniqueHash() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Simulate AI processing delay
   * @private
   */
  async _simulateProcessingDelay() {
    return new Promise(resolve => {
      setTimeout(resolve, 2000 + Math.random() * 2000);
    });
  }
}

module.exports = new AIService(); 