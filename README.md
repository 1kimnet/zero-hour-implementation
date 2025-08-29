# Zero Hour Implementation

A modern web-based real-time strategy (RTS) game inspired by Command & Conquer: Generals Zero Hour. Built with TypeScript, WebGL/Canvas, and WebSockets for real-time multiplayer gameplay.

## 🎮 About

This project is a browser-based RTS game that captures the essence of classic Command & Conquer: Generals Zero Hour gameplay while leveraging modern web technologies. The implementation focuses on:

- **Real-time multiplayer gameplay** with client-server architecture
- **Modular entity-component system** for flexible game logic
- **WebGL/Canvas rendering** for smooth graphics performance
- **TypeScript** for type-safe development
- **Responsive design** that works across different screen sizes

## 🏗️ Architecture

The project follows a clean separation of concerns:

```
src/
├── client/           # Frontend game client
│   ├── GameClient.ts    # Main game client controller
│   ├── InputManager.ts  # Input handling
│   ├── Renderer.ts      # Graphics rendering
│   └── NetworkManager.ts # Client-server communication
├── server/           # Backend game server
│   └── index.ts         # Game server with Socket.IO
├── core/             # Shared game logic
│   ├── Entity.ts        # Entity-component system
│   └── Systems.ts       # Game systems (movement, collision, etc.)
└── common/           # Shared types and utilities
    └── Types.ts         # Common interfaces and types
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/1kimnet/zero-hour-implementation.git
   cd zero-hour-implementation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both the client and server:
   - Client: http://localhost:8080 (webpack dev server)
   - Server: http://localhost:3001 (game server)

4. **Open the game**
   Navigate to http://localhost:8080 in your browser

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Key Features Implemented

- ✅ Basic game client/server architecture
- ✅ Real-time networking with Socket.IO
- ✅ Entity-component system
- ✅ Input handling (mouse/keyboard)
- ✅ Basic 2D rendering with Canvas
- ✅ Camera system with zoom/pan
- ✅ TypeScript throughout
- ✅ Development build system

### Planned Features

- 🔄 Unit movement and pathfinding
- 🔄 Resource management system
- 🔄 Building construction
- 🔄 Combat system
- 🔄 Multiple factions (USA, China, GLA)
- 🔄 Map editor
- 🔄 Audio system
- 🔄 Advanced graphics (WebGL)

## 🎯 Game Controls

- **Left Click**: Select units
- **Right Click**: Move units / Issue commands
- **WASD**: Pan camera
- **Mouse Wheel**: Zoom in/out
- **Escape**: Clear selection
- **Space**: Toggle pause

## 🔧 Configuration

The game uses several configuration files:

- `tsconfig.json` - TypeScript configuration
- `webpack.config.js` - Build configuration  
- `package.json` - Dependencies and scripts
- `.eslintrc.js` - Code linting rules

## 🧪 Testing

Run tests with:

```bash
npm test
```

The project includes:
- Unit tests for core game systems
- Integration tests for client-server communication
- End-to-end tests for gameplay scenarios

## 📚 Documentation

Comprehensive implementation documentation can be found in [IMPLEMENTATION.md](./IMPLEMENTATION.md), which includes:

- Detailed architecture explanations
- Code examples and patterns
- Performance optimization strategies
- Security considerations
- Deployment guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This implementation was inspired by research of several excellent projects:

- **[Thyme](https://github.com/TheAssemblyArmada/Thyme)** - Open source C++ re-implementation of Generals: Zero Hour
- **[OpenFrontIO](https://github.com/openfrontio/OpenFrontIO)** - Modern browser-based RTS game
- **[Esri dito.ts](https://github.com/Esri/dito.ts)** - High-performance geometric algorithms library

## 🎮 Community

- Join our [Discord](https://discord.gg/example) for discussions
- Check out our [Wiki](https://github.com/1kimnet/zero-hour-implementation/wiki) for guides
- Follow development updates on [Twitter](https://twitter.com/example)

---

**Command & Conquer: Generals Zero Hour** is a trademark of Electronic Arts Inc. This project is not affiliated with or endorsed by EA.