import { PlaySfx } from "Applet/Audio";
import { Id, Create, Join, Remove, Lookup } from "Ecs/Data";
import { Polygon, Location, RenderBounds, CollisionClass } from "Ecs/Components";
import { Data, World, Bullet, Teams, HIT_SOUND, PlayerWeapons } from "Game/GameComponents";

export function SpawnBullet(data: Data, world: World, x: number, y: number, weapon: PlayerWeapons, angle = Math.PI/2, attack = 100): Id {
    return Create(data, {
        bullet: new Bullet(Teams.PLAYER, weapon, attack),
        collisionSourceClass: new CollisionClass("bullet"),
        location: new Location({
            X: x,
            Y: y,
            VX: 400 * Math.cos(angle),
            VY: -400 * Math.sin(angle),
            Angle: angle
        }),
        bounds: new Polygon([
            0, -3,
            0, 3,
            10, 3,
            10, -3
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
}
