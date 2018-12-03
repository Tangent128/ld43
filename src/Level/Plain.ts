import { Level, EvenPattern, CenterPattern } from "./Level";
import { SpawnStalacfite, SpawnStalacfiteDx } from "Game/Enemy/Stalacfite";
import { SpawnSwooparang } from "Game/Enemy/Swooparang";

export class PlainLevel extends Level {
    constructor() {
        super();
        this.addWave(new CenterPattern(100, SpawnSwooparang), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparang, SpawnSwooparang), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparang, SpawnSwooparang, SpawnSwooparang), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparang, SpawnSwooparang), 2);
        this.addWave(new EvenPattern(100, SpawnSwooparang, SpawnSwooparang), 2);
        this.addWave(new EvenPattern(100, SpawnSwooparang, SpawnSwooparang), 2);
        this.addWave(new EvenPattern(100, SpawnSwooparang, SpawnSwooparang, SpawnSwooparang, SpawnSwooparang), 2);
    }
}
