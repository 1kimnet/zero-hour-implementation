import { io, Socket } from 'socket.io-client';
import { GameCommand, NetworkMessage } from '../common/Types';

export class NetworkManager {
    private socket: Socket | null = null;
    public playerId: string = '';
    private messageHandlers = new Map<string, Array<(data: any) => void>>();
    private messageQueue: NetworkMessage[] = [];
    private connected = false;

    async connect(serverUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = io(serverUrl);

            this.socket.on('connect', () => {
                this.connected = true;
                this.playerId = this.socket!.id;
                console.log(`Connected to server with ID: ${this.playerId}`);
                
                // Join the game
                this.socket!.emit('join', {
                    name: `Player_${this.playerId.slice(0, 6)}`,
                    faction: 'GLA'
                });
                
                resolve();
            });

            this.socket.on('disconnect', () => {
                this.connected = false;
                console.log('Disconnected from server');
            });

            this.socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                reject(error);
            });

            // Handle all incoming messages
            this.socket.onAny((event, data) => {
                this.handleMessage(event, data);
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                if (!this.connected) {
                    reject(new Error('Connection timeout'));
                }
            }, 5000);
        });
    }

    private handleMessage(type: string, data: any): void {
        const message: NetworkMessage = {
            type,
            timestamp: Date.now(),
            data
        };

        // Add to message queue for processing
        this.messageQueue.push(message);

        // Call registered handlers immediately
        const handlers = this.messageHandlers.get(type);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    public onMessage(type: string, handler: (data: any) => void): void {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type)!.push(handler);
    }

    public sendCommand(command: GameCommand): void {
        if (!this.socket || !this.connected) {
            console.warn('Cannot send command: not connected to server');
            return;
        }

        this.socket.emit('command', command);
    }

    public sendMessage(type: string, data: any): void {
        if (!this.socket || !this.connected) {
            console.warn('Cannot send message: not connected to server');
            return;
        }

        this.socket.emit(type, data);
    }

    public processMessages(): NetworkMessage[] {
        const messages = [...this.messageQueue];
        this.messageQueue = [];
        return messages;
    }

    public isConnected(): boolean {
        return this.connected;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.playerId = '';
        }
    }

    // Utility methods for common commands
    public sendMoveCommand(entityIds: string[], targetX: number, targetY: number): void {
        this.sendCommand({
            type: 'move',
            playerId: this.playerId,
            timestamp: Date.now(),
            data: { entityIds, targetX, targetY }
        });
    }

    public sendAttackCommand(attackerId: string, targetId: string): void {
        this.sendCommand({
            type: 'attack',
            playerId: this.playerId,
            timestamp: Date.now(),
            data: { attackerId, targetId }
        });
    }

    public sendBuildCommand(buildingType: string, x: number, y: number): void {
        this.sendCommand({
            type: 'build',
            playerId: this.playerId,
            timestamp: Date.now(),
            data: { buildingType, x, y }
        });
    }

    public sendSelectCommand(x: number, y: number): void {
        this.sendCommand({
            type: 'select',
            playerId: this.playerId,
            timestamp: Date.now(),
            data: { x, y }
        });
    }
}