export interface GameState {
    tick: number;
    entities: Map<string, any>;
    players: Map<string, Player>;
    gameMode: GameMode;
    status: GameStatus;
    mapData: MapData;
}

export interface Player {
    id: string;
    name: string;
    faction: string;
    resources: Resources;
    isActive: boolean;
    color: string;
}

export interface Resources {
    credits: number;
    power: number;
    powerCapacity: number;
}

export interface MapData {
    width: number;
    height: number;
    terrain: TerrainTile[][];
    startPositions: { x: number; y: number }[];
}

export interface TerrainTile {
    type: 'grass' | 'water' | 'rock' | 'sand';
    buildable: boolean;
    passable: boolean;
}

export type GameMode = 'skirmish' | 'multiplayer' | 'campaign';
export type GameStatus = 'waiting' | 'playing' | 'paused' | 'ended';

// Game commands that can be sent over the network
export interface GameCommand {
    type: string;
    playerId: string;
    timestamp: number;
    data: any;
}

export interface MoveCommand extends GameCommand {
    type: 'move';
    data: {
        entityIds: string[];
        targetX: number;
        targetY: number;
    };
}

export interface AttackCommand extends GameCommand {
    type: 'attack';
    data: {
        attackerId: string;
        targetId: string;
    };
}

export interface BuildCommand extends GameCommand {
    type: 'build';
    data: {
        buildingType: string;
        x: number;
        y: number;
    };
}

// Network message types
export interface NetworkMessage {
    type: string;
    timestamp: number;
    data: any;
}

export interface GameStateMessage extends NetworkMessage {
    type: 'gameState';
    data: GameState;
}

export interface CommandMessage extends NetworkMessage {
    type: 'command';
    data: GameCommand;
}

export interface PlayerJoinMessage extends NetworkMessage {
    type: 'playerJoin';
    data: {
        player: Player;
    };
}

export interface PlayerLeaveMessage extends NetworkMessage {
    type: 'playerLeave';
    data: {
        playerId: string;
    };
}

// Game configuration
export interface GameConfig {
    tickRate: number;
    maxPlayers: number;
    mapSize: { width: number; height: number };
    startingResources: Resources;
    unitLimits: { [unitType: string]: number };
}

// Default game configuration
export const DEFAULT_GAME_CONFIG: GameConfig = {
    tickRate: 60,
    maxPlayers: 8,
    mapSize: { width: 1000, height: 1000 },
    startingResources: {
        credits: 1000,
        power: 0,
        powerCapacity: 100
    },
    unitLimits: {
        infantry: 100,
        vehicles: 50,
        aircraft: 20
    }
};

// Game events for decoupled communication
export interface GameEvent {
    type: string;
    timestamp: number;
    data: any;
}

export interface UnitDestroyedEvent extends GameEvent {
    type: 'unitDestroyed';
    data: {
        entityId: string;
        playerId: string;
        unitType: string;
    };
}

export interface ResourceChangedEvent extends GameEvent {
    type: 'resourceChanged';
    data: {
        playerId: string;
        resourceType: keyof Resources;
        oldValue: number;
        newValue: number;
    };
}

// Vector math utilities
export interface Vector2 {
    x: number;
    y: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export class Vector2Utils {
    static distance(a: Vector2, b: Vector2): number {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    static normalize(v: Vector2): Vector2 {
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
        if (length === 0) return { x: 0, y: 0 };
        return { x: v.x / length, y: v.y / length };
    }
    
    static add(a: Vector2, b: Vector2): Vector2 {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    
    static subtract(a: Vector2, b: Vector2): Vector2 {
        return { x: a.x - b.x, y: a.y - b.y };
    }
    
    static multiply(v: Vector2, scalar: number): Vector2 {
        return { x: v.x * scalar, y: v.y * scalar };
    }
}