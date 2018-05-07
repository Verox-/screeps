module.exports = {

    config: {
        baseParts: [WORK, CARRY, MOVE],
        pattern: [WORK, WORK, MOVE],
        role: "miner",
    },

    init: function (creep, role, level) {
        if (creep.memory.role === undefined)
        {
            console.log("Setting uninitialized role.");
            creep.memory.role = role;
        }

        console.log("Initialized a new creep.");
    },

    /** @param {Creep} creep **/
    run: function(parameters) {
        this.think(parameters.creep);
    },

    think: function (creep) {
        if (_.sum(creep.carry) >= creep.carryCapacity)
        {
            this.deposit(creep);
            return;
        }

        this.mine(creep);

        if (creep.memory.targetContainer)
            this.repairContainer(creep);
    },

    mine: function (creep) {
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
            creep.say(harvestResult);
        }
    },

    deposit: function (creep) {
        // If the target container is undefined, search for one.
        if (creep.memory.targetContainer === undefined) {
            this.findContainer(creep);
        }

        // If there's no container just drop the resource on the ground.
        if (creep.memory.targetContainer === false) {
            creep.drop(RESOURCE_ENERGY);
        }
        else { // Otherwise, deposit it in the container.
            let container = Game.getObjectById(creep.memory.targetContainer);
            creep.transfer(container, RESOURCE_ENERGY);
        }

        // Rescan for a supply container every 100 ticks.
        if (Game.time % 100 && creep.memory.targetContainer === false)
        {
            delete creep.memory.targetContainer;
            this.findContainer(creep);
        }

    },

    repairContainer: function (creep) {
        try {
            let container = Game.getObjectById(creep.memory.targetContainer);
            if (container.hits < container.hitsMax / 10)
                creep.repair(container)
        }
        catch (ex) {

        }
    },

    findContainer: function (creep) {
        const containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: { structureType: STRUCTURE_CONTAINER }});
        creep.memory.targetContainer = containers.length <= 0 ? false : containers[0].id;
    }

};