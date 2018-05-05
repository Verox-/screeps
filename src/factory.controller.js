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
            // Only evaluate the requirements every 50th tick.
            if (Game.time % 50) this.evaluateRequirements(Game.spawns[i]);

            // Process this spawn's SQ.
            this.processSpawnQueue(Game.spawns[i]);
        }
    },

    // Evaluates the requirements for this room to function.
    evaluateRequirements: function (spawn) {

        // THIS IS RIDICULOUS
        let liveMiners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner').length;
        let liveFerries = _.filter(Game.creeps, (creep) => creep.memory.role === 'ferry').length;
        let liveConstructors = _.filter(Game.creeps, (creep) => creep.memory.role === 'constructor').length;
        let queuedMiners = 0;
        let queuedFerries = 0;
        let queuedConstructors = 0;

        if (spawn.memory.spawnQueue !== undefined) {
            queuedMiners = spawn.memory.spawnQueue.filter(function(item){ return item === "miner"; }).length;
            queuedFerries = spawn.memory.spawnQueue.filter(function(item){ return item === "ferry"; }).length;
            queuedConstructors = spawn.memory.spawnQueue.filter(function(item){ return item === "constructor"; }).length;
        }

        if ((liveMiners + queuedMiners) < Memory.minerCapacity)
            spawn.EnqueueSpawn("miner");

        else if ((liveFerries + queuedFerries) < Memory.ferryCapacity)
            spawn.EnqueueSpawn("ferry");

        else if ((liveConstructors + queuedConstructors) < Memory.constructorCapacity)
            spawn.EnqueueSpawn("constructor");
    },

    processSpawnQueue: function(spawn) {
        // Loop the spawns
        if (spawn.spawning || Object.keys(Game.creeps).length >= Memory.creepCapacity) return;

        if (spawn.memory.spawnQueue === undefined) return;

        let spawnQueue = spawn.memory.spawnQueue;
        if (spawnQueue.length === 0)
        {
            delete spawn.memory.spawnQueue;
            return;
        }

        if (spawn.room.energyAvailable < 300) return;

        let spawnRole = spawnQueue.shift();
        this.spawnCreep(spawn, spawnRole);

        // return;

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

StructureSpawn.prototype.EnqueueSpawn = function(role) {
    if (!Array.isArray(this.memory.spawnQueue))
        this.memory.spawnQueue = [];

    this.memory.spawnQueue.push(role);
};

StructureSpawn.prototype.HasQueue = function() {
    if (this.memory.spawnQueue === undefined || this.memory.spawnQueue.length === 0)
        return false;
};