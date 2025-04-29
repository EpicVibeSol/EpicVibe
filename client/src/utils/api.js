// API utility functions

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch data from the API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Get games from the API
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - List of games
 */
export const getGames = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return fetchData(`/games?${queryParams}`);
};

/**
 * Get game by ID
 * @param {string} id - Game ID
 * @returns {Promise<Object>} - Game data
 */
export const getGameById = async (id) => {
  return fetchData(`/games/${id}`);
};

/**
 * Create a new game
 * @param {Object} gameData - Game data
 * @returns {Promise<Object>} - Created game
 */
export const createGame = async (gameData) => {
  return fetchData('/games', {
    method: 'POST',
    body: JSON.stringify(gameData),
  });
};

export default {
  fetchData,
  getGames,
  getGameById,
  createGame,
}; 