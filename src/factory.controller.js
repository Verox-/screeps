module.exports = {

    init: function () {
        if (Memory.factoryIsInitialized === true)
            return;

        console.log("Initializing worker memory");

        this.initMemory();
    },

    run: function () {
        this.processTick();
    },

    initMemory: function () {
        Memory.creepCapacity = 8;
        Memory.minerCapacity = 1;
        Memory.ferryCapacity = 2;
        Memory.constructorCapacity = 1;

        Memory.factories = {};

        Memory.factoryIsInitialized = true;
    },

    processTick: function () {
        for (let i in Game.spawns) {
            let spawn = Game.spawns[i];

            if (spawn.spawning || Object.keys(Game.creeps).length >= Memory.creepCapacity) return;

            if (_.filter(Game.creeps, (creep) => creep.memory.role === 'miner').length < Memory.minerCapacity)
                this.spawnCreep(spawn, "miner");

            else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'ferry').length < Memory.ferryCapacity)
                this.spawnCreep(spawn, "ferry");

            else if (_.filter(Game.creeps, (creep) => creep.memory.role === 'constructor').length < Memory.constructorCapacity)
                this.spawnCreep(spawn, "constructor");
        }
    },

    spawnCreep: function (spawn, role) {
        let name = Math.random().toString(36).substring(7);

        switch (role) {
            case "ferry":
                spawn.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], name, {role: role});
                break;
            case "miner":
                spawn.createCreep([WORK, WORK, CARRY, MOVE], name, {role: role});
                break;
            case "constructor":
                spawn.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], name, {role: role});
                break;
        }
    }
};