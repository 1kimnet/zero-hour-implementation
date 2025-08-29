import { Entity } from '../core/Entity';
import { SystemManager } from '../core/Systems';
import { GameState, Player } from '../common/Types';

export class GameClient {
    private gameLoop: GameLoop;
    private lastTime = 0;
    private isRunning = false;

    constructor(
        private inputManager: any,
        private renderer: any,
        private networkManager: any
    ) {
        this.gameLoop = new GameLoop();
    }

    async initialize(): Promise<void> {
        console.log('Initializing game client...');
        
        // Initialize renderer
        await this.renderer.initialize();
        
        // Setup input handling
        this.setupInputHandlers();
        
        // Setup network message handling
        this.setupNetworkHandlers();
        
        console.log('Game client initialized');
    }

    start(): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop.start(this.update.bind(this));
        
        console.log('Game client started');
    }

    stop(): void {
        this.isRunning = false;
        this.gameLoop.stop();
        console.log('Game client stopped');
    }

    private update = (currentTime: number): void => {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Process input
        this.inputManager.update();
        
        // Process network messages
        this.networkManager.processMessages();
        
        // Update game systems (if we have game state)
        // this.systemManager.update(this.entityManager, deltaTime);
        
        // Render
        this.renderer.render();
        
        // Update UI
        this.updateUI();
    };

    private setupInputHandlers(): void {
        // Handle mouse clicks for unit selection
        this.inputManager.onMouseClick((x: number, y: number, button: number) => {
            if (button === 0) { // Left click
                this.handleUnitSelection(x, y);
            } else if (button === 2) { // Right click
                this.handleUnitCommand(x, y);
            }
        });

        // Handle keyboard shortcuts
        this.inputManager.onKeyPress((key: string) => {
            switch (key) {
                case 'Escape':
                    this.clearSelection();
                    break;
                case 'Space':
                    this.togglePause();
                    break;
            }
        });
    }

    private setupNetworkHandlers(): void {
        this.networkManager.onMessage('gameState', (data: GameState) => {
            this.handleGameStateUpdate(data);
        });

        this.networkManager.onMessage('playerJoin', (data: { player: Player }) => {
            console.log(`Player ${data.player.name} joined the game`);
        });

        this.networkManager.onMessage('playerLeave', (data: { playerId: string }) => {
            console.log(`Player ${data.playerId} left the game`);
        });
    }

    private handleUnitSelection(x: number, y: number): void {
        // Convert screen coordinates to world coordinates
        const worldPos = this.renderer.screenToWorld(x, y);
        
        // Send selection command to server
        this.networkManager.sendCommand({
            type: 'select',
            playerId: this.networkManager.playerId,
            timestamp: Date.now(),
            data: { x: worldPos.x, y: worldPos.y }
        });
    }

    private handleUnitCommand(x: number, y: number): void {
        const worldPos = this.renderer.screenToWorld(x, y);
        
        // Send move command for selected units
        this.networkManager.sendCommand({
            type: 'move',
            playerId: this.networkManager.playerId,
            timestamp: Date.now(),
            data: { targetX: worldPos.x, targetY: worldPos.y }
        });
    }

    private handleGameStateUpdate(gameState: GameState): void {
        // Update local game state
        // this.entityManager.updateFromState(gameState);
        console.log(`Game state updated - tick: ${gameState.tick}`);
    }

    private clearSelection(): void {
        this.networkManager.sendCommand({
            type: 'clearSelection',
            playerId: this.networkManager.playerId,
            timestamp: Date.now(),
            data: {}
        });
    }

    private togglePause(): void {
        this.networkManager.sendCommand({
            type: 'togglePause',
            playerId: this.networkManager.playerId,
            timestamp: Date.now(),
            data: {}
        });
    }

    private updateUI(): void {
        // Update resource display
        const creditsElement = document.getElementById('credits');
        const powerElement = document.getElementById('power');
        
        if (creditsElement && powerElement) {
            // These would come from actual game state
            creditsElement.textContent = '1000';
            powerElement.textContent = '100/100';
        }
    }
}

class GameLoop {
    private animationId: number | null = null;
    private updateCallback: ((time: number) => void) | null = null;

    start(callback: (time: number) => void): void {
        this.updateCallback = callback;
        this.loop();
    }

    stop(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.updateCallback = null;
    }

    private loop = (): void => {
        if (this.updateCallback) {
            this.updateCallback(performance.now());
        }
        
        if (this.updateCallback) {
            this.animationId = requestAnimationFrame(this.loop);
        }
    };
}