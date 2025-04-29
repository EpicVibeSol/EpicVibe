#!/usr/bin/env node
require('dotenv').config();
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

/**
 * Deploy EPIC token to Solana blockchain
 * Note: This is a simplified representation. Actual Solana deployment 
 * would involve compiling and deploying Rust programs.
 */
async function deployEPICToken() {
  console.log('🚀 Deploying EPIC token to Solana...');
  
  try {
    // Connect to Solana network
    const network = process.env.SOLANA_NETWORK || 'devnet';
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    
    console.log(`📡 Connecting to Solana ${network} at ${rpcUrl}...`);
    const connection = new Connection(rpcUrl, 'confirmed');
    
    // Load or create deployer keypair
    let deployerKeypair;
    
    if (process.env.WALLET_PRIVATE_KEY) {
      // Load keypair from private key
      const privateKeyBytes = Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex');
      deployerKeypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log(`👤 Using provided wallet: ${deployerKeypair.publicKey.toString()}`);
    } else {
      // For demo purposes, create a new keypair
      deployerKeypair = Keypair.generate();
      console.log(`👤 Created new wallet for demo: ${deployerKeypair.publicKey.toString()}`);
      console.log('⚠️ This is a demo wallet. In production, use a secure wallet.');
    }
    
    // Check deployer balance
    const balance = await connection.getBalance(deployerKeypair.publicKey);
    console.log(`💰 Wallet balance: ${balance / 1000000000} SOL`);
    
    if (balance < 1000000000) {
      console.log('⚠️ Low balance. For devnet, request an airdrop...');
      if (network === 'devnet') {
        await connection.requestAirdrop(deployerKeypair.publicKey, 1000000000);
        console.log('💸 Airdrop requested');
      } else {
        console.log('❌ Please fund your wallet with SOL before continuing');
        return;
      }
    }
    
    console.log('\n🏗️ Creating EPIC token...');
    
    // Create mint account
    const epicToken = await Token.createMint(
      connection,
      deployerKeypair,
      deployerKeypair.publicKey,
      null, // Freeze authority (none)
      6, // Decimals
      TOKEN_PROGRAM_ID
    );
    
    console.log(`✅ EPIC token created with mint address: ${epicToken.publicKey.toString()}`);
    
    // Create accounts
    console.log('\n🏦 Creating token accounts...');
    
    // Treasury account
    const treasuryAccount = await epicToken.createAccount(deployerKeypair.publicKey);
    console.log(`📝 Treasury account: ${treasuryAccount.toString()}`);
    
    // Reward pool account
    const rewardPoolAccount = await epicToken.createAccount(deployerKeypair.publicKey);
    console.log(`📝 Reward pool account: ${rewardPoolAccount.toString()}`);
    
    // Buyback wallet account
    const buybackAccount = await epicToken.createAccount(deployerKeypair.publicKey);
    console.log(`📝 Buyback account: ${buybackAccount.toString()}`);
    
    // Mint initial supply to treasury
    console.log('\n💵 Minting initial supply to treasury...');
    
    // 100 million tokens with 6 decimals
    const initialSupply = 100_000_000 * (10 ** 6);
    await epicToken.mintTo(
      treasuryAccount,
      deployerKeypair.publicKey,
      [],
      initialSupply
    );
    
    console.log(`✅ Minted ${initialSupply / (10 ** 6)} EPIC tokens to treasury`);
    
    // Fund the reward pool
    console.log('\n🏆 Funding reward pool...');
    
    // Transfer 20 million tokens to reward pool
    const rewardPoolAmount = 20_000_000 * (10 ** 6);
    await epicToken.transfer(
      treasuryAccount,
      rewardPoolAccount,
      deployerKeypair.publicKey,
      [],
      rewardPoolAmount
    );
    
    console.log(`✅ Transferred ${rewardPoolAmount / (10 ** 6)} EPIC tokens to reward pool`);
    
    // Save deployment info
    const deploymentInfo = {
      network,
      timestamp: new Date().toISOString(),
      tokenMint: epicToken.publicKey.toString(),
      treasury: treasuryAccount.toString(),
      rewardPool: rewardPoolAccount.toString(),
      buyback: buybackAccount.toString(),
      deployer: deployerKeypair.publicKey.toString(),
      initialSupply: initialSupply / (10 ** 6)
    };
    
    const outputDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `epic-token-${network}-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`\n📄 Deployment info saved to ${outputPath}`);
    console.log('\n✨ EPIC token deployment complete!');
    
    // Also update environment variables
    console.log(`\n🔑 Update your .env file with the following:`);
    console.log(`EPIC_TOKEN_MINT=${epicToken.publicKey.toString()}`);
    console.log(`REWARD_POOL_PUBKEY=${rewardPoolAccount.toString()}`);
    
    return deploymentInfo;
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  deployEPICToken()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  module.exports = deployEPICToken;
} 