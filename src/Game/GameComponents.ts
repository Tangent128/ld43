import { Layer, DrawSet, SpriteSheet } from "Applet/Render";
import { Store } from "Ecs/Data";
import { Data as EcsData } from "Ecs/Components";
import { PlayerControl } from "Game/Input";
import splashUrl from "Game/Splashscreens.png";
import { Stalacfite } from "Game/Enemy/Stalacfite";
import { Level } from "Level/Level";

function loadImage(url: string) {
    const image = new Image();
    image.src = url
    return image;
};

export const SPLASH_SHEET = new SpriteSheet(loadImage(splashUrl), 500, 400);

export enum GamePhase {
    TITLE,
    PLAYING,
    PAUSED,
    LOST,
    WON
}
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
    hudLayer = new Layer(20);

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
    bullet: Store<Bullet> = {};
    hp: Store<Hp> = {};
    playerShip: Store<PlayerShip> = {};
    stalacfite: Store<Stalacfite> = {};
}

export class PlayerShip {
    firingCooldown = 0;
}

export enum Teams {
    PLAYER,
    ENEMY
}
export class Bullet {
    hit = false;
    constructor(
        public team: Teams,
        public attack = 100
    ) {};
}
export class Hp {
    constructor(
        public team: Teams,
        public hp: number
    ) {};
}
