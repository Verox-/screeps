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
        else {
            if(creep.transfer(Game.spawns['Seed'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Seed']);
                creep.say("🚗🏠");
            }
        }
    }
};

module.exports = roleWorker;