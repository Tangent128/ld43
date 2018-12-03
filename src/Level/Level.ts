import { Id, Join } from "Ecs/Data";
import { Data, World, Teams, GamePhase } from "Game/GameComponents";

type Spawner = (data: Data, world: World, x: number) => Id;

interface Wave {
    pattern: Pattern;
    cooldown: number;
}

export class Level {
    waves: Wave[] = [];
    wave = 0;
    cooldown = 0;

    addWave(pattern: Pattern, delay: number) {
        this.waves.push({
            pattern,
            cooldown: delay
        });
    }

    tick(data: Data, world: World, interval: number) {
        const fieldClear = Join(data, "hp")
            .filter(([id, {team}]) => team == Teams.ENEMY)
            .length == 0;

        if(this.cooldown > 0) {
            this.cooldown = Math.max(this.cooldown - interval, 0);
        } else if(this.wave < this.waves.length) {
            const wave = this.waves[this.wave];

            this.cooldown = wave.cooldown;
            wave.pattern.spawn(data, world);

            this.wave++;
        } else if(fieldClear && world.phase == GamePhase.PLAYING) {
            world.phase = GamePhase.WON;
        }
    }
}

interface Pattern {
    spawn(data: Data, world: World): void;
}

export class EvenPattern implements Pattern {
    spawners: Spawner[];

    constructor(
        public minSpacing: number,
        ...spawners: Spawner[]
    ) {
        this.spawners = spawners;
    }

    spawn(data: Data, world: World) {
        const maxWidth = world.width - this.minSpacing;
        const minWidth = this.minSpacing * this.spawners.length;

        const width = minWidth + Math.random() * (maxWidth - minWidth);
        let x = (this.minSpacing / 2) + (Math.random() * (maxWidth - width));
        const advance = width / this.spawners.length;

        for(const spawner of this.spawners) {
            spawner(data, world, x);
            x += advance;
        }
    }
}

export class CenterPattern implements Pattern {
    spawners: Spawner[];

    constructor(
        public spacing: number,
        ...spawners: Spawner[]
    ) {
        this.spawners = spawners;
    }

    spawn(data: Data, world: World) {
        const width = this.spacing * this.spawners.length;

        let x = (this.spacing + world.width - width)/2;
        const advance = width / this.spawners.length;

        for(const spawner of this.spawners) {
            spawner(data, world, x);
            x += advance;
        }
    }
}
