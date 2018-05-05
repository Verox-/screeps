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

        if(_.sum(creep.carry) < creep.carryCapacity) {
            this.collect(creep);
        }
        else {
            this.deposit(creep);
        }
    },

    collect: function (creep) {
        let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (resource === null) return;

        let pickupResult = creep.pickup(resource);
        if(pickupResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{26A1}");
        }
        else {
            creep.say(pickupResult);
        }
    },

    deposit: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (targets.length <= 0) return;

        if (creep.deposit(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{1F3E0}");
        }
    }

};