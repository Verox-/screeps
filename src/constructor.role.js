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
        // Stop construction if we're pending a build.
        if (Game.spawns['Seed'].HasQueue()) return;

        // Override the constructor's task list and upgrade the controller if it's low..
        if (Game.spawns['Seed'].room.controller.ticksToDowngrade < 4000) {
            this.upgrade(creep);
        }
        else {
            this.build(creep);
        }
    },

    collectResource: function (creep) {
        if(creep.withdraw(Game.spawns['Seed'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Seed'], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("MU");
        }
    },

    upgrade: function (creep) {
        if (_.sum(creep.carry) < creep.carryCapacity && !creep.memory.working)
            this.collectResource(creep);
        else if(creep.upgradeController(Game.spawns['Seed'].room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Seed'].room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F53A}");
            creep.memory.working = true;
        }
        else if (creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say("\u{1F37D}");
        }
    },

    build: function (creep) {
        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('ð');
        }
        if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('\u{1F528}');
        }

        if(creep.memory.working) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                this.upgrade(creep);
            }
        }
        else {
            // Halts all construction if a miner is required.
            if (_.filter(Game.creeps, (creep) => creep.memory.role === 'miner').length < Memory.minerCapacity) return;

            let sources = creep.room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
            });

            if (sources[0].energy < 100) return;

            if(creep.withdraw(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }

};