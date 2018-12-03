import { Id, Create, Join, Remove } from "Ecs/Data";
import { CollisionClass, Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, Hp, Teams } from "Game/GameComponents";

enum Thought {
    SPAWNING,
    DWELLING,
    CHARGING
}
export class Swooparang {
    thinking = Thought.SPAWNING;
    aiCooldown = 1;
    constructor(
        public bossMode = false
    ) {}
}

export function SpawnSwooparang(data: Data, world: World, x: number): Id {
    return Create(data, {
        swooparang: new Swooparang(),
        collisionSourceClass: new CollisionClass("enemy"),
        collisionTargetClass: new CollisionClass("enemy"),
        hp: new Hp(Teams.ENEMY, 150),
        location: new Location({
            X: x,
            Y: -50,
            VY: (Math.random() + 0.5) * 100
        }),
        bounds: new Polygon([
            -12, -30,
            0, -30,
            21, -21,
            30, 0,
            21, 21,
            0, 30,
            -12, 30,
            -12, 21,
            0, 21,
            12, 0,
            0, -21,
            -12, -21
        ]),
        renderBounds: new RenderBounds("#8fa", world.shipLayer)
    });
}

const BRAKING = 300;
const TURN_SPEED = Math.PI;
export function SwooparangThink(data: Data, world: World, interval: number) {
    const {debug} = world;

    const targetSearch = Join(data, "playerShip", "location")[0];
    const target = targetSearch ? targetSearch[2] : null;

    let count = 0;
    Join(data, "swooparang", "location", "hp").forEach(([id, swooparang, location, hp]) => {
        world.debug.swooparang = {...swooparang, angle: location.Angle};
        count++;

        const aiCoolingDown = swooparang.aiCooldown > 0;

        if(aiCoolingDown) {
            swooparang.aiCooldown = Math.max(swooparang.aiCooldown - interval, 0);
        }

        // wait a little after spawn before activating
        if(swooparang.thinking == Thought.SPAWNING && !aiCoolingDown) {
            swooparang.thinking = Thought.DWELLING;
        }
        
        if(swooparang.thinking == Thought.DWELLING) {

            // brakes
            if(Math.abs(location.VX) > BRAKING * interval) {
                location.VX -= Math.sign(location.VX) * BRAKING * interval;
            } else {
                location.VX = 0;
            }
            if(Math.abs(location.VY) > BRAKING * interval) {
                location.VY -= Math.sign(location.VY) * BRAKING * interval;
            } else {
                location.VY = 0;
            }

            if(target) {
                const targetAngle = Math.atan2(location.Y - target.Y, target.X - location.X);
                let angleDelta = targetAngle - (location.Angle % (Math.PI*2));
                if(angleDelta < -Math.PI) angleDelta += Math.PI * 2;
                if(angleDelta > Math.PI) angleDelta -= Math.PI * 2;
                world.debug.targetAngle = targetAngle;

                if(Math.abs(angleDelta) < 0.1) {
                    location.VAngle = 0;
                    if(!aiCoolingDown) {
                        swooparang.thinking = Thought.CHARGING;
                        swooparang.aiCooldown = 1;
                    }
                } else if(angleDelta < 0) {
                    location.VAngle = -TURN_SPEED;
                } else {
                    location.VAngle = TURN_SPEED;
                }
            }

            if(swooparang.bossMode) {
            }
        }
        
        if(swooparang.thinking == Thought.CHARGING) {
            location.VX += 400 * Math.cos(location.Angle);
            location.VY -= 400 * Math.sin(location.Angle);

            if(!aiCoolingDown) {
                swooparang.thinking = Thought.DWELLING;
                swooparang.aiCooldown = 1;
            }
        }
    });
    world.debug.swooparangs = count;
}
