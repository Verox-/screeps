import { ErrorMapper } from "utils/ErrorMapper";

import "prototypes/StructureSpawn";
import "prototypes/Creep";

import { FactoryController } from "controllers/FactoryController";
import { CreepController } from "controllers/CreepController";
import { TowerController } from "controllers/TowerController";



let factories = new FactoryController().init();
let creeps = new CreepController().init();
let towers = new TowerController().init();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    if (towers)
        towers.run();


    if (factories)
        factories.run();
    else
    {
        console.log("Factory controller was not initialized!")
        factories = new FactoryController().init();
    }

    if (creeps)
        creeps.run();




    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
    }
}
});
