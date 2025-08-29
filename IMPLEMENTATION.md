# Zero Hour Implementation - Draft Documentation

## Overview

This document outlines the implementation strategy for a web-based real-time strategy (RTS) game inspired by Command & Conquer: Generals Zero Hour. Based on research of similar projects including Thyme (C++ Zero Hour reimplementation), OpenFrontIO, and Esri's development patterns, this document provides a comprehensive foundation for modern RTS game development.

## Research Findings

### Key Reference Projects

1. **Thyme** - Open source C++ re-implementation of Command & Conquer: Generals Zero Hour
   - Modular architecture with CMake build system
   - Component-based design with separate subsystems
   - Cross-platform compatibility focus
   - Bottom-up rewrite approach using original binary for unimplemented functions

2. **OpenFrontIO** - Modern TypeScript browser-based RTS
   - Client/server/core separation
   - Real-time territorial control gameplay
   - Multi-licensing approach (MIT/GPL)
   - Webpack-based build system

3. **Esri dito.ts** - High-performance geometric library
   - Clean TypeScript implementation
   - Focus on mathematical precision
   - Minimal dependencies
   - Well-documented API design

## Project Architecture

### Directory Structure

```
zero-hour-implementation/
├── src/
│   ├── client/           # Frontend game client
│   ├── server/           # Backend game server
│   ├── core/             # Shared game logic
│   └── common/           # Shared utilities and types
├── resources/
│   ├── images/           # Sprites, textures, UI assets
│   ├── maps/             # Game maps and terrain data
│   ├── audio/            # Sound effects and music
│   └── data/             # Game configuration and data files
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                 # Documentation
├── scripts/              # Build and deployment scripts
└── tools/                # Development tools and utilities
```

### Technology Stack

**Core Technologies:**
- **TypeScript** - Type-safe development with modern ES features
- **WebGL/Canvas** - Hardware-accelerated 2D/3D rendering
- **WebSockets** - Real-time client-server communication
- **Node.js** - Server runtime environment

**Development Tools:**
- **Webpack** - Module bundling and asset processing
- **Jest** - Unit testing framework
- **ESLint/Prettier** - Code quality and formatting
- **Husky** - Git hooks for automated checks

**Libraries and Frameworks:**
- **Three.js** or **PIXI.js** - Graphics rendering engine
- **Socket.io** - WebSocket abstraction with fallbacks
- **Express.js** - Web server framework
- **Lodash** - Utility functions

## Core Systems Design

### 1. Game Loop Architecture

```typescript
interface GameLoop {
  readonly tickRate: number;
  readonly deltaTime: number;
  
  update(deltaTime: number): void;
  render(): void;
  start(): void;
  stop(): void;
}

class ClientGameLoop implements GameLoop {
  private lastTime = 0;
  private animationId: number | null = null;
  
  constructor(
    public readonly tickRate: number = 60,
    private readonly systems: System[]
  ) {}
  
  private loop = (currentTime: number): void => {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    this.animationId = requestAnimationFrame(this.loop);
  };
}
```

### 2. Entity-Component System

```typescript
interface Component {
  readonly type: string;
}

interface Entity {
  readonly id: string;
  readonly components: Map<string, Component>;
}

interface System {
  readonly requiredComponents: string[];
  update(entities: Entity[], deltaTime: number): void;
}

// Example: Movement System
class MovementSystem implements System {
  readonly requiredComponents = ['position', 'velocity'];
  
  update(entities: Entity[], deltaTime: number): void {
    entities.forEach(entity => {
      const position = entity.components.get('position') as PositionComponent;
      const velocity = entity.components.get('velocity') as VelocityComponent;
      
      position.x += velocity.x * deltaTime;
      position.y += velocity.y * deltaTime;
    });
  }
}
```

### 3. Network Architecture

```typescript
interface NetworkMessage {
  type: string;
  timestamp: number;
  playerId: string;
  data: any;
}

interface GameState {
  tick: number;
  entities: Entity[];
  players: Player[];
}

class NetworkManager {
  private socket: WebSocket;
  private messageQueue: NetworkMessage[] = [];
  
  sendCommand(command: GameCommand): void {
    const message: NetworkMessage = {
      type: 'command',
      timestamp: Date.now(),
      playerId: this.playerId,
      data: command
    };
    
    this.socket.send(JSON.stringify(message));
  }
  
  processMessages(): NetworkMessage[] {
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    return messages;
  }
}
```

