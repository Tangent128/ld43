import { Id, Create, Join } from "Ecs/Data";
import { Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World } from "Game/GameComponents";

export function SpawnBullet(data: Data, world: World, x: number, y: number): Id {
    return Create(data, {
        location: new Location({
            X: x,
            Y: y,
            VY: -400
        }),
        bounds: new Polygon([
            -3, -10,
            -3, 0,
            3, 0,
            3, 10
        ]),
        renderBounds: new RenderBounds("#ff8", world.shipLayer)
    });
}
