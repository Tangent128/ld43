import { Level, EvenPattern, CenterPattern } from "./Level";
import { SpawnStalacfite, SpawnStalacfiteDx } from "Game/Enemy/Stalacfite";
import { SpawnSwooparang, SpawnSwooparangDx } from "Game/Enemy/Swooparang";
import { RGB } from "Game/GameComponents";
import { SpawnMessage } from "Game/Message";

export class TitleScreen extends Level {
    bgColor = [50, 100, 128] as RGB;
    isTitleScreen = true;
    constructor(nextLevel?: Level) {
        super(nextLevel);
        this.addWave(new CenterPattern(40, SpawnMessage("#fff", "Controls:")), 0.2);
        this.addWave(new CenterPattern(40, SpawnMessage("#ccc", "Z or Space: Fire Weapon")), 0.2);
        this.addWave(new CenterPattern(40, SpawnMessage("#ccc", "X or Shift: Change Weapon")), 0.2);
        this.addWave(new CenterPattern(40, SpawnMessage("#cec", "C or Enter: Start/Restart Game")), 0.2);
        this.addWave(new CenterPattern(40, SpawnMessage("#ccc", "")), 0);
        this.addWave(new CenterPattern(40, SpawnMessage("#caa", "Defeating a boss sacrifices")), 0);
        this.addWave(new CenterPattern(40, SpawnMessage("#caa", "the weapon you beat it with")), 0.2);
    }
}