### 4. Resource Management

```typescript
interface Resource {
  id: string;
  type: 'image' | 'audio' | 'data';
  url: string;
  loaded: boolean;
}

class ResourceManager {
  private resources = new Map<string, Resource>();
  private loadPromises = new Map<string, Promise<any>>();
  
  async loadResource(id: string, url: string, type: Resource['type']): Promise<any> {
    if (this.loadPromises.has(id)) {
      return this.loadPromises.get(id);
    }
    
    const promise = this.loadByType(url, type);
    this.loadPromises.set(id, promise);
    
    const data = await promise;
    this.resources.set(id, { id, type, url, loaded: true });
    
    return data;
  }
  
  private async loadByType(url: string, type: Resource['type']): Promise<any> {
    switch (type) {
      case 'image':
        return this.loadImage(url);
      case 'audio':
        return this.loadAudio(url);
      case 'data':
        return this.loadJSON(url);
    }
  }
}
```

## Development Workflow

### Build Configuration

**webpack.config.js:**
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  
  entry: {
    client: './src/client/index.ts',
    server: './src/server/index.ts'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: 'file-loader'
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      chunks: ['client']
    })
  ]
};
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Package Scripts

**package.json:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run start:client\" \"npm run start:server\"",
    "start:client": "webpack serve --config webpack.client.js",
    "start:server": "nodemon --exec ts-node src/server/index.ts",
    "build": "webpack --mode production",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts"
  }
}
```

## Game Systems Implementation

### 1. Input Handling

```typescript
class InputManager {
  private keys = new Map<string, boolean>();
  private mousePos = { x: 0, y: 0 };
  private mouseButtons = new Map<number, boolean>();
  
  constructor(private canvas: HTMLCanvasElement) {
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    document.addEventListener('keydown', (e) => {
      this.keys.set(e.code, true);
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
    });
  }
  
  isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }
  
  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePos };
  }
}
```

### 2. Rendering System

```typescript
interface Renderer {
  initialize(canvas: HTMLCanvasElement): void;
  clear(): void;
  render(entities: Entity[]): void;
  setCamera(camera: Camera): void;
}

class WebGLRenderer implements Renderer {
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram;
  private camera: Camera;
  
  initialize(canvas: HTMLCanvasElement): void {
    this.gl = canvas.getContext('webgl')!;
    this.setupShaders();
    this.setupBuffers();
  }
  
  render(entities: Entity[]): void {
    this.clear();
    
    entities.forEach(entity => {
      const position = entity.components.get('position') as PositionComponent;
      const sprite = entity.components.get('sprite') as SpriteComponent;
      
      if (position && sprite) {
        this.renderSprite(sprite, position);
      }
    });
  }
  
  private renderSprite(sprite: SpriteComponent, position: PositionComponent): void {
    // WebGL rendering implementation
  }
}
```

### 3. Game State Management

```typescript
interface GameState {
  tick: number;
  entities: Map<string, Entity>;
  players: Map<string, Player>;
  gameMode: GameMode;
  status: 'waiting' | 'playing' | 'paused' | 'ended';
}

class GameStateManager {
  private state: GameState;
  private history: GameState[] = [];
  private maxHistory = 1000;
  
  updateState(delta: Partial<GameState>): void {
    // Store current state in history
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    this.history.push(this.cloneState(this.state));
    
    // Apply changes
    this.state = { ...this.state, ...delta };
  }
  
  rollback(ticks: number): void {
    if (ticks <= this.history.length) {
      this.state = this.history[this.history.length - ticks];
      this.history = this.history.slice(0, this.history.length - ticks);
    }
  }
  
