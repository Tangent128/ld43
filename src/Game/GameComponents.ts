import { Layer } from "Applet/Render";
import { Store } from "Ecs/Data";
import { Data as EcsData } from "Ecs/Components";

export class World {
    width = 500;
    height = 400;

    /*
     * Drawing Layers
     */
    groundLayer = new Layer(0);
    cloudLayer = new Layer(1);
    debugLayer = new Layer(2);
    bulletLayer = new Layer(10);
    shipLayer = new Layer(15);
    hudLayer = new Layer(20);

}

export class Data extends EcsData {
}
