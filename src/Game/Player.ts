import { Id, Create, Join } from "Ecs/Data";
import { Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, PlayerShip } from "Game/GameComponents";

export function SpawnPlayer(data: Data, world: World): Id {
    return Create(data, {
        playerShip: new PlayerShip(),
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

export function ControlPlayer(data: Data, world: World) {
    const {dx, dy} = world.playerInput;
    const diagonalSlowdown = (dx != 0 && dy != 0) ? 0.7 : 1;
    Join(data, "playerShip", "location").forEach(([id, ship, location]) => {
        location.VX = dx * 300 * diagonalSlowdown;
        location.VY = dy * 200 * diagonalSlowdown;
    });
    world.debug["ControlPlayer"] = [dx, dy];
}
