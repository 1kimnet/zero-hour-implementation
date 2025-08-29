import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';

export class GameServer {
    private app: express.Application;
    private server: any;
    private io: SocketIOServer;
    private players = new Map<string, any>();
    private gameState: any = {
        tick: 0,
        entities: new Map(),
        players: new Map(),
        status: 'waiting'
    };

    constructor(private port: number = 3001) {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.setupExpress();
        this.setupSocketIO();
    }

    private setupExpress(): void {
        // Serve static files
        this.app.use(express.static(path.join(__dirname, '../../dist/client')));
        
        // API endpoints
        this.app.get('/api/status', (req, res) => {
            res.json({
                status: 'running',
                players: this.players.size,
                gameState: this.gameState.status
            });
        });

        // Serve main page
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
        });
    }

    private setupSocketIO(): void {
        this.io.on('connection', (socket) => {
            console.log(`Player connected: ${socket.id}`);

            // Handle player joining
            socket.on('join', (playerData) => {
                this.handlePlayerJoin(socket, playerData);
            });

            // Handle game commands
            socket.on('command', (command) => {
                this.handleGameCommand(socket, command);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                this.handlePlayerLeave(socket);
            });
        });
    }

    private handlePlayerJoin(socket: any, playerData: any): void {
        const player = {
            id: socket.id,
            name: playerData.name || `Player_${socket.id.slice(0, 6)}`,
            faction: playerData.faction || 'GLA',
            resources: {
                credits: 1000,
                power: 0,
                powerCapacity: 100
            },
            isActive: true,
            color: this.getRandomColor()
        };

        this.players.set(socket.id, player);
        this.gameState.players.set(socket.id, player);

        // Send current game state to new player
        socket.emit('gameState', this.gameState);

        // Notify other players
        socket.broadcast.emit('playerJoin', { player });

        console.log(`Player ${player.name} joined the game`);
    }

    private handleGameCommand(socket: any, command: any): void {
        const player = this.players.get(socket.id);
        if (!player) return;

        console.log(`Command from ${player.name}:`, command);

        // Validate and process command
        switch (command.type) {
            case 'move':
                this.handleMoveCommand(player, command);
                break;
            case 'attack':
                this.handleAttackCommand(player, command);
                break;
            case 'build':
                this.handleBuildCommand(player, command);
                break;
            case 'select':
                this.handleSelectCommand(player, command);
                break;
            default:
                console.log(`Unknown command type: ${command.type}`);
        }

        // Broadcast game state update
        this.broadcastGameState();
    }

    private handleMoveCommand(player: any, command: any): void {
        // Implement move logic here
        console.log(`${player.name} moving units to ${command.data.targetX}, ${command.data.targetY}`);
    }

    private handleAttackCommand(player: any, command: any): void {
        // Implement attack logic here
        console.log(`${player.name} attacking ${command.data.targetId}`);
    }

    private handleBuildCommand(player: any, command: any): void {
        // Implement building logic here
        console.log(`${player.name} building ${command.data.buildingType} at ${command.data.x}, ${command.data.y}`);
    }

    private handleSelectCommand(player: any, command: any): void {
        // Implement selection logic here
        console.log(`${player.name} selecting at ${command.data.x}, ${command.data.y}`);
    }

    private handlePlayerLeave(socket: any): void {
        const player = this.players.get(socket.id);
        if (player) {
            this.players.delete(socket.id);
            this.gameState.players.delete(socket.id);

            // Notify other players
            socket.broadcast.emit('playerLeave', { playerId: socket.id });

            console.log(`Player ${player.name} left the game`);
        }
    }

    private broadcastGameState(): void {
        this.gameState.tick++;
        this.io.emit('gameState', this.gameState);
    }

    private getRandomColor(): string {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Game server running on port ${this.port}`);
            console.log(`HTTP: http://localhost:${this.port}`);
            console.log(`WebSocket: ws://localhost:${this.port}`);
        });

        // Start game loop
        this.startGameLoop();
    }

    private startGameLoop(): void {
        const TICK_RATE = 60; // 60 FPS
        const TICK_INTERVAL = 1000 / TICK_RATE;

        setInterval(() => {
            this.updateGame();
        }, TICK_INTERVAL);
    }

    private updateGame(): void {
        // Update game systems
        this.gameState.tick++;

        // Only broadcast state periodically to reduce network traffic
        if (this.gameState.tick % 30 === 0) { // Every 0.5 seconds at 60fps
            this.broadcastGameState();
        }
    }
}

// Start server if this file is run directly
if (require.main === module) {
    const server = new GameServer();
    server.start();
}