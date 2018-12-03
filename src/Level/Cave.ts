import { Level, EvenPattern, CenterPattern } from "./Level";
import { SpawnStalacfite, SpawnStalacfiteDx } from "Game/Enemy/Stalacfite";
import { RGB } from "Game/GameComponents";

export class CaveLevel extends Level {
    bgColor = [48, 48, 64] as RGB;
    constructor(nextLevel?: Level) {
        super(nextLevel);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 5);
        this.addWave(new EvenPattern(100, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new EvenPattern(50, SpawnStalacfite, SpawnStalacfite), 1);
        this.addWave(new EvenPattern(60, SpawnStalacfite, SpawnStalacfite), 3);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 3);
        this.addWave(new EvenPattern(70, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 3);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 4);
        this.addWave(new CenterPattern(100, SpawnStalacfiteDx), 2);
    }
}
