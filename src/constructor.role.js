module.exports = {

    config: {
        base: [WORK, CARRY, MOVE],
        pattern: [WORK, CARRY, MOVE],
        role: "constructor",
    },

    init: function (creep, role, level) {
        if (creep.memory.role === undefined)
        {
            console.log("Setting uninitialized role.");
            creep.memory.role = role;
        }

        creep.memory.level = level;
        creep.memory.eating = false;

        console.log("Initialized a new creep.");
    },

    /** @param {Creep} creep **/
    run: function(parameters) {
        this.think(parameters.creep);
    },

    think: function (creep) {
        if (Game.spawns['Seed'].room.controller.ticksToDowngrade < 4000) {
            if (_.sum(creep.carry) < creep.carryCapacity)
                this.collectResource(creep);
            else if(creep.upgradeController(Game.spawns['Seed'].room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Seed'].room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("MU");
            }
        }
        else {
            creep.say("\u{1F634}");
        }

    },

    collectResource: function (creep) {
        if(creep.withdraw(Game.spawns['Seed'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Seed'], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("MU");
        }
    }

};