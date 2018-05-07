module.exports = {

    config: {
        baseParts: [MOVE, CARRY],
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

        if (this.collect(creep))
            this.deposit(creep);

    },

    collect: function (creep) {

        if (!this.collectDropped(creep))
            this.collectContainer(creep);

        return _.sum(creep.carry) >= creep.carryCapacity;

        // if (resource === null) return false;
        //
        // if(_.sum(creep.carry) < creep.carryCapacity)
        // {
        //     let pickupResult = creep.pickup(resource);
        //     if(pickupResult === ERR_NOT_IN_RANGE) {
        //         creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
        //         creep.say("\u{1F697}\u{26A1}");
        //     }
        //     else {
        //         creep.say(pickupResult);
        //     }
        //
        //     return true;
        // }
        // else // The creep is full.
        //     return false;

    },

    /**
     * Finds dropped resources in this room and tries to pick them up.
     * @param creep Reference to the creep
     * @returns {boolean} TRUE if pick up success
     */
    collectDropped: function (creep) {
        let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (resource === null) return false;

        if(_.sum(creep.carry) < creep.carryCapacity)
        {
            let pickupResult = creep.pickup(resource);

            if (pickupResult === OK)
                return true;
            else if(pickupResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("\u{1F697}\u{26A1}");
            }
            else {
                creep.say(pickupResult);
            }
        }


        return false;
    },

    collectContainer: function (creep) {
        let resource = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER}
        });
        if (resource === null) return false;

        if(_.sum(creep.carry) < creep.carryCapacity)
        {
            let withdrawResult = creep.withdraw(resource, RESOURCE_ENERGY);

            if (withdrawResult === OK)
                return true;
            else if(withdrawResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("\u{1F697}\u{26A1}");
            }
            else {
                creep.say(withdrawResult);
            }
        }


        return false;
    },

    deposit: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (targets.length <= 0) return;

        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{1F3E0}");
        }
    }

};