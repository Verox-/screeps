export class RoleMiner implements Role {

    config: {
        role: string,
        baseParts: Array<BodyPartConstant>,
        pattern: Array<BodyPartConstant>
    };

    constructor() {
        this.config = {
            role: "miner",
            baseParts: [MOVE, WORK, CARRY],
            pattern: [WORK, WORK, MOVE]
        }
    }

    init(): void {

    }

    run(creep: Creep): void {
        this.think(creep);
    }

    think(creep: Creep) {
        if (_.sum(creep.carry) >= creep.carryCapacity)
        {
            this.deposit(creep);
            return;
        }

        this.mine(creep);

        if (creep.memory.targetContainer)
            this.repairContainer(creep);
    }

    mine(creep: Creep) {
        console.log(creep);
        let sources = creep.room.find(FIND_SOURCES);
        let harvestResult = creep.harvest(sources[0]);
        if(harvestResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{26A1}");
        }
        else if (harvestResult === OK) {
            // Do nothing!
        }
        else {
            creep.say(harvestResult.toString());
        }
    }

    deposit(creep: Creep) {
        // If the target container is undefined, search for one.
        if (creep.memory.targetContainer === undefined) {
            this.findContainer(creep);
        }

        // If there's no container just drop the resource on the ground.
        if (creep.memory.targetContainer === false) {
            creep.drop(RESOURCE_ENERGY);
        }
        else if (creep.memory.targetContainer) { // Otherwise, deposit it in the container.
            let container = Game.getObjectById<StructureContainer>(creep.memory.targetContainer.toString());

            if (container)
                creep.transfer(container, RESOURCE_ENERGY);
        }

        // Rescan for a supply container every 100 ticks.
        if (Game.time % 100 && creep.memory.targetContainer === false)
        {
            delete creep.memory.targetContainer;
            this.findContainer(creep);
        }

    }

    repairContainer(creep: Creep) {
        try {
            if (!creep.memory.targetContainer) return;

            let container = Game.getObjectById<StructureContainer>(creep.memory.targetContainer.toString());
            if (container && container.hits < container.hitsMax / 10)
                creep.repair(container)
        }
        catch (ex) {

        }
    }

    findContainer(creep: Creep) {
        const containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: { structureType: STRUCTURE_CONTAINER }});
        creep.memory.targetContainer = containers.length <= 0 ? false : containers[0].id;
    }

}