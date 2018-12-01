import { KeyHandler, KeyName } from "Applet/Keyboard";

export class PlayerControl implements KeyHandler {
    dx = 0;
    dy = 0;
    firing = false;
    weaponCycle = false;

    press(key: KeyName) {
        switch(key) {
            case "up":
                this.dy = -1;
                break;
            case "down":
                this.dy = 1;
                break;
            case "left":
                this.dx = -1;
                break;
            case "right":
                this.dx = 1;
                break;
            case "a":
                this.firing = true;
                break;
            case "b":
                this.weaponCycle = true;
                break;
        }
    }

    release(key: KeyName) {
        switch(key) {
            case "up":
                this.dy = Math.max(this.dy, 0);
                break;
            case "down":
                this.dy = Math.min(this.dy, 0);
                break;
            case "left":
                this.dx = Math.max(this.dx, 0);
                break;
            case "right":
                this.dx = Math.min(this.dx, 0);
                break;
            case "a":
                this.firing = false;
                break;
        }
    }

    block() {
        this.dx = 0;
        this.dy = 0;
        this.firing = false;
        this.weaponCycle = false;
    }
}
