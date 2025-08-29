import { Entity, EntityFactory, PositionComponent, VelocityComponent } from '../../src/core/Entity';
import { MovementSystem } from '../../src/core/Systems';

describe('Entity System', () => {
    describe('EntityFactory', () => {
        it('should create entities with unique IDs', () => {
            const entity1 = EntityFactory.createEntity();
            const entity2 = EntityFactory.createEntity();
            
            expect(entity1.id).not.toBe(entity2.id);
            expect(entity1.components).toBeInstanceOf(Map);
            expect(entity2.components).toBeInstanceOf(Map);
        });

        it('should create units with required components', () => {
            const unit = EntityFactory.createUnit(100, 200, 'infantry', 'player1');
            
            expect(unit.components.has('position')).toBe(true);
            expect(unit.components.has('health')).toBe(true);
            expect(unit.components.has('sprite')).toBe(true);
            expect(unit.components.has('unit')).toBe(true);
            
            const position = unit.components.get('position') as PositionComponent;
            expect(position.x).toBe(100);
            expect(position.y).toBe(200);
        });
    });

    describe('Components', () => {
        it('should create position component correctly', () => {
            const position = new PositionComponent(10, 20, 5);
            
            expect(position.type).toBe('position');
            expect(position.x).toBe(10);
            expect(position.y).toBe(20);
            expect(position.z).toBe(5);
        });

        it('should create velocity component with default z value', () => {
            const velocity = new VelocityComponent(5, 10);
            
            expect(velocity.type).toBe('velocity');
            expect(velocity.x).toBe(5);
            expect(velocity.y).toBe(10);
            expect(velocity.z).toBe(0);
        });
    });
});

describe('MovementSystem', () => {
    let movementSystem: MovementSystem;
    let entity: Entity;

    beforeEach(() => {
        movementSystem = new MovementSystem();
        entity = EntityFactory.createEntity();
        entity.components.set('position', new PositionComponent(0, 0));
        entity.components.set('velocity', new VelocityComponent(10, 5));
    });

    it('should update entity position based on velocity', () => {
        const deltaTime = 1.0;
        movementSystem.update([entity], deltaTime);

        const position = entity.components.get('position') as PositionComponent;
        expect(position.x).toBe(10);
        expect(position.y).toBe(5);
        expect(position.z).toBe(0);
    });

    it('should handle multiple entities', () => {
        const entity2 = EntityFactory.createEntity();
        entity2.components.set('position', new PositionComponent(100, 100));
        entity2.components.set('velocity', new VelocityComponent(-5, -2));

        const deltaTime = 2.0;
        movementSystem.update([entity, entity2], deltaTime);

        const position1 = entity.components.get('position') as PositionComponent;
        const position2 = entity2.components.get('position') as PositionComponent;

        expect(position1.x).toBe(20); // 0 + (10 * 2)
        expect(position1.y).toBe(10); // 0 + (5 * 2)
        expect(position2.x).toBe(90); // 100 + (-5 * 2)
        expect(position2.y).toBe(96); // 100 + (-2 * 2)
    });

    it('should not affect entities without required components', () => {
        const entityWithoutVelocity = EntityFactory.createEntity();
        entityWithoutVelocity.components.set('position', new PositionComponent(50, 50));

        movementSystem.update([entityWithoutVelocity], 1.0);

        const position = entityWithoutVelocity.components.get('position') as PositionComponent;
        expect(position.x).toBe(50); // Unchanged
        expect(position.y).toBe(50); // Unchanged
    });
});