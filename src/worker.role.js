module.exports = {

    config: {
        levels: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, MOVE]
        ],
    },

    init: function (creep, role, level) {
        creep.memory.role = "miner";
        creep.memory.level = 1;
        creep.memory.eating = false;
    },

    /** @param {Creep} creep **/
    run: function(parameters) {
        var creep = parameters.creep;


        if(creep.carry.energy <= 0 || creep.memory.eating) {
            var sources = creep.room.find(FIND_SOURCES);
            var harvestResult = creep.harvest(sources[0]);
            if(harvestResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("MH");
            }
            else if (creep.carry >= creep.carryCapacity)
            {
                creep.memory.eating = false;
            }
            else if (harvestResult === OK) {
                creep.say("HH");
                creep.memory.eating = true;
            }
            console.log
        }
        else if (Game.spawns['Seed'].energy >= Game.spawns['Seed'].energyCapacity) {
            if(creep.upgradeController(Game.spawns['Seed'].room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Seed'].room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("MU");
            }
        }
        else if (creep.transfer(Game.spawns['Seed'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Seed'], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("MS✔");
        }
        else {
            creep.say("😵");
        }
    },

    checkDroppedResource: function () {

    }
};