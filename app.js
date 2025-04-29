document.addEventListener('DOMContentLoaded', function() {
    // Game creation form
    const gameForm = document.getElementById('game-creation-form');
    const gameDescription = document.getElementById('game-description');
    const generateBtn = document.getElementById('generate-btn');
    
    // Game preview elements
    const gamePreview = document.getElementById('game-preview');
    const initialState = gamePreview.querySelector('.initial-state');
    const loadingState = gamePreview.querySelector('.loading-state');
    const resultState = gamePreview.querySelector('.result-state');
    const gameImage = document.getElementById('game-image');
    const gameTitle = document.getElementById('game-title');
    const gameDescriptionResult = document.getElementById('game-description-result');
    const playBtn = document.getElementById('play-btn');
    const shareBtn = document.getElementById('share-btn');
    
    // Style and type buttons
    const styleButtons = document.querySelectorAll('.style-btn');
    const typeButtons = document.querySelectorAll('.type-btn');
    
    // Game templates for simulation
    const gameTemplates = [
        {
            type: 'Racing',
            style: 'Cyberpunk',
            title: 'Neon Drift',
            description: 'Race through neon-lit streets of a futuristic cyberpunk metropolis with customizable hoverbikes.',
            image: 'https://placehold.co/600x400/252525/31CCCC/png?text=Neon+Drift'
        },
        {
            type: 'RPG',
            style: 'Retro Synthwave',
            title: 'Synthwave Chronicles',
            description: 'Explore a retro-futuristic world filled with 80s aesthetics, synthwave music, and turn-based combat.',
            image: 'https://placehold.co/600x400/252525/FF56B1/png?text=Synthwave+Chronicles'
        },
        {
            type: 'Puzzle',
            style: 'Pixel Art',
            title: 'Pixel Logic',
            description: 'Solve increasingly challenging pixel-based puzzles in this retro-inspired brain teaser.',
            image: 'https://placehold.co/600x400/252525/56FF83/png?text=Pixel+Logic'
        },
        {
            type: 'Rhythm',
            style: 'Neon',
            title: 'Beat Surge',
            description: 'Match your moves to the beat in this neon-soaked rhythm game with customizable tracks.',
            image: 'https://placehold.co/600x400/252525/FFDD00/png?text=Beat+Surge'
        }
    ];
    
    // Select style button functionality
    styleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class for styles (only one can be active)
            styleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Select type button functionality
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class for types (only one can be active)
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Form submission - simulate AI game generation
    gameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get selected style and type
        const selectedStyle = document.querySelector('.style-btn.active')?.textContent || 'Cyberpunk';
        const selectedType = document.querySelector('.type-btn.active')?.textContent || 'Racing';
        const description = gameDescription.value.trim() || `A ${selectedStyle.toLowerCase()} ${selectedType.toLowerCase()} game`;
        
        // Show loading state
        initialState.classList.add('d-none');
        resultState.classList.add('d-none');
        loadingState.classList.remove('d-none');
        
        // Simulate AI processing time (2-3 seconds)
        setTimeout(() => {
            generateGame(description, selectedType, selectedStyle);
        }, 2000 + Math.random() * 1000);
    });
    
    // Simulate game generation based on input
    function generateGame(description, type, style) {
        // Find template that matches the selected type and style, or use the first one
        let template = gameTemplates.find(t => t.type === type && t.style === style) || 
                       gameTemplates.find(t => t.type === type) || 
                       gameTemplates.find(t => t.style === style) || 
                       gameTemplates[0];
        
        // Generate a title based on the description if not empty
        let title = template.title;
        if (description.length > 10) {
            // Extract key words for title generation (simplified)
            const words = description.split(' ');
            const keyWords = words.filter(word => word.length > 4 && !['game', 'with', 'that', 'this', 'have'].includes(word.toLowerCase()));
            
            if (keyWords.length > 0) {
                // Capitalize first letter of a random key word and add a thematic suffix
                const baseName = keyWords[Math.floor(Math.random() * keyWords.length)];
                const suffixes = ['Vibe', 'Pulse', 'Rush', 'Epic', 'Flux', 'Wave', 'Drift'];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                
                title = baseName.charAt(0).toUpperCase() + baseName.slice(1) + ' ' + suffix;
            }
        }
        
        // Update the preview with generated game
        gameImage.src = template.image;
        gameTitle.textContent = title;
        gameDescriptionResult.textContent = description;
        
        // Show result state
        loadingState.classList.add('d-none');
        resultState.classList.remove('d-none');
        
        // Simulate connection to Solana wallet
        simulateBlockchainTransaction();
    }
    
    // Play button functionality
    playBtn.addEventListener('click', function() {
        // Simulate game loading
        alert('Connecting to Solana blockchain to load game...');
    });
    
    // Share button functionality
    shareBtn.addEventListener('click', function() {
        alert('Game link copied! Share it with your friends to earn $EPIC tokens.');
    });
    
    // Simulate blockchain interaction
    function simulateBlockchainTransaction() {
        const txDisplay = document.createElement('div');
        txDisplay.className = 'alert alert-success mt-3';
        txDisplay.innerHTML = `<small>✅ Transaction confirmed on Solana blockchain<br>Hash: 5Kj8...9fGh</small>`;
        
        resultState.querySelector('.game-result').appendChild(txDisplay);
        
        // Remove after 5 seconds
        setTimeout(() => {
            txDisplay.remove();
        }, 5000);
    }
    
    // Community games interaction
    document.querySelectorAll('.game-item').forEach(item => {
        item.addEventListener('click', function() {
            alert('Loading community game...');
        });
    });
    
    // Token interaction buttons
    document.querySelector('.token-card .btn-outline-dark:nth-child(1)').addEventListener('click', function() {
        alert('Create or share games to earn more $EPIC tokens!');
    });
    
    document.querySelector('.token-card .btn-outline-dark:nth-child(2)').addEventListener('click', function() {
        alert('Stake your $EPIC tokens to earn passive rewards and voting power.');
    });
    
    document.querySelector('.token-card .btn-outline-dark:nth-child(3)').addEventListener('click', function() {
        alert('Use your $EPIC tokens to vote on platform features and updates.');
    });
}); 