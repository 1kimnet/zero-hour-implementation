export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private camera = { x: 0, y: 0, zoom: 1.0 };
    private initialized = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D rendering context');
        }
        this.ctx = context;
    }

    async initialize(): Promise<void> {
        // Set up rendering context
        this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        
        // Set default camera position
        this.camera.x = this.canvas.width / 2;
        this.camera.y = this.canvas.height / 2;
        
        this.initialized = true;
        console.log('Renderer initialized');
    }

    render(): void {
        if (!this.initialized) return;

        // Clear canvas
        this.clear();
        
        // Apply camera transformation
        this.ctx.save();
        this.applyCamera();
        
        // Render game world
        this.renderTerrain();
        this.renderEntities();
        this.renderUI();
        
        this.ctx.restore();
    }

    private clear(): void {
        this.ctx.fillStyle = '#001100'; // Dark green background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private applyCamera(): void {
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
    }

    private renderTerrain(): void {
        // Simple grid pattern for terrain
        this.ctx.strokeStyle = '#003300';
        this.ctx.lineWidth = 1;
        
        const gridSize = 64;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;
        const endX = startX + this.canvas.width / this.camera.zoom + gridSize;
        const endY = startY + this.canvas.height / this.camera.zoom + gridSize;
        
        // Draw vertical lines
        for (let x = startX; x < endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = startY; y < endY; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }

    private renderEntities(): void {
        // Placeholder: render some test entities
        this.ctx.fillStyle = '#00ff00';
        
        // Example unit at center
        const unitX = this.camera.x;
        const unitY = this.camera.y;
        const unitSize = 32;
        
        this.ctx.fillRect(
            unitX - unitSize / 2,
            unitY - unitSize / 2,
            unitSize,
            unitSize
        );
        
        // Unit health bar
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(unitX - 16, unitY - 24, 32, 4);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(unitX - 16, unitY - 24, 24, 4); // 75% health
    }

    private renderUI(): void {
        // Reset transformation for UI elements
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Minimap border
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.canvas.width - 210, 10, 200, 150);
        
        // FPS counter
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        this.ctx.fillText('FPS: 60', 10, this.canvas.height - 10);
        
        // Camera info
        this.ctx.fillText(
            `Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)} | Zoom: ${this.camera.zoom.toFixed(2)}`,
            10,
            this.canvas.height - 25
        );
    }

    // Camera controls
    public moveCamera(deltaX: number, deltaY: number): void {
        this.camera.x += deltaX;
        this.camera.y += deltaY;
    }

    public setZoom(zoom: number): void {
        this.camera.zoom = Math.max(0.1, Math.min(3.0, zoom));
    }

    public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        return {
            x: (screenX / this.camera.zoom) + this.camera.x,
            y: (screenY / this.camera.zoom) + this.camera.y
        };
    }

    public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: (worldX - this.camera.x) * this.camera.zoom,
            y: (worldY - this.camera.y) * this.camera.zoom
        };
    }

    public getCamera(): { x: number; y: number; zoom: number } {
        return { ...this.camera };
    }

    public setCamera(x: number, y: number, zoom?: number): void {
        this.camera.x = x;
        this.camera.y = y;
        if (zoom !== undefined) {
            this.camera.zoom = zoom;
        }
    }
}