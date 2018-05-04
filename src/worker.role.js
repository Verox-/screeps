var roleWorker = {

    init: function () {
        memory.archtype = "worker";
        memory.role = "miner";
        memory.level = 1;
    },

    /** @param {Creep} creep **/
    run: function(parameters) {
        var creep = parameters.creep;
        if(creep.carry.energy <= 0) {
            var sources = creep.room.find(FIND_SOURCES);
            var harvestResult = creep.harvest(sources[0]);
            if(harvestResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                creep.say("MH");
            }
            else if (harvestResult === OK) {
                creep.say("HH");
            }
        }
        else if (Game.spawns['Seed'].energy >= Game.spawns['Seed'].energyCapacity) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("MU");
            }
        }
        else if (creep.transfer(Game.spawns['Seed'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Seed']);
        }
        else {
            creep.say("I don't know what to do!");
        }
    }
};

module.exports = roleWorker;