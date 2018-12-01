import { Join, Remove } from "Ecs/Data";
import { Data, World } from "Game/GameComponents";

export function CheckHp(data: Data, world: World) {
    Join(data, "hp").forEach(([id, hp]) => {
        if(hp.hp <= 0) {
            Remove(data, id);
        }
    });
}
