// System base interface
export interface System {
    readonly name: string;
    readonly requiredComponents: string[];
    update(entities: Entity[], deltaTime: number): void;
}

import { Entity, PositionComponent, VelocityComponent, HealthComponent } from './Entity';

// Movement system - handles entity movement based on velocity
export class MovementSystem implements System {
    readonly name = 'MovementSystem';
    readonly requiredComponents = ['position', 'velocity'];
    
    update(entities: Entity[], deltaTime: number): void {
        entities.forEach(entity => {
            const position = entity.components.get('position') as PositionComponent;
            const velocity = entity.components.get('velocity') as VelocityComponent;
            
            // Update position based on velocity and delta time
            position.x += velocity.x * deltaTime;
            position.y += velocity.y * deltaTime;
            position.z += velocity.z * deltaTime;
        });
    }
}

// Health system - handles health regeneration and death
export class HealthSystem implements System {
    readonly name = 'HealthSystem';
    readonly requiredComponents = ['health'];
    
    private regenerationRate = 1; // HP per second
    
    update(entities: Entity[], deltaTime: number): void {
        entities.forEach(entity => {
            const health = entity.components.get('health') as HealthComponent;
            
            // Natural health regeneration (if not at max)
            if (health.current < health.maximum) {
                health.current = Math.min(
                    health.maximum,
                    health.current + this.regenerationRate * deltaTime
                );
            }
            
            // Handle death (could trigger events here)
            if (!health.isAlive) {
                console.log(`Entity ${entity.id} has died`);
                // In a real implementation, this would trigger death handling
            }
        });
    }
}

// Collision system - basic AABB collision detection
export class CollisionSystem implements System {
    readonly name = 'CollisionSystem';
    readonly requiredComponents = ['position', 'sprite'];
    
    update(entities: Entity[], deltaTime: number): void {
        for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
                const entityA = entities[i];
                const entityB = entities[j];
                
                if (this.checkCollision(entityA, entityB)) {
                    this.handleCollision(entityA, entityB);
                }
            }
        }
    }
    
    private checkCollision(entityA: Entity, entityB: Entity): boolean {
        const posA = entityA.components.get('position') as PositionComponent;
        const posB = entityB.components.get('position') as PositionComponent;
        const spriteA = entityA.components.get('sprite') as any;
        const spriteB = entityB.components.get('sprite') as any;
        
        // Simple AABB collision detection
        return (
            posA.x < posB.x + spriteB.width &&
            posA.x + spriteA.width > posB.x &&
            posA.y < posB.y + spriteB.height &&
            posA.y + spriteA.height > posB.y
        );
    }
    
    private handleCollision(entityA: Entity, entityB: Entity): void {
        // Handle collision response (placeholder)
        console.log(`Collision between ${entityA.id} and ${entityB.id}`);
    }
}

// System manager to coordinate multiple systems
export class SystemManager {
    private systems: System[] = [];
    
    addSystem(system: System): void {
        this.systems.push(system);
        console.log(`Added system: ${system.name}`);
    }
    
    removeSystem(systemName: string): void {
        this.systems = this.systems.filter(system => system.name !== systemName);
        console.log(`Removed system: ${systemName}`);
    }
    
    update(entityManager: any, deltaTime: number): void {
        this.systems.forEach(system => {
            // Get entities that have all required components for this system
            const relevantEntities = entityManager.getEntitiesWithComponents(
                system.requiredComponents
            );
            
            // Update the system with relevant entities
            system.update(relevantEntities, deltaTime);
        });
    }
    
    getSystems(): System[] {
        return [...this.systems];
    }
}