import { Game } from "Applet/Init";
import { KeyControl, KeyHandler } from "Applet/Keyboard";
import { Loop } from "Applet/Loop";
import { DrawSet, Layer } from "Applet/Render";
import { FindCollisions } from "Ecs/Collision";
import { DumbMotion } from "Ecs/Location";
import { RunRenderBounds } from "Ecs/RenderBounds";
import { Data, World } from "Game/GameComponents";

const PHYSICS_FPS = 16;

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
            DumbMotion(this.data, interval);

            FindCollisions(this.data, 50).forEach(({className}) => {
                switch(className) {
                }
            });
        },
        /**
         * Drawing Tick
         */
        dt => {
            const drawSet = new DrawSet();
            this.cx.fillStyle = "#333";
            this.cx.fillRect(0, 0, this.world.width, this.world.height);

            RunRenderBounds(this.data, drawSet);

            drawSet.draw(this.cx, dt);
        });

    constructor(public canvas: HTMLCanvasElement, public cx: CanvasRenderingContext2D, public keys: KeyControl) {
        this.gameLoop.start();
    }
}
