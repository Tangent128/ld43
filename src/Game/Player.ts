import { PlaySfx } from "Applet/Audio";
import { Id, Create, Join, Lookup } from "Ecs/Data";
import { Polygon, Location, RenderBounds, CollisionClass } from "Ecs/Components";
import { Data, World, PlayerShip, Hp, Teams, GamePhase, SHOOT_SOUND, PlayerWeapons } from "Game/GameComponents";
import { SpawnBullet, WeaponName } from "Game/Weapons";
import { SpawnMessage } from "./Message";

export function SpawnPlayer(data: Data, world: World): Id {
    const ship = new PlayerShip();
    return Create(data, {
        playerShip: ship,
        collisionTargetClass: new CollisionClass("player"),
        hp: new Hp(Teams.PLAYER, 1),
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
        renderBounds: new RenderBounds("#ff0", world.shipLayer)
    });
}

function CycleWeapon(ship: PlayerShip, world: World) {
    const haveWeapons = world.availableWeapons.filter(weapon => weapon == true).length > 0;
    if(haveWeapons) {
        do {
            ship.currentWeapon++;
            if(ship.currentWeapon > world.availableWeapons.length) {
                ship.currentWeapon = 0;
            }
        } while(!world.availableWeapons[ship.currentWeapon])
    } else {
        ship.currentWeapon = PlayerWeapons.NONE;
    }
}

export function RespawnPlayer(data: Data, world: World, interval: number) {
    const playerDead = Join(data, "playerShip").length == 0;

    if(world.respawnCooldown > 0) {
        world.respawnCooldown = Math.max(world.respawnCooldown - interval, 0);
    } else if(playerDead) {
        if(world.lives > 0) {
            SpawnPlayer(data, world);
            world.lives--;
        } else if(world.phase == GamePhase.PLAYING) {
            world.phase = GamePhase.LOST;
            SpawnMessage("#f00", `G A M E`)(data, world, 0);
            SpawnMessage("#f00", `O V E R`)(data, world, 0.01);
            SpawnMessage("#888", `Press C or Enter to restart`)(data, world, 0.02);
        }
    } else {
        world.respawnCooldown = 2;
    }

    world.debug.lives = world.lives;
}

export function ControlPlayer(data: Data, world: World, interval: number) {
    const {dx, dy, firing, weaponCycle} = world.playerInput;
    const diagonalSlowdown = (dx != 0 && dy != 0) ? 0.7 : 1;

    Join(data, "playerShip", "location", "renderBounds", "hp").forEach(([id, ship, location, renderBounds, hp]) => {
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
        if(weaponCycle || world.availableWeapons[ship.currentWeapon] == false) {
            CycleWeapon(ship, world);
            world.debug.weapon = WeaponName(ship.currentWeapon);
        }
        if(firing && ship.firingCooldown <= 0) {
            switch(ship.currentWeapon) {
                case PlayerWeapons.SHOOTER:
                    FireForwardGun(data, world, ship, location.X, location.Y);
                    break;
                case PlayerWeapons.BACK_FLARE:
                    FireBackFlare(data, world, ship, location.X, location.Y);
                    break;
            }
        } else {
            ship.firingCooldown = Math.max(0, ship.firingCooldown - interval);
        }

        // PHASE: Mercy Invincibility
        if(ship.mercyCooldown > 0) {
            ship.mercyCooldown = Math.max(0, ship.mercyCooldown - interval);
            renderBounds.color = "#ff0";
            hp.hp = 9999;
        } else {
            renderBounds.color = "#fff";
            hp.hp = Math.min(hp.hp, 1);
        }
    });

    // edge-triggered
    world.playerInput.weaponCycle = false;
}

function FireForwardGun(data: Data, world: World, ship: PlayerShip, x: number, y: number) {
    ship.firingCooldown = 0.2;
    SpawnBullet(data, world, x, y, PlayerWeapons.SHOOTER);
    PlaySfx(SHOOT_SOUND);
}
function FireBackFlare(data: Data, world: World, ship: PlayerShip, x: number, y: number) {
    ship.firingCooldown = 0.4;
    SpawnBullet(data, world, x, y, PlayerWeapons.BACK_FLARE, Math.PI * 1.4, 150);
    SpawnBullet(data, world, x, y, PlayerWeapons.BACK_FLARE, Math.PI * 1.5, 150);
    SpawnBullet(data, world, x, y, PlayerWeapons.BACK_FLARE, Math.PI * 1.6, 150);
    PlaySfx(SHOOT_SOUND);
}

export function PlayerCollide(data: Data, className: string, sourceId: Id, targetId: Id) {
    switch(className) {
        case "stalacfite>player":
        case "swooparang>player":
            const [ship, hp] = Lookup(data, targetId, "playerShip", "hp");
            if(ship && hp) {
                hp.hp -= 100;
            }
    }
}
