/**
 * Cosmic Nebula Theme - VS Code Extension Entry Point
 * Greets users when activating the theme extension
 */

const vscode = require('vscode');

/**
 * Called when the extension is activated
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    console.log('🌌 Cosmic Nebula Theme extension is now active!');
    
    // Register command to show welcome message manually
    const welcomeCommand = vscode.commands.registerCommand('cosmic-nebula.showWelcome', () => {
        showWelcomeMessage();
    });
    
    context.subscriptions.push(welcomeCommand);
    
    // Check if this is the first time the extension is activated (installation)
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    
    if (!hasShownWelcome) {
        // Mark that we've shown the welcome message
        await context.globalState.update('hasShownWelcome', true);
        
        // Automatically show welcome message on first installation
        showWelcomeMessage();
    }
}

/**
 * Shows the welcome message in a webview panel
 */
function showWelcomeMessage() {
    const panel = vscode.window.createWebviewPanel(
        'cosmicNebulaWelcome',
        '🌌 Cosmic Nebula Theme',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    
    panel.webview.html = getWelcomeHtml();
    
    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'activateTheme':
                    vscode.commands.executeCommand('workbench.action.selectTheme');
                    break;
                case 'openSettings':
                    vscode.commands.executeCommand('workbench.action.openSettings', 'workbench.colorTheme');
                    break;
            }
        }
    );
}

/**
 * Generates the HTML content for the welcome webview
 */
