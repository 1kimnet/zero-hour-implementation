// Client entry point for Zero Hour Implementation
import { GameClient } from './GameClient';
import { InputManager } from './InputManager';
import { Renderer } from './Renderer';
import { NetworkManager } from './NetworkManager';

class Application {
    private gameClient: GameClient;
    private canvas: HTMLCanvasElement;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.setupCanvas();
        this.initializeGame();
    }

    private setupCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    private async initializeGame(): Promise<void> {
        try {
            // Show loading message
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'block';

            // Initialize game systems
            const inputManager = new InputManager(this.canvas);
            const renderer = new Renderer(this.canvas);
            const networkManager = new NetworkManager();

            // Initialize game client
            this.gameClient = new GameClient(inputManager, renderer, networkManager);
            
            // Connect to server
            await networkManager.connect('ws://localhost:3001');
            
            // Start game loop
            await this.gameClient.initialize();
            this.gameClient.start();

            // Hide loading message
            if (loading) loading.style.display = 'none';

            console.log('Zero Hour Implementation initialized successfully');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError(error);
        }
    }

    private showError(error: any): void {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div style="color: #ff0000;">
                    Error: Failed to initialize game<br>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Application();
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});