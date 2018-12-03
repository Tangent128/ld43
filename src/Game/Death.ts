import { PlaySfx } from "Applet/Audio";
import { RenderBounds, Polygon, Location } from "Ecs/Components";
import { Join, Remove, Lookup, Create, Id } from "Ecs/Data";
import { Data, World, BOOM_SOUND, BIG_BOOM_SOUND, Lifetime } from "Game/GameComponents";

export function CheckHp(data: Data, world: World) {
    Join(data, "hp").forEach(([id, hp]) => {
        if(hp.hp <= 0) {
            // determine death sound
            const [ship, location] = Lookup(data, id, "playerShip", "location");
            if(ship != null) {
                PlaySfx(BIG_BOOM_SOUND);
                if(location != null) {
                    SpawnBlast(data, world, location.X, location.Y, 8, "#fa0", 20);
                    SpawnBlast(data, world, location.X, location.Y, 3, "#000", 60);
                }
            } else {
                PlaySfx(BOOM_SOUND);
                if(location != null) {
                    SpawnBlast(data, world, location.X, location.Y, 5, "#fff", 10);
                    SpawnBlast(data, world, location.X, location.Y, 3, "#000", 60);
                }
            }

            // remove from game
            Remove(data, id);
        }
    });
}

export function CheckLifetime(data: Data, world: World, interval: number) {
    let particles = 0;
    Join(data, "lifetime").forEach(([id, lifetime]) => {
        lifetime.time -= interval;
        if(lifetime.time <= 0) {
            // remove from game
            Remove(data, id);
        }
        particles++;
    });
}

export function SmokeDamage(data: Data, world: World) {
    Join(data, "hp", "location").forEach(([id, hp, {X, Y}]) => {
        // convert dealt damage to particles
        const puffs = Math.floor(hp.receivedDamage / 3);
        SpawnBlast(data, world, X, Y, 2, "#000", puffs);
        hp.receivedDamage = Math.floor(hp.receivedDamage % 3);
    });
}

function SpawnBlast(data: Data, world: World, x: number, y: number, size: number, color: string, count: number) {
    for(let puff = 0; puff < count; puff++) {
        const angle = Math.PI * 2 * puff / count;
        SpawnPuff(data, world, x, y, size, color, angle);
    }
}

function SpawnPuff(data: Data, world: World, x: number, y: number, size: number, color: string, angle: number): Id {
    return Create(data, {
        location: new Location({
            X: x,
            Y: y,
            VX: (Math.random() + 0.5) * 400 * Math.cos(angle),
            VY: (Math.random() + 0.5) * 400 * -Math.sin(angle)
        }),
        bounds: new Polygon([
            -size, -size,
            -size, size,
            size, size,
            size, -size
        ]),
        renderBounds: new RenderBounds(color, world.smokeLayer),
        lifetime: new Lifetime(Math.random() / 3)
    });
}
