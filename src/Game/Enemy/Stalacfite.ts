import { Id, Create, Join, Remove } from "Ecs/Data";
import { CollisionClass, Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, Hp, Teams, Boss } from "Game/GameComponents";
import { EvenPattern } from "Level/Level";

enum Thought {
    SPAWNING,
    DWELLING,
    DROPPING,
    RISING
}
export class Stalacfite {
    thinking = Thought.SPAWNING;
    aiCooldown = 0;
    constructor(
        public bossMode = false
    ) {}
}

export function SpawnStalacfite(data: Data, world: World, x: number): Id {
    return Create(data, {
        stalacfite: new Stalacfite(),
        collisionSourceClass: new CollisionClass("stalacfite"),
        collisionTargetClass: new CollisionClass("stalacfite"),
        hp: new Hp(Teams.ENEMY, 300),
        location: new Location({
            X: x,
            Y: -50,
            VY: 100
        }),
        bounds: new Polygon([
            -20, -30,
            0, 40,
            20, -30
        ]),
        renderBounds: new RenderBounds("#a8f", world.shipLayer)
    });
}

export function SpawnStalacfiteDx(data: Data, world: World, x: number): Id {
    return Create(data, {
        stalacfite: new Stalacfite(true),
        boss: new Boss("Stalacfite DX"),
        collisionSourceClass: new CollisionClass("stalacfite"),
        collisionTargetClass: new CollisionClass("stalacfite"),
        hp: new Hp(Teams.ENEMY, 2000),
        location: new Location({
            X: x,
            Y: -150,
            VY: 100
        }),
        bounds: new Polygon([
            -50, 0,
            0, 150,
            50, 0
        ]),
        renderBounds: new RenderBounds("#a8f", world.shipLayer)
    });
}

const PADDING = 50;
export function StalacfiteThink(data: Data, world: World, interval: number) {
    const {height, debug} = world;
    let count = 0;
    Join(data, "stalacfite", "location", "hp").forEach(([id, stalacfite, location, hp]) => {
        count++;

        const aiCoolingDown = stalacfite.aiCooldown > 0;

        if(aiCoolingDown) {
            stalacfite.aiCooldown = Math.max(stalacfite.aiCooldown - interval, 0);
        }

        if(stalacfite.thinking == Thought.SPAWNING && !aiCoolingDown) {
            stalacfite.thinking = Thought.DWELLING;
            stalacfite.aiCooldown = Math.random()*1.5 + 0.5;
        } else if(stalacfite.thinking == Thought.DWELLING) {
            location.VY = Math.max(location.VY - 70 * interval, 0);
            if(stalacfite.bossMode) {
                // aim at player
                const target = Join(data, "playerShip", "location")[0];
                if(target) {
                    const dx = target[2].X - location.X;
                    if(Math.abs(dx) > 10) {
                        location.VX = Math.sign(dx) * 150;
                    } else {
                        location.VX = 0;
                    }
                }
                // heal
                hp.hp = Math.min(hp.hp + 150 * interval, 2000);
            }
            if(!aiCoolingDown) {
                stalacfite.thinking = Thought.DROPPING;
            }
        } else if(stalacfite.thinking == Thought.DROPPING) {
            location.VY += 500 * interval;
            location.VX = 0;
        } else if(stalacfite.thinking == Thought.RISING) {
            location.VY = -150;
        }

        if(location.Y > height + PADDING) {
            if(stalacfite.bossMode) {
                stalacfite.thinking = Thought.RISING;
            } else {
                Remove(data, id);
            }
        } else if(location.Y < -PADDING && stalacfite.thinking == Thought.RISING) {
            stalacfite.thinking = Thought.DWELLING;
            stalacfite.aiCooldown = Math.random()*2 + 1;
            // spawn some fodder
            const spawner = new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite);
            spawner.spawn(data, world);
        }
    });
}
