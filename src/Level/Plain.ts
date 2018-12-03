import { Level, EvenPattern, CenterPattern } from "./Level";
import { SpawnStalacfite, SpawnStalacfiteDx } from "Game/Enemy/Stalacfite";
import { SpawnSwooparang, SpawnSwooparangDx } from "Game/Enemy/Swooparang";
import { RGB } from "Game/GameComponents";
import { SpawnMessage } from "Game/Message";

export class PlainLevel extends Level {
    bgColor = [220, 154, 105] as RGB;
    constructor(nextLevel?: Level) {
        super(nextLevel);
        this.addWave(new CenterPattern(40, SpawnMessage("#ff0", "Welcome to The Plains")), 1);
        this.addWave(new CenterPattern(40, SpawnMessage("#f00", "Beware of Swooparangs")), 3);
        this.addWave(new CenterPattern(100, SpawnSwooparang), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparang, SpawnSwooparang), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparang, SpawnSwooparang, SpawnSwooparang), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparang, SpawnSwooparang), 2);
        this.addWave(new EvenPattern(100, SpawnSwooparang, SpawnSwooparang), 2);
        this.addWave(new EvenPattern(100, SpawnSwooparang, SpawnSwooparang), 2);
        this.addWave(new EvenPattern(100, SpawnSwooparang, SpawnSwooparang, SpawnSwooparang, SpawnSwooparang), 6);
        this.addWave(new EvenPattern(100, SpawnSwooparangDx), 6);
    }
}
