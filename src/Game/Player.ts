import { Id, Create } from "Ecs/Data";
import { Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World } from "Game/GameComponents";

export function SpawnPlayer(data: Data, world: World): Id {
    return Create(data, {
        location: new Location({
            X: world.width / 2,
            Y: world.height - 15
        }),
        bounds: new Polygon([
            -15, 10,
            15, 10,
            15, 0,
            0, -15,
            -15, 0
        ]),
        renderBounds: new RenderBounds("#fff", world.shipLayer)
    });
}
