import { Layer, DrawSet, SpriteSheet } from "Applet/Render";
import { Store } from "Ecs/Data";
import { Data as EcsData } from "Ecs/Components";
import bigBoomUrl from "Game/BigBoom.ogg";
import enemyShootUrl from "Game/EnemyShoot.ogg";
import hitUrl from "Game/Hit.ogg";
import { PlayerControl } from "Game/Input";
import shootUrl from "Game/Shoot.ogg";
import boomUrl from "Game/SmallBoom.ogg";
import splashUrl from "Game/Splashscreens.png";
import { Stalacfite } from "Game/Enemy/Stalacfite";
import { Swooparang } from "Game/Enemy/Swooparang";
import { Level } from "Level/Level";

function loadImage(url: string) {
    return Object.assign(new Image(), {src: url});
};
// Images
export const SPLASH_SHEET = new SpriteSheet(loadImage(splashUrl), 500, 400);

// Sfx
export const HIT_SOUND = new Audio(hitUrl);
export const SHOOT_SOUND = new Audio(shootUrl);
export const ENEMY_SHOOT_SOUND = new Audio(enemyShootUrl);
export const BOOM_SOUND = new Audio(boomUrl);
export const BIG_BOOM_SOUND = new Audio(bigBoomUrl);

export enum GamePhase {
    TITLE,
    PLAYING,
    PAUSED,
    LOST,
    WON
}
export enum PlayerWeapons {
    NONE = 0,
    SHOOTER = 1,
    BACK_FLARE = 2
}
export type RGB = [number, number, number];
export class World {
    width = 500;
    height = 400;

    playerInput = new PlayerControl();

    /*
     * Core Game Status
     */
    phase = GamePhase.PLAYING;
    respawnCooldown = 0;
    lives = 3;
    availableWeapons = [false, true, true];

    constructor(
        /**
         * Spawns waves of enemies & scenery
         */
        public level: Level
    ) {}

    /*
     * Drawing Layers
     */
    groundLayer = new Layer(0);
    cloudLayer = new Layer(1);
    debugLayer = new Layer(2);
    bulletLayer = new Layer(10);
    shipLayer = new Layer(15);
    smokeLayer = new Layer(16);
    hudLayer = new Layer(20);

    bgColor: RGB = [255, 255, 255];

    /**
     * Catch-all debug tool
     */
    debug: Record<string, any> = {
    };
    drawDebug(drawSet: DrawSet, color: string) {
        drawSet.queue(this.hudLayer.toRender((cx, dt) => {
            cx.font = "12px monospace";
            cx.fillStyle = color;
            let y = 12;
            for(const label in this.debug) {
                cx.fillText(`${label}: ${JSON.stringify(this.debug[label])}`, 0, y, this.width);
                y += 14;
            }
        }));
    }
}

export class Data extends EcsData {
    boss: Store<Boss> = {};
    bullet: Store<Bullet> = {};
    hp: Store<Hp> = {};
    lifetime: Store<Lifetime> = {};
    playerShip: Store<PlayerShip> = {};
    stalacfite: Store<Stalacfite> = {};
    swooparang: Store<Swooparang> = {};
}

export class PlayerShip {
    firingCooldown = 0;
    mercyCooldown = 2;
    currentWeapon: PlayerWeapons = PlayerWeapons.NONE;
}

export enum Teams {
    PLAYER,
    ENEMY
}
export class Bullet {
    hit = false;
    constructor(
        public team: Teams,
        public weapon: PlayerWeapons,
        public attack: number
    ) {};
}
export class Hp {
    receivedDamage = 0;
    constructor(
        public team: Teams,
        public hp: number
    ) {};
}

export class Lifetime {
    constructor(
        public time: number
    ) {};
}

export class Boss {
    killedBy: PlayerWeapons = PlayerWeapons.NONE;
    constructor(
        public name: string
    ) {}
}
