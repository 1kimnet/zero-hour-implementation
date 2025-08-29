// Core entity interface
export interface Entity {
    readonly id: string;
    readonly components: Map<string, Component>;
}

// Base component interface
export interface Component {
    readonly type: string;
}

// Position component
export class PositionComponent implements Component {
    readonly type = 'position';
    
    constructor(
        public x: number,
        public y: number,
        public z: number = 0
    ) {}
}

// Velocity component
export class VelocityComponent implements Component {
    readonly type = 'velocity';
    
    constructor(
        public x: number,
        public y: number,
        public z: number = 0
    ) {}
}

// Health component
export class HealthComponent implements Component {
    readonly type = 'health';
    
    constructor(
        public current: number,
        public maximum: number
    ) {}
    
    get isAlive(): boolean {
        return this.current > 0;
    }
    
    get healthPercentage(): number {
        return this.current / this.maximum;
    }
}

// Sprite component for rendering
export class SpriteComponent implements Component {
    readonly type = 'sprite';
    
    constructor(
        public textureId: string,
        public width: number = 64,
        public height: number = 64,
        public rotation: number = 0
    ) {}
}

// Unit component for game logic
export class UnitComponent implements Component {
    readonly type = 'unit';
    
    constructor(
        public unitType: string,
        public playerId: string,
        public selected: boolean = false
    ) {}
}

// Factory for creating entities
export class EntityFactory {
    private static nextId = 0;
    
    static createEntity(): Entity {
        return {
            id: `entity_${++this.nextId}`,
            components: new Map<string, Component>()
        };
    }
    
    static createUnit(
        x: number, 
        y: number, 
        unitType: string, 
        playerId: string
    ): Entity {
        const entity = this.createEntity();
        
        entity.components.set('position', new PositionComponent(x, y));
        entity.components.set('health', new HealthComponent(100, 100));
        entity.components.set('sprite', new SpriteComponent(`${unitType}_texture`));
        entity.components.set('unit', new UnitComponent(unitType, playerId));
        
        return entity;
    }
}

// Entity manager for handling collections of entities
export class EntityManager {
    private entities = new Map<string, Entity>();
    
    addEntity(entity: Entity): void {
        this.entities.set(entity.id, entity);
    }
    
    removeEntity(entityId: string): void {
        this.entities.delete(entityId);
    }
    
    getEntity(entityId: string): Entity | undefined {
        return this.entities.get(entityId);
    }
    
    getEntitiesWithComponents(componentTypes: string[]): Entity[] {
        return Array.from(this.entities.values()).filter(entity => 
            componentTypes.every(type => entity.components.has(type))
        );
    }
    
    getAllEntities(): Entity[] {
        return Array.from(this.entities.values());
    }
    
    clear(): void {
        this.entities.clear();
    }
}