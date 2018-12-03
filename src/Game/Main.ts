import { Game } from "Applet/Init";
import { KeyControl } from "Applet/Keyboard";
import { Loop } from "Applet/Loop";
import { DrawSet } from "Applet/Render";
import { FindCollisions } from "Ecs/Collision";
import { DumbMotion } from "Ecs/Location";
import { RunRenderBounds, RunRenderSprites } from "Ecs/Renderers";
import { CheckHp, CheckLifetime, SmokeDamage } from "Game/Death";
import { Data, World, GamePhase, SPLASH_SHEET } from "Game/GameComponents";
import { ControlPlayer, PlayerCollide, RespawnPlayer } from "Game/Player";
import { ReapBullets, BulletCollide } from "Game/Weapons";
import { StalacfiteThink } from "Game/Enemy/Stalacfite";
import { SwooparangThink } from "Game/Enemy/Swooparang";
import { CaveLevel } from "Level/Cave";
import { PlainLevel } from "Level/Plain";

const PHYSICS_FPS = 40;

@Game("#Shooter")
export class Shooter {
    world = new World(new PlainLevel());
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
            SwooparangThink(data, world, interval);
            world.level.tick(data, world, interval);

            // PHASE: Update
            DumbMotion(data, interval);

            // PHASE: React
            FindCollisions(data, 50, (className, source, target) => {
                BulletCollide(data, className, source, target);
                PlayerCollide(data, className, source, target);
            });
            SmokeDamage(data, world);

            // PHASE: reaping
            CheckHp(data, world);
            ReapBullets(data, world);
            CheckLifetime(data, world, interval);
            RespawnPlayer(data, world, interval);
        },
        /**
         * Drawing Tick
         */
        dt => {
            const {data, world: {phase, bgColor: [red, green, blue]}} = this;

            const drawSet = new DrawSet();
            this.cx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            this.cx.fillRect(0, 0, this.world.width, this.world.height);

            RunRenderBounds(data, drawSet);
            RunRenderSprites(data, drawSet);
            this.world.drawDebug(drawSet, "#f00");

            drawSet.draw(this.cx, dt);
            if(phase == GamePhase.WON) {
                SPLASH_SHEET.render(this.cx, 0);
            } else if(phase == GamePhase.LOST) {
                SPLASH_SHEET.render(this.cx, 1);
            }

        });

    constructor(public canvas: HTMLCanvasElement, public cx: CanvasRenderingContext2D, public keys: KeyControl) {
        this.gameLoop.start();
        this.keys.setHandler(this.world.playerInput);
        this.keys.focus();
    }
}
