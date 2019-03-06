import { Level, EvenPattern, CenterPattern } from "./Level";
import { SpawnStalacfite, SpawnStalacfiteDx } from "../Game/Enemy/Stalacfite";
import { SpawnSwooparang, SpawnSwooparangDx, SpawnSwooparangCollapse } from "../Game/Enemy/Swooparang";
import { RGB } from "../Game/GameComponents";
import { SpawnMessage } from "../Game/Message";

export class CollapseLevel extends Level {
    bgColor = [0, 0, 0] as RGB;
    constructor(nextLevel?: Level) {
        super(nextLevel);
        this.addWave(new CenterPattern(40, SpawnMessage("#f80", "ALERT!!!")), 1);
        this.addWave(new CenterPattern(40, SpawnMessage("#f80", "Welcome to The Collapse")), 1);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 1);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 2);
        this.addWave(new CenterPattern(100, SpawnSwooparangCollapse), -1);
        this.addWave(new CenterPattern(100, SpawnSwooparangCollapse, SpawnSwooparangCollapse), -1);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 1);
        this.addWave(new EvenPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 1);
        this.addWave(new CenterPattern(40, SpawnStalacfite, SpawnStalacfite, SpawnStalacfite), 1);
    }
}
