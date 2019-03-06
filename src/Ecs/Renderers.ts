import { Data } from "./Components";
import { Join } from "./Data";
import { TransformCx } from "./Location";
import { DrawSet, Layer } from "../Applet/Render";

export function RunRenderBounds(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "renderBounds", "location", "bounds").map(
        ([id, {color, layer}, location, {points}]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            cx.fillStyle = color;
            cx.beginPath();
            for(let i = 0; i < points.length; i += 2) {
                cx.lineTo(points[i], points[i+1]);
            }
            cx.fill("nonzero");
        }))
    );
}

export function RunRenderSprites(data: Data, drawSet: DrawSet) {
    drawSet.queue(...Join(data, "renderSprite", "location").map(
        ([id, {sheet, layer, index, offsetX, offsetY}, location]) => layer.toRender((cx, dt) => {
            TransformCx(cx, location, dt);
            sheet.render(cx, index, offsetX, offsetY);
        }))
    );
}

export function DrawDebug(debug: Record<string, any>, drawSet: DrawSet, layer: Layer, width: number, color: string) {
    drawSet.queue(layer.toRender((cx, dt) => {
        cx.font = "12px monospace";
        cx.fillStyle = color;
        let y = 12;
        for(const label in debug) {
            cx.textAlign = "left";
            cx.textBaseline = "middle";
            cx.fillText(`${label}: ${JSON.stringify(debug[label])}`, 0, y, width);
            y += 14;
        }
    }));
}
