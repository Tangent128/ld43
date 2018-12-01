import { Layer, DrawSet } from "Applet/Render";
import { Store } from "Ecs/Data";
import { Data as EcsData } from "Ecs/Components";
import { PlayerControl } from "Game/Input";
import { Stalacfite } from "Game/Enemy/Stalacfite";

export class World {
    width = 500;
    height = 400;

    playerInput = new PlayerControl();

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
    constructor(
        public team: Teams
    ) {};
}
