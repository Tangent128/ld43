import { Level, EvenPattern } from "./Level";
import { SpawnStalacfite } from "Game/Enemy/Stalacfite";

export class CaveLevel extends Level {
    constructor() {
        super();
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 0);
    }
}
