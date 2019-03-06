import { Layer, DrawSet, SpriteSheet } from "../Applet/Render";
import { Store } from "../Ecs/Data";
import { Data as EcsData } from "../Ecs/Components";
import bigBoomUrl from "./BigBoom.ogg";
import enemyShootUrl from "./EnemyShoot.ogg";
import hitUrl from "./Hit.ogg";
import { PlayerControl } from "./Input";
import shootUrl from "./Shoot.ogg";
import boomUrl from "./SmallBoom.ogg";
import splashUrl from "./Splashscreens.png";
import { Stalacfite } from "./Enemy/Stalacfite";
import { Swooparang } from "./Enemy/Swooparang";
import { Level } from "../Level/Level";
import { WeaponName } from "./Weapons";

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
    phase = GamePhase.TITLE;
    respawnCooldown = 0;
    lives = 5;
    availableWeapons = [false, true, true];
    score = 0;

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
    debug: Record<string, any> = {};

    drawHud(drawSet: DrawSet) {
        drawSet.queue(this.hudLayer.toRender((cx, dt) => {
            cx.font = "16px monospace";
            cx.textAlign = "left";
            cx.textBaseline = "middle";

            const lives = `Lives: ${this.lives}`;
            cx.fillStyle = "#000";
            cx.fillText(lives, 1, this.height - 18 + 1, this.width/4);
            cx.fillStyle = "#0ff";
            cx.fillText(lives, 0, this.height - 18, this.width/4);

            const score = `Score: ${this.score}`;
            cx.fillStyle = "#000";
            cx.fillText(score, this.width/3 + 1, this.height - 18 + 1, this.width/4);
            cx.fillStyle = "#0ff";
            cx.fillText(score, this.width/3, this.height - 18, this.width/4);

            const weapon = `Weapon: ${this.debug.weapon}`;
            cx.fillStyle = "#000";
            cx.fillText(weapon, this.width*2/3 + 1, this.height - 18 + 1, this.width/4);
            cx.fillStyle = "#0ff";
            cx.fillText(weapon, this.width*2/3, this.height - 18, this.width/4);
        }));
    }
}

export class Data extends EcsData {
    boss: Store<Boss> = {};
    bullet: Store<Bullet> = {};
    hp: Store<Hp> = {};
    lifetime: Store<Lifetime> = {};
    message: Store<Message> = {};
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

export class Message {
    targetY = 0;
    constructor(
        public layer: Layer,
        public color: string,
        public message: string,
        public timeout = 3
    ) {}
}
