import { Level, EvenPattern } from "./Level";
import { SpawnStalacfite } from "Game/Enemy/Stalacfite";

export class CaveLevel extends Level {
    constructor() {
        super();
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 5);
        this.addWave(new EvenPattern(100, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(50, SpawnStalacfite, SpawnStalacfite), 1);
        this.addWave(new EvenPattern(60, SpawnStalacfite, SpawnStalacfite), 1);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 2);
    }
}
