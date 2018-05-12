import { RoleMiner } from "roles/Miner";
import { RoleFerry } from "roles/Ferry";
import { RoleConstructor } from "../roles/Constructor";

type CreepTypes = {
    [key: string]: any;
    miner: RoleMiner,
    ferry: RoleFerry,
}

export class CreepController {

    public static creepRole: CreepTypes = {
        miner: new RoleMiner(),
        ferry: new RoleFerry(),
        constructor: new RoleConstructor(),
    };

    init(): CreepController | null {
        this.initMemory();
        console.log("Initializing creepController memory");
        return this;
    }

    run() {
        if (Memory.thinking === false) return;

        this.processTick();
    }

    initMemory() {

    }

    processTick() {
        for (let i in Game.creeps) {
            let creep = Game.creeps[i];

            if (creep.memory.role !== undefined && CreepController.creepRole[creep.memory.role] !== undefined)
                CreepController.creepRole[creep.memory.role].run(creep);
            else
                console.log("Undefined creep role " + creep.memory.role + " on creep " + creep.name + "."); // TODO Perhaps try and resolve the role?

            //creep.run({creep: creep});
        }
    }

    public static getRoleConfig (role: string) {
        if (CreepController.creepRole[role] === undefined)
        {
            console.log("Failed to spawn: unknown role " + role);
            return null;
        }
        return CreepController.creepRole[role].config;
    }
};

Creep.prototype.task = null;