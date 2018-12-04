import { Id, Create, Join, Remove } from "Ecs/Data";
import { Data, World, Message, GamePhase } from "./GameComponents";
import { Location } from "Ecs/Components";
import { DrawSet } from "Applet/Render";
import { TransformCx } from "Ecs/Location";

export function SpawnMessage(color: string, text: string) {
    return function(data: Data, world: World, x: number): Id {
        return Create(data, {
            location: new Location({
                X: -world.width,
                Y: world.height/2,
                VX: world.width
            }),
            message: new Message(world.cloudLayer, color, text)
        });
    }
}

const FONT_SIZE = 16;
const ADVANCE = 20;
export function ArrangeMessages(data: Data, world: World, interval: number) {
    const messages = Join(data, "message", "location");
    messages.sort(([{}, {timeout: timeoutA}, {}], [{}, {timeout: timeoutB}, {}]) => timeoutA - timeoutB);

    let y = world.height / 3;
    messages.forEach(([id, message, location]) => {
        message.targetY = y;
        y += ADVANCE;

        const delta = message.targetY - location.Y;
        if(Math.abs(delta) < 100 * interval) {
            location.Y = message.targetY;
            location.VY = 0;
        } else {
            location.VY = Math.sign(delta) * 100;
        }

        if(location.X >= world.width / 2 && message.timeout >= 0) {
            location.X = world.width / 2;
            message.timeout -= interval;
            location.VX = 0;
        } else if(world.phase == GamePhase.PLAYING) {
            location.VX = world.width;
        }
    });
}

export function ReapMessages(data: Data, {width, height, debug}: World) {
    let count = 0;
    Join(data, "message", "location").forEach(([id, message, {X, Y}]) => {
        count++;
        if(X > width * 2) {
            Remove(data, id);
        }
    });
}

export function RenderMessages(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "message", "location").map(
        ([id, {layer, color, message}, location]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            cx.font = `${FONT_SIZE}px monospace`;
            cx.fillStyle = color;
            cx.textAlign = "center";
            cx.textBaseline = "middle";
            cx.fillText(message, 0, 0);
        }))
    );
}
