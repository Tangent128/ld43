import { Game } from "Applet/Init";
import { KeyControl } from "Applet/Keyboard";
import { Loop } from "Applet/Loop";
import { DrawSet } from "Applet/Render";
import { FindCollisions } from "Ecs/Collision";
import { DumbMotion } from "Ecs/Location";
import { RunRenderBounds, RunRenderSprites } from "Ecs/Renderers";
import { CheckHp } from "Game/Death";
import { Data, World, GamePhase, SPLASH_SHEET } from "Game/GameComponents";
import { SpawnPlayer, ControlPlayer, PlayerCollide } from "Game/Player";
import { ReapBullets, BulletCollide } from "Game/Weapons";
import { SpawnStalacfite, StalacfiteThink } from "Game/Enemy/Stalacfite";
import { CaveLevel } from "Level/Cave";

const PHYSICS_FPS = 40;

@Game("#Shooter")
export class Shooter {
    world = new World(new CaveLevel());
    data = new Data();

    /**
     * The main loop for actual gameplay (not menus, etc)
     */
    gameLoop = new Loop(PHYSICS_FPS,
        /**
         * Physics Tick
         */
        interval => {
            const {data, world} = this;

            // PHASE: Input/AI
            ControlPlayer(data, world, interval);
            StalacfiteThink(data, world, interval);
            world.level.tick(data, world, interval);

            // PHASE: Update
            DumbMotion(data, interval);

            // PHASE: React
            FindCollisions(data, 50, (className, source, target) => {
                BulletCollide(data, className, source, target);
                PlayerCollide(data, className, source, target);
            });

            // PHASE: reaping
            CheckHp(data, world);
            ReapBullets(data, world);
        },
        /**
         * Drawing Tick
         */
        dt => {
            const drawSet = new DrawSet();
            this.cx.fillStyle = "#333";
            this.cx.fillRect(0, 0, this.world.width, this.world.height);

            const {data, world: {phase}} = this;
            RunRenderBounds(data, drawSet);
            RunRenderSprites(data, drawSet);
            this.world.drawDebug(drawSet, "#f00");

            drawSet.draw(this.cx, dt);
            if(phase == GamePhase.WON) {
                SPLASH_SHEET.render(this.cx, 0);
            }
        });

    constructor(public canvas: HTMLCanvasElement, public cx: CanvasRenderingContext2D, public keys: KeyControl) {
        SpawnPlayer(this.data, this.world);
        this.gameLoop.start();
        this.keys.setHandler(this.world.playerInput);
        this.keys.focus();
    }
}
