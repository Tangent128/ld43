import { Game } from "Applet/Init";
import { KeyControl } from "Applet/Keyboard";
import { Loop } from "Applet/Loop";
import { DrawSet } from "Applet/Render";
import { FindCollisions } from "Ecs/Collision";
import { DumbMotion } from "Ecs/Location";
import { RunRenderBounds } from "Ecs/RenderBounds";
import { CheckHp } from "Game/Death";
import { Data, World } from "Game/GameComponents";
import { SpawnPlayer, ControlPlayer } from "Game/Player";
import { ReapBullets, BulletCollide } from "Game/Weapons";
import { SpawnStalacfite, StalacfiteThink } from "Game/Enemy/Stalacfite";

const PHYSICS_FPS = 40;

@Game("#Shooter")
export class Shooter {
    world = new World();
    data = new Data();

    /**
     * The main loop for actual gameplay (not menus, etc)
     */
    gameLoop = new Loop(PHYSICS_FPS,
        /**
         * Physics Tick
         */
        interval => {

            // PHASE: Input/AI
            ControlPlayer(this.data, this.world, interval);
            StalacfiteThink(this.data, this.world, interval);

            // PHASE: Update
            DumbMotion(this.data, interval);

            // PHASE: React
            FindCollisions(this.data, 50, (className, source, target) => {
                BulletCollide(this.data, className, source, target);
            });

            // PHASE: reaping
            CheckHp(this.data, this.world);
            ReapBullets(this.data, this.world);
        },
        /**
         * Drawing Tick
         */
        dt => {
            const drawSet = new DrawSet();
            this.cx.fillStyle = "#333";
            this.cx.fillRect(0, 0, this.world.width, this.world.height);

            RunRenderBounds(this.data, drawSet);
            this.world.drawDebug(drawSet, "#f00");

            drawSet.draw(this.cx, dt);
        });

    constructor(public canvas: HTMLCanvasElement, public cx: CanvasRenderingContext2D, public keys: KeyControl) {
        SpawnPlayer(this.data, this.world);
        SpawnStalacfite(this.data, this.world, this.world.width * 0.3)
        SpawnStalacfite(this.data, this.world, this.world.width * 0.5)
        SpawnStalacfite(this.data, this.world, this.world.width * 0.7)
        this.gameLoop.start();
        this.keys.setHandler(this.world.playerInput);
        this.keys.focus();
    }
}
