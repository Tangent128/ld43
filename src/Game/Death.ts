import { PlaySfx } from "Applet/Audio";
import { Join, Remove, Lookup } from "Ecs/Data";
import { Data, World, BOOM_SOUND, BIG_BOOM_SOUND } from "Game/GameComponents";

export function CheckHp(data: Data, world: World) {
    Join(data, "hp").forEach(([id, hp]) => {
        if(hp.hp <= 0) {
            // determine death sound
            const [ship] = Lookup(data, id, "playerShip");
            if(ship != null) {
                PlaySfx(BIG_BOOM_SOUND);
            } else {
                PlaySfx(BOOM_SOUND);
            }

            // remove from game
            Remove(data, id);
        }
    });
}
