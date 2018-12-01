import { Id, Create, Join } from "Ecs/Data";
import { Polygon, Location, RenderBounds } from "Ecs/Components";
import { Data, World, PlayerShip } from "Game/GameComponents";
import { SpawnBullet } from "Game/Weapons";

export function SpawnPlayer(data: Data, world: World): Id {
    return Create(data, {
        playerShip: new PlayerShip(),
        location: new Location({
            X: world.width / 2,
            Y: world.height + 15,
            VY: -100
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

export function ControlPlayer(data: Data, world: World, interval: number) {
    const {dx, dy, firing, weaponCycle} = world.playerInput;
    const diagonalSlowdown = (dx != 0 && dy != 0) ? 0.7 : 1;

    Join(data, "playerShip", "location").forEach(([id, ship, location]) => {
        // PHASE: Movement
        const overLeftEdge = location.X < 15;
        const overRightEdge = location.X > (world.width - 15);
        if((overLeftEdge && dx < 0) || (overRightEdge && dx > 0)) {
            location.VX = 0;
        } else {
            location.VX = dx * 300 * diagonalSlowdown;
        }

        const overTopEdge = location.Y < 15;
        const overBottomEdge = location.Y > (world.height - 20);
        if(overTopEdge && dy < 0) {
            location.VY = 0;
        } else if(overBottomEdge && dy >= 0) {
            // permit scroll onto screen
            location.VY = Math.min(location.VY, 0);
        } else {
            location.VY = dy * 200 * diagonalSlowdown;
        }

        // PHASE: Firing
        if(firing && ship.firingCooldown <= 0) {
            FireForwardGun(data, world, ship, location.X, location.Y);
        } else {
            ship.firingCooldown = Math.max(0, ship.firingCooldown - interval);
        }
        world.debug["weapon"] = {firing, cooldown: Math.floor(ship.firingCooldown*1000)};
    });

    // edge-triggered
    world.playerInput.weaponCycle = false;
}

function FireForwardGun(data: Data, world: World, ship: PlayerShip, x: number, y: number) {
    ship.firingCooldown = 0.2;
    SpawnBullet(data, world, x, y);
}
