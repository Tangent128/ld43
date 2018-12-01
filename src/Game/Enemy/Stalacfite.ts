import { Id, Create, Join, Remove } from "Ecs/Data";
import { CollisionClass, Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, Hp, Teams } from "Game/GameComponents";

enum Thought {
    SPAWNING,
    DWELLING,
    DROPPING
}
export class Stalacfite {
    thinking = Thought.SPAWNING;
    aiCooldown = 0;
}

export function SpawnStalacfite(data: Data, world: World, x: number): Id {
    return Create(data, {
        stalacfite: new Stalacfite(),
        collisionSourceClass: new CollisionClass("enemy"),
        collisionTargetClass: new CollisionClass("enemy"),
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

const PADDING = 50;
export function StalacfiteThink(data: Data, {width, height, debug}: World, interval: number) {
    let count = 0;
    Join(data, "location", "stalacfite").forEach(([id, location, stalacfite]) => {
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
            stalacfite.thinking = Thought.DWELLING;
            if(!aiCoolingDown) {
                stalacfite.thinking = Thought.DROPPING;
            }
        } else if(stalacfite.thinking == Thought.DROPPING) {
            location.VY += 500 * interval;
        }

        if(location.Y > height + PADDING) {
            Remove(data, id);
        }
    });
    debug["stalacfites"] = count;
}
