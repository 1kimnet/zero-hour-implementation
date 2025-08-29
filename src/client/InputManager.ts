export class InputManager {
    private keys = new Map<string, boolean>();
    private mousePos = { x: 0, y: 0 };
    private mouseButtons = new Map<number, boolean>();
    private listeners = {
        onClick: [] as Array<(x: number, y: number, button: number) => void>,
        onKeyPress: [] as Array<(key: string) => void>,
        onMouseMove: [] as Array<(x: number, y: number) => void>
    };

    constructor(private canvas: HTMLCanvasElement) {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys.set(e.code, true);
            this.listeners.onKeyPress.forEach(callback => callback(e.code));
        });

        document.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
        });

        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
            
            this.listeners.onMouseMove.forEach(callback => 
                callback(this.mousePos.x, this.mousePos.y)
            );
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseButtons.set(e.button, true);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.mouseButtons.set(e.button, false);
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.listeners.onClick.forEach(callback => callback(x, y, e.button));
        });

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // Public API
    public isKeyPressed(key: string): boolean {
        return this.keys.get(key) || false;
    }

    public getMousePosition(): { x: number; y: number } {
        return { ...this.mousePos };
    }

    public isMouseButtonPressed(button: number): boolean {
        return this.mouseButtons.get(button) || false;
    }

    // Event listeners
    public onMouseClick(callback: (x: number, y: number, button: number) => void): void {
        this.listeners.onClick.push(callback);
    }

    public onKeyPress(callback: (key: string) => void): void {
        this.listeners.onKeyPress.push(callback);
    }

    public onMouseMove(callback: (x: number, y: number) => void): void {
        this.listeners.onMouseMove.push(callback);
    }

    public update(): void {
        // Called each frame to process any frame-based input logic
        // Currently not needed but useful for future extensions
    }
}