import { Game } from "../Applet/Init";
import { KeyControl } from "../Applet/Keyboard";
import { Loop } from "../Applet/Loop";
import { DrawSet } from "../Applet/Render";
import { FindCollisions } from "../Ecs/Collision";
import { DumbMotion } from "../Ecs/Location";
import { RunRenderBounds, RunRenderSprites, DrawDebug } from "../Ecs/Renderers";
import { CheckHp, CheckLifetime, SmokeDamage, SelfDestructMinions, StripWeapon } from "./Death";
import { Data, World, GamePhase, SPLASH_SHEET } from "./GameComponents";
import { ControlPlayer, PlayerCollide, RespawnPlayer } from "./Player";
import { ReapBullets, BulletCollide } from "./Weapons";
import { StalacfiteThink } from "./Enemy/Stalacfite";
import { SwooparangThink, CollapseCollide } from "./Enemy/Swooparang";
import { CaveLevel } from "../Level/Cave";
import { PlainLevel } from "../Level/Plain";
import { ArrangeMessages, ReapMessages, RenderMessages } from "./Message";
import { TitleScreen } from "../Level/Title";
import { CollapseLevel } from "../Level/Collapse";

const PHYSICS_FPS = 40;

@Game("#Shooter")
export class Shooter {
    world = new World(new TitleScreen());
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

            // PHASE: set/reset game
            if(this.world.playerInput.startGame) {
                if(this.world.phase == GamePhase.TITLE) {
                    this.world.phase = GamePhase.PLAYING;
                } else {
                    this.reset();
                }
                this.world.playerInput.startGame = false;
            }

            // PHASE: Spawn
            RespawnPlayer(data, world, interval);
            world.level.tick(data, world, interval);

            // PHASE: Input/AI
            ControlPlayer(data, world, interval);
            StalacfiteThink(data, world, interval);
            SwooparangThink(data, world, interval);
            ArrangeMessages(data, world, interval);

            // PHASE: Update
            DumbMotion(data, interval);

            // PHASE: Detect
            FindCollisions(data, 50, (className, source, target) => {
                BulletCollide(world, data, className, source, target);
                PlayerCollide(data, className, source, target);
                CollapseCollide(data, className, source, target);
            });

            // PHASE: React
            SmokeDamage(data, world);
            SelfDestructMinions(data, world);
            StripWeapon(data, world);

            // PHASE: Reaping
            CheckHp(data, world);
            ReapBullets(data, world);
            ReapMessages(data, world);
            CheckLifetime(data, world, interval);
        },
        /**
         * Drawing Tick
         */
        dt => {
            const {data, world: {phase, bgColor: [red, green, blue], debug, hudLayer, width}} = this;

            const drawSet = new DrawSet();
            this.cx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            this.cx.fillRect(0, 0, this.world.width, this.world.height);

            RunRenderBounds(data, drawSet);
            RunRenderSprites(data, drawSet);
            RenderMessages(data, drawSet);
            //DrawDebug(debug, drawSet, hudLayer, width, "#f00");
            this.world.drawHud(drawSet);

            drawSet.draw(this.cx, dt);
            if(phase == GamePhase.WON) {
                //SPLASH_SHEET.render(this.cx, 0);
            } else if(phase == GamePhase.LOST) {
                //SPLASH_SHEET.render(this.cx, 1);
            }

        });

    constructor(public canvas: HTMLCanvasElement, public cx: CanvasRenderingContext2D, public keys: KeyControl) {
        this.gameLoop.start();
        this.keys.focus();
        this.reset();
    }

    reset() {
        this.world = new World(new TitleScreen(new CaveLevel(new PlainLevel(new CollapseLevel()))));
        //this.world = new World(new CaveLevel());
        //this.world = new World(new PlainLevel());
        //this.world = new World(new CollapseLevel());
        this.data = new Data();
        this.keys.setHandler(this.world.playerInput);
    }
}
