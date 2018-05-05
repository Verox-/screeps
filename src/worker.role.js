module.exports = {

    config: {
        levels: [
            [WORK, CARRY, MOVE],
            [WORK, WORK, CARRY, MOVE]
        ],
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

        switch (creep.memory.role) {
            case "builder":
                this.thinkBuilder(creep);
                break;
            case "miner":
                this.thinkMiner(creep);
                break;
            default:
                creep.say("\u{1F92A} UNK ROLE");
        }
    },

    thinkMiner: function (creep) {
        if (creep.memory.eating === undefined)
        {
            creep.memory.eating = false;
        }
        if (Game.spawns['Seed'].room.controller.ticksToDowngrade < 1000 && creep.carry.energy > 45) {
            if(creep.upgradeController(Game.spawns['Seed'].room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Seed'].room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("MU");
            }
        }
        else if(creep.carry.energy <= 0 || creep.memory.eating) {
            var sources = creep.room.find(FIND_SOURCES);
            var harvestResult = creep.harvest(sources[0]);
            if(harvestResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("\u{1F697}\u{26A1}");
            }
            else if (_.sum(creep.carry) >= creep.carryCapacity)
            {
                creep.memory.eating = false;
            }
            else if (harvestResult === OK) {
                creep.say("\u{1F50C}\u{26A1}");
                creep.memory.eating = true;
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
            creep.say("\u{1F601}");
        }
    },

    thinkBuilder: function (creep) {
        if (_.filter(Game.creeps, (creep) => creep.memory.role === 'miner').length < Memory.minerCapacity) return;

        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('ð');
        }
        if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('\u{1F528}');
        }

        if(creep.memory.working) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
            });

            if (sources[0].energy < 100) return;

            if(creep.withdraw(sources[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    },


};