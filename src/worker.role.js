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
        this.think(parameters);
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

    },

    thinkBuilder: function (creep) {
        if (creep.memory.eating === undefined)
        {
            creep.memory.eating = false;
        }
        if(creep.carry.energy <= 0 || creep.memory.eating) {
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
            creep.say("MS✔");
        }
        else {
            creep.say("\u{1F601}");
        }
    },


};