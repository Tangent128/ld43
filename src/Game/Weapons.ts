import { PlaySfx } from "Applet/Audio";
import { Id, Create, Join, Remove, Lookup } from "Ecs/Data";
import { Polygon, Location, RenderBounds, CollisionClass } from "Ecs/Components";
import { Data, World, Bullet, Teams, HIT_SOUND } from "Game/GameComponents";

export function SpawnBullet(data: Data, world: World, x: number, y: number): Id {
    return Create(data, {
        bullet: new Bullet(Teams.PLAYER),
        collisionSourceClass: new CollisionClass("bullet"),
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

export function BulletCollide(data: Data, className: string, sourceId: Id, targetId: Id) {
    switch(className) {
        case "bullet>enemy":
            const [bullet] = Lookup(data, sourceId, "bullet");
            const [hp] = Lookup(data, targetId, "hp");
            if(bullet && hp && (bullet.team != hp.team)) {
                hp.hp -= bullet.attack;
                hp.receivedDamage += bullet.attack;
                bullet.hit = true;
                PlaySfx(HIT_SOUND);
            }
    }
}

const PADDING = 30;
export function ReapBullets(data: Data, {width, height, debug}: World) {
    let bulletCount = 0;
    Join(data, "location", "bullet").forEach(([id, {X, Y}, bullet]) => {
        bulletCount++;
        if(bullet.hit || X < -PADDING || X > width + PADDING || Y < -PADDING || Y > height + PADDING) {
            Remove(data, id);
        }
    });
    debug["bullets"] = bulletCount;
}
