import { RoleMiner } from "roles/Miner";
import { RoleFerry } from "roles/Ferry";
import { RoleConstructor } from "../roles/Constructor";

type CreepTypes = {
    [key: string]: any;
    miner: RoleMiner,
    ferry: RoleFerry,
}

export class TowerController {

    init(): TowerController | null {
        this.initMemory();
        console.log("Initializing TowerController memory");
        return this;
    }

    run() {
        if (Memory.thinking === false) return;

        this.processTick();
    }

    initMemory() {

    }

    processTick() {
        let towers: StructureTower[] = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER) as StructureTower[];

        towers.forEach((tower) => {
            if(tower) {
                let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if(closestHostile) {
                    tower.attack(closestHostile);
                }
                let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER) || structure.hits < (structure.hitsMax*0.0003)
                });

                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }

            }
        })
    }

    public static getRoleConfig (role: string) {

    }
};

Creep.prototype.task = null;