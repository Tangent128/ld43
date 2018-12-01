import { Id, Create, Join, Remove } from "Ecs/Data";
import { Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, Bullet, Teams } from "Game/GameComponents";

export function SpawnBullet(data: Data, world: World, x: number, y: number): Id {
    return Create(data, {
        bullet: new Bullet(Teams.PLAYER),
        location: new Location({
            X: x,
            Y: y,
            VY: -400
        }),
        bounds: new Polygon([
            -3, -10,
            -3, 0,
            3, 0,
            3, -10
        ]),
        renderBounds: new RenderBounds("#ff8", world.bulletLayer)
    });
}

const PADDING = 30;
export function ReapBullets(data: Data, {width, height, debug}: World) {
    let bulletCount = 0;
    Join(data, "location", "bullet").forEach(([id, {X, Y}, bullet]) => {
        bulletCount++;
        if(X < -PADDING || X > width + PADDING || Y < -PADDING || Y > height + PADDING) {
            Remove(data, id);
        }
    });
    debug["bullets"] = bulletCount;
}
