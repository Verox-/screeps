var roleWorker = {

    init: function () {
        memory.role = "worker";
    },

    /** @param {Creep} creep **/
    run: function(parameters) {
        var creep = parameters.creep;
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            var harvestResult = creep.harvest(sources[0]);
            if(harvestResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                creep.say("🔄 harvest");
            }
            else if (harvestResult === OK) {
                creep.say("🔄 harvest!!");
            }
        }
        else if (Game.spawns['Seed'].energy >= Game.spawns['Seed'].energyCapacity) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("🔄");
            }
        }
    }
};

module.exports = roleWorker;