  private cloneState(state: GameState): GameState {
    return JSON.parse(JSON.stringify(state));
  }
}
```

## Testing Strategy

### Unit Tests Example

```typescript
// tests/unit/MovementSystem.test.ts
import { MovementSystem } from '../../src/core/systems/MovementSystem';
import { Entity } from '../../src/core/Entity';
import { PositionComponent, VelocityComponent } from '../../src/core/components';

describe('MovementSystem', () => {
  let movementSystem: MovementSystem;
  let entity: Entity;
  
  beforeEach(() => {
    movementSystem = new MovementSystem();
    entity = {
      id: 'test-entity',
      components: new Map([
        ['position', new PositionComponent(0, 0)],
        ['velocity', new VelocityComponent(10, 5)]
      ])
    };
  });
  
  it('should update entity position based on velocity', () => {
    const deltaTime = 1.0;
    movementSystem.update([entity], deltaTime);
    
    const position = entity.components.get('position') as PositionComponent;
    expect(position.x).toBe(10);
    expect(position.y).toBe(5);
  });
});
```

### Integration Tests

```typescript
// tests/integration/GameLoop.test.ts
import { GameLoop } from '../../src/client/GameLoop';
import { MockRenderer } from '../mocks/MockRenderer';

describe('GameLoop Integration', () => {
  it('should initialize and run game systems', async () => {
    const renderer = new MockRenderer();
    const gameLoop = new GameLoop([renderer]);
    
    gameLoop.start();
    
    // Wait for a few frames
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(renderer.renderCalls).toBeGreaterThan(0);
    
    gameLoop.stop();
  });
});
```

## Deployment and Production

### Docker Configuration

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD Pipeline

**.github/workflows/ci.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
```

## Performance Considerations

### Optimization Strategies

1. **Entity Culling**: Only update/render entities within viewport
2. **Object Pooling**: Reuse objects to reduce garbage collection
3. **Spatial Partitioning**: Use quadtrees for efficient collision detection
4. **Network Optimization**: Delta compression for state synchronization
5. **Asset Optimization**: Texture atlasing and audio compression

### Example Object Pool

```typescript
class ObjectPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  
  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize = 10
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.factory());
    }
  }
  
  acquire(): T {
    let obj = this.available.pop();
    if (!obj) {
      obj = this.factory();
    }
    
    this.inUse.add(obj);
    return obj;
  }
  
  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.reset(obj);
      this.available.push(obj);
    }
  }
}
```

## Security Considerations

### Input Validation

```typescript
interface Command {
  type: string;
  data: any;
}

class CommandValidator {
  private static readonly VALID_COMMANDS = new Set([
    'move', 'attack', 'build', 'select'
  ]);
  
  static validate(command: Command): boolean {
    if (!this.VALID_COMMANDS.has(command.type)) {
      return false;
    }
    
    // Command-specific validation
    switch (command.type) {
      case 'move':
        return this.validateMoveCommand(command.data);
      case 'attack':
        return this.validateAttackCommand(command.data);
      default:
        return false;
    }
  }
  
  private static validateMoveCommand(data: any): boolean {
    return typeof data.x === 'number' && 
           typeof data.y === 'number' &&
           data.x >= 0 && data.x <= MAP_WIDTH &&
           data.y >= 0 && data.y <= MAP_HEIGHT;
  }
}
```

## Conclusion

This implementation document provides a comprehensive foundation for developing a modern web-based RTS game inspired by Command & Conquer: Generals Zero Hour. The architecture emphasizes:

- **Modularity**: Clean separation between client, server, and shared code
- **Type Safety**: TypeScript for reliable development
- **Performance**: Optimized rendering and network systems
- **Maintainability**: Well-structured codebase with comprehensive testing
- **Scalability**: Designed to handle multiple players and complex game states

The patterns and approaches outlined here are based on successful implementations from projects like Thyme, OpenFrontIO, and Esri's development practices, ensuring a solid foundation for building a robust RTS game.

## Next Steps

1. Set up the basic project structure and build system
2. Implement core game loop and entity system
3. Create basic rendering pipeline
4. Add network communication layer
5. Develop unit tests for core systems
6. Create initial game assets and UI
7. Implement basic gameplay mechanics
8. Add multiplayer functionality
9. Optimize performance and add advanced features
10. Deploy to production environment