function getWelcomeHtml() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cosmic Nebula Theme</title>
        <style>
            body {
                background: linear-gradient(135deg, #1a0b2e 0%, #160928 50%, #0f061e 100%);
                color: #f8f8ff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                overflow-x: hidden;
                position: relative;
            }
            
            /* Animated background stars */
            .stars {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            
            .star {
                position: absolute;
                width: 2px;
                height: 2px;
                background: #f8f8ff;
                border-radius: 50%;
                animation: twinkle 3s infinite;
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
                position: relative;
                z-index: 1;
            }
            
            .cosmic-title {
                font-size: 3em;
                font-weight: bold;
                background: linear-gradient(45deg, #a663cc, #5e60ce, #4c956c);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 20px;
                animation: glow 2s ease-in-out infinite alternate;
                text-shadow: 0 0 20px rgba(114, 9, 183, 0.5);
            }
            
            @keyframes glow {
                from { filter: drop-shadow(0 0 5px #7209b7); }
                to { filter: drop-shadow(0 0 20px #7209b7); }
            }
            
            .welcome-box {
                background: rgba(22, 9, 40, 0.8);
                border: 2px solid #7209b7;
                border-radius: 15px;
                padding: 30px;
                margin: 20px 0;
                box-shadow: 
                    0 0 30px rgba(114, 9, 183, 0.3),
                    inset 0 0 20px rgba(114, 9, 183, 0.1);
                backdrop-filter: blur(10px);
            }
            
            .feature-list {
                text-align: left;
                margin: 20px 0;
            }
            
            .feature-item {
                margin: 10px 0;
                padding: 15px;
                background: rgba(76, 149, 108, 0.1);
                border-left: 3px solid #4c956c;
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            
            .feature-item:hover {
                background: rgba(76, 149, 108, 0.2);
                transform: translateX(5px);
            }
            
            .button {
                background: linear-gradient(45deg, #7209b7, #a663cc);
                border: none;
                color: #f8f8ff;
                padding: 15px 30px;
                margin: 10px;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                position: relative;
                overflow: hidden;
            }
            
            .button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            
            .button:hover::before {
                left: 100%;
            }
            
            .button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(114, 9, 183, 0.4);
            }
            
            .button-secondary {
                background: linear-gradient(45deg, #5e60ce, #4c956c);
            }
            
            .theme-preview {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                flex-wrap: wrap;
            }
            
            .theme-card {
                background: rgba(15, 6, 30, 0.8);
                border: 1px solid #7209b7;
                border-radius: 15px;
                padding: 20px;
                margin: 10px;
                flex: 1;
                min-width: 250px;
                max-width: 350px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .theme-card::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, #7209b7 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: -1;
            }
            
            .theme-card:hover::before {
                opacity: 0.1;
            }
            
            .theme-card:hover {
                transform: translateY(-5px);
                border-color: #a663cc;
                box-shadow: 0 15px 30px rgba(114, 9, 183, 0.3);
            }
            
            .theme-name {
                color: #a663cc;
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .ascii-art {
                font-family: 'Courier New', monospace;
                font-size: 0.5em;
                color: #a663cc;
                white-space: pre;
                margin: 20px 0;
                text-shadow: 0 0 10px #7209b7;
                line-height: 1.2;
            }
            
            .instructions {
                background: rgba(94, 96, 206, 0.1);
                border: 1px solid #5e60ce;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }
            
            .step {
                margin: 10px 0;
                padding: 5px 0;
            }
            
            .step-number {
                color: #d94d9a;
                font-weight: bold;
            }
            
            .subtitle {
                color: #d1cdd9;
                font-size: 1.1em;
                margin-bottom: 20px;
            }
            
            .emoji {
                font-size: 1.5em;
                margin: 0 5px;
            }
        </style>
    </head>
    <body>
        <!-- Animated background stars -->
        <div class="stars" id="stars"></div>
        
        <div class="container">
            <div class="cosmic-title">COSMIC NEBULA</div>
            
            <div class="ascii-art">
    ░█████╗░░█████╗░░██████╗███╗░░░███╗██╗░█████╗░
    ██╔══██╗██╔══██╗██╔════╝████╗░████║██║██╔══██╗
    ██║░░╚═╝██║░░██║╚█████╗░██╔████╔██║██║██║░░╚═╝
    ██║░░██╗██║░░██║░╚═══██╗██║╚██╔╝██║██║██║░░██╗
    ╚█████╔╝╚█████╔╝██████╔╝██║░╚═╝░██║██║╚█████╔╝
    ░╚════╝░░╚════╝░╚═════╝░╚═╝░░░░░╚═╝╚═╝░╚════╝░
    
    ███╗░░██╗███████╗██████╗░██╗░░░██╗██╗░░░░░░█████╗░
    ████╗░██║██╔════╝██╔══██╗██║░░░██║██║░░░░░██╔══██╗
    ██╔██╗██║█████╗░░██████╦╝██║░░░██║██║░░░░░███████║
    ██║╚████║██╔══╝░░██╔══██╗██║░░░██║██║░░░░░██╔══██║
    ██║░╚███║███████╗██████╦╝╚██████╔╝███████╗██║░░██║
    ╚═╝░░╚══╝╚══════╝╚═════╝░░╚═════╝░╚══════╝╚═╝░░╚═╝
            </div>
            
            <div class="welcome-box">
                <h2><span class="emoji">🌌</span>WELCOME TO THE COSMIC REALM<span class="emoji">🌌</span></h2>
                <p class="subtitle">Thank you for installing the <strong>Cosmic Nebula Theme</strong>!</p>
                <p><span class="emoji">🚀</span>You've just entered a deep space coding environment where purple nebulae meet alien flora.</p>
            </div>
            
            <div class="theme-preview">
                <div class="theme-card">
                    <div class="theme-name">🌌 Cosmic Nebula</div>
                    <p>Full intensity cosmic experience with deep purple backgrounds and vibrant alien flora accents.</p>
                </div>
                <div class="theme-card">
                    <div class="theme-name">✨ Cosmic Nebula Soft</div>
                    <p>Softer variant perfect for extended coding sessions with muted cosmic colors.</p>
                </div>
            </div>
            
            <div class="feature-list">
                <div class="feature-item">🌌 Deep space purple nebula backgrounds</div>
                <div class="feature-item">🌿 Alien flora green accents for strings and success states</div>
                <div class="feature-item">⭐ Stellar blue highlights for functions and information</div>
                <div class="feature-item">💫 Nebula pink glow for constants and errors</div>
                <div class="feature-item">👁️ Eye-friendly design for long coding sessions</div>
                <div class="feature-item">🎨 Two cosmic variants to choose from</div>
                <div class="feature-item">🔧 Full semantic highlighting support</div>
            </div>
            
            <div class="instructions">
                <h3>🎯 How to activate your cosmic theme:</h3>
                <div class="step"><span class="step-number">1.</span> Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)</div>
                <div class="step"><span class="step-number">2.</span> Type "Preferences: Color Theme"</div>
                <div class="step"><span class="step-number">3.</span> Select "Cosmic Nebula" or "Cosmic Nebula Soft"</div>
            </div>
            
            <div style="margin: 30px 0;">
                <button class="button" onclick="activateTheme()">🎨 Choose Theme</button>
                <button class="button button-secondary" onclick="openSettings()">⚙️ Open Settings</button>
            </div>
            
            <p style="margin-top: 40px; color: #a663cc;">
                <span class="emoji">🌟</span>Happy coding in the cosmic nebula!<span class="emoji">🌟</span>
            </p>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            // Generate animated stars
            function createStars() {
                const starsContainer = document.getElementById('stars');
                const numberOfStars = 100;
                
                for (let i = 0; i < numberOfStars; i++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    star.style.left = Math.random() * 100 + '%';
                    star.style.top = Math.random() * 100 + '%';
                    star.style.animationDelay = Math.random() * 3 + 's';
                    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    starsContainer.appendChild(star);
                }
            }
            
            function activateTheme() {
                vscode.postMessage({
                    command: 'activateTheme'
                });
            }
            
            function openSettings() {
                vscode.postMessage({
                    command: 'openSettings'
                });
            }
            
            // Initialize stars when page loads
            createStars();
        </script>
    </body>
    </html>
    `;
}

/**
 * Called when the extension is deactivated
 */
function deactivate() {
    console.log('🌌 Cosmic Nebula Theme extension deactivated');
}

module.exports = {
    activate,
    deactivate
};
