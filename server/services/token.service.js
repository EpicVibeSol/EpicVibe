const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID, u64 } = require('@solana/spl-token');
const fs = require('fs').promises;
const path = require('path');

/**
 * Service for handling EPIC token operations on Solana blockchain
 */
class TokenService {
  constructor() {
    // Initialize Solana connection
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    // EPIC token mint (would be loaded from environment in production)
    this.epicTokenMint = process.env.EPIC_TOKEN_MINT || 'EPiCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    
    // Reward pool address (would be loaded from environment in production)
    this.rewardPoolAddress = process.env.REWARD_POOL_PUBKEY || 'RWD1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    
    // For demo purposes, we'll simulate blockchain operations
    this.simulationMode = !process.env.SOLANA_WALLET_PRIVATE_KEY;
    
    console.log(`TokenService initialized in ${this.simulationMode ? 'SIMULATION' : 'BLOCKCHAIN'} mode`);
    console.log(`EPIC token mint: ${this.epicTokenMint}`);
    console.log(`Reward pool: ${this.rewardPoolAddress}`);
  }
  
  /**
   * Get a user's EPIC token balance
   * @param {string} walletAddress - Solana wallet address
   * @returns {Promise<number>} - Token balance
   */
  async getBalance(walletAddress) {
    try {
      if (this.simulationMode) {
        // Simulate a balance for demo purposes
        return this._simulateBalance(walletAddress);
      }
      
      // In production, this would query the actual Solana blockchain
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(this.epicTokenMint);
      
      // Find the associated token account
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPublicKey, 
        { mint: tokenMintPublicKey }
      );
      
      if (tokenAccounts.value.length === 0) {
        return 0;
      }
      
      // Get the balance from the first associated token account
      const tokenBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return tokenBalance;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }
  
