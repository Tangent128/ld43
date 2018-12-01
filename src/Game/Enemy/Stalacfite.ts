import { Id, Create, Join, Remove } from "Ecs/Data";
import { Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, Bullet, Teams } from "Game/GameComponents";

export class Stalacfite {
}

export function SpawnStalacfite(data: Data, world: World, x: number): Id {
    return Create(data, {
        stalacfite: new Stalacfite(),
        location: new Location({
            X: x,
            Y: -30,
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

export function StalacfiteThink(data: Data, {width, height, debug}: World) {
    Join(data, "location", "stalacfite").forEach(([id, {X, Y}, stalacfite]) => {
    });
}
