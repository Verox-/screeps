module.exports = {

    config: {
        base: [MOVE, CARRY],
        pattern: [CARRY, MOVE],
        role: "ferry",
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
        let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

        if(_.sum(creep.carry) < creep.carryCapacity) {
            let pickupResult = creep.pickup(resource);
            if(pickupResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(resource,{visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("\u{1F697}\u{26A1}");
            }
            else {
                creep.say(pickupResult);
            }
        }
        else if (Game.spawns['Seed'].energy >= Game.spawns['Seed'].energyCapacity) {
            if(creep.upgradeController(Game.spawns['Seed'].room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Seed'].room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("MU");
            }
        }
        else if (creep.transfer(Game.spawns['Seed'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Seed'], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{1F3E0}");
        }
        else {
            creep.say("???");
        }
    },

};