  /**
   * Award EPIC tokens to a user for creating or engaging with content
   * @param {string} walletAddress - Recipient wallet address
   * @param {number} amount - Amount of tokens to award
   * @param {string} reason - Reason for the reward (e.g., 'game_creation', 'game_play')
   * @returns {Promise<Object>} - Transaction details
   */
  async awardTokens(walletAddress, amount, reason) {
    try {
      if (this.simulationMode) {
        // Simulate a transaction for demo purposes
        return this._simulateTransaction(walletAddress, amount, reason);
      }
      
      // In production, this would send actual tokens on Solana
      const recipientPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(this.epicTokenMint);
      const rewardPoolPublicKey = new PublicKey(this.rewardPoolAddress);
      
      // Create a new transaction
      const transaction = new Transaction();
      
      // Add token transfer instruction
      // Note: In production, this would use the private key to sign the transaction
      const transferInstruction = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        rewardPoolPublicKey,
        recipientPublicKey,
        rewardPoolPublicKey,
        [],
        new u64(amount * 1000000) // Assuming 6 decimals for the token
      );
      
      transaction.add(transferInstruction);
      
      // Send transaction (would be signed in production)
      const txSignature = 'simulated_signature';
      
      return {
        signature: txSignature,
        amount: amount,
        recipient: walletAddress,
        timestamp: new Date().toISOString(),
        reason: reason,
        status: 'confirmed'
      };
    } catch (error) {
      console.error('Error awarding tokens:', error);
      throw new Error(`Failed to award tokens: ${error.message}`);
    }
  }
  
  /**
   * Purchase items or features with EPIC tokens
   * @param {string} walletAddress - User's wallet address
   * @param {number} amount - Amount to spend
   * @param {string} itemId - ID of the item being purchased
   * @returns {Promise<Object>} - Transaction details
   */
  async purchaseWithTokens(walletAddress, amount, itemId) {
    try {
      if (this.simulationMode) {
        // Simulate a purchase for demo purposes
        return this._simulateTransaction(walletAddress, -amount, `purchase_${itemId}`);
      }
      
      // Similar to awardTokens but in reverse direction
      // In production, this would burn or transfer tokens
      
      return {
        signature: 'simulated_purchase_signature',
        amount: amount,
        payer: walletAddress,
        itemId: itemId,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      };
    } catch (error) {
      console.error('Error processing token purchase:', error);
      throw new Error(`Failed to process purchase: ${error.message}`);
    }
  }
  
  /**
   * Get transaction history for a wallet
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Array>} - Transaction history
   */
  async getTransactionHistory(walletAddress) {
    try {
      if (this.simulationMode) {
        // Simulate transaction history for demo purposes
        return this._simulateTransactionHistory(walletAddress);
      }
      
      // In production, this would query the Solana blockchain
      const walletPublicKey = new PublicKey(walletAddress);
      
      // This would fetch real transaction signatures in production
      const signatures = ['sig1', 'sig2', 'sig3'];
      
      // For each signature, get the transaction details
      const transactions = [];
      
      // Return mock data for demo
      return [
        {
          signature: 'sig1',
          amount: 10,
          type: 'reward',
          reason: 'game_creation',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'confirmed'
        },
        {
          signature: 'sig2',
          amount: -5,
          type: 'purchase',
          reason: 'advanced_feature',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          status: 'confirmed'
        },
        {
          signature: 'sig3',
          amount: 2,
          type: 'reward',
          reason: 'game_play',
          timestamp: new Date(Date.now() - 21600000).toISOString(),
          status: 'confirmed'
        }
      ];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }
  
  /**
   * Simulate getting a token balance (for demo)
   * @private
   */
  _simulateBalance(walletAddress) {
    // Generate a deterministic but random-seeming balance based on wallet address
    const hash = walletAddress.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Base balance between 10 and 500
    const baseBalance = 10 + Math.abs(hash % 490);
    
    // Add some decimals
    const decimals = Math.abs((hash >> 8) % 100) / 100;
    
    return parseFloat((baseBalance + decimals).toFixed(2));
  }
  
  /**
   * Simulate a token transaction (for demo)
   * @private
   */
  _simulateTransaction(walletAddress, amount, reason) {
    // Generate a mock transaction signature
    const signature = 'EPIC' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    return {
      signature: signature,
      amount: amount,
      recipient: walletAddress,
      timestamp: new Date().toISOString(),
      reason: reason,
      status: 'confirmed'
    };
  }
  
  /**
   * Simulate transaction history (for demo)
   * @private
   */
  _simulateTransactionHistory(walletAddress) {
    // Create a variety of transaction types
    const transactions = [];
    
    // Add game creation rewards
    transactions.push({
      signature: 'EPIC' + Math.random().toString(36).substring(2, 15),
      amount: 25,
      type: 'reward',
      reason: 'game_creation',
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
      status: 'confirmed'
    });
    
    // Add game play rewards
    for (let i = 0; i < 3; i++) {
      transactions.push({
        signature: 'EPIC' + Math.random().toString(36).substring(2, 15),
        amount: 2 + Math.floor(Math.random() * 5),
        type: 'reward',
        reason: 'game_play',
        timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
        status: 'confirmed'
      });
    }
    
    // Add purchases
    transactions.push({
      signature: 'EPIC' + Math.random().toString(36).substring(2, 15),
      amount: -10,
      type: 'purchase',
      reason: 'advanced_feature',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'confirmed'
    });
    
    // Add staking
    transactions.push({
      signature: 'EPIC' + Math.random().toString(36).substring(2, 15),
      amount: -50,
      type: 'stake',
      reason: 'governance_voting',
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'confirmed'
    });
    
    // Add rewards from community
    transactions.push({
      signature: 'EPIC' + Math.random().toString(36).substring(2, 15),
      amount: 15,
      type: 'reward',
      reason: 'community_upvote',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'confirmed'
    });
    
    // Sort by timestamp (newest first)
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

module.exports = new TokenService(); 