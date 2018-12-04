import { Id, Create, Join, Remove } from "Ecs/Data";
import { CollisionClass, Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, Hp, Teams, Boss, PlayerWeapons, ENEMY_SHOOT_SOUND } from "Game/GameComponents";
import { SpawnBullet } from "Game/Weapons";
import { PlaySfx } from "Applet/Audio";

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
        collisionSourceClass: new CollisionClass("swooparang"),
        collisionTargetClass: new CollisionClass("swooparang"),
        hp: new Hp(Teams.ENEMY, 150),
        location: new Location({
            X: x,
            Y: -50,
            Angle: -Math.PI/2,
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

export function SpawnSwooparangDx(data: Data, world: World, x: number): Id {
    return Create(data, {
        swooparang: new Swooparang(true),
        boss: new Boss("Heavy Swooparang"),
        collisionSourceClass: new CollisionClass("swooparang"),
        collisionTargetClass: new CollisionClass("swooparang"),
        hp: new Hp(Teams.ENEMY, 500),
        location: new Location({
            X: x,
            Y: -50,
            Angle: -Math.PI/2,
            VY: 250
        }),
        bounds: new Polygon([
            -12, -30,
            0, -35,
            21, -21,
            30, 0,
            21, 21,
            0, 35,
            -12, 30,
            -12, 21,
            0, 21,
            12, 0,
            0, -21,
            -12, -21
        ]),
        renderBounds: new RenderBounds("#f00", world.shipLayer)
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

                if(Math.abs(angleDelta) < 0.1) {
                    location.VAngle = 0;
                    if(!aiCoolingDown) {
                        swooparang.thinking = Thought.CHARGING;
                        swooparang.aiCooldown = 1;
                        if(swooparang.bossMode) {
                            SpawnBullet(data, world, location.X, location.Y, PlayerWeapons.NONE, location.Angle-0.2, 5, 600, Teams.ENEMY);
                            SpawnBullet(data, world, location.X, location.Y, PlayerWeapons.NONE, location.Angle+0.2, 5, 600, Teams.ENEMY);
                            PlaySfx(ENEMY_SHOOT_SOUND);
                        }
                    }
                } else if(angleDelta < 0) {
                    location.VAngle = -TURN_SPEED;
                } else {
                    location.VAngle = TURN_SPEED;
                }
            }
        }
        
        if(swooparang.thinking == Thought.CHARGING) {
            location.VX += 400 * Math.cos(location.Angle);
            location.VY -= 400 * Math.sin(location.Angle);

            if(!aiCoolingDown) {
                swooparang.thinking = Thought.DWELLING;
                if(!swooparang.bossMode) {
                    swooparang.aiCooldown = 1 + Math.random();
                }
            }
        }
    });
}
