var creepC = require("creep.controller");

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

        if (spawn.room.energyAvailable < spawn.room.energyCapacityAvailable && !spawn.memory.blocked)
        {
            spawn.memory.blocked = Game.time;
            return;
        }
        else if (spawn.room.energyAvailable > 300 && (Game.time - spawn.memory.blocked) < 120) {
            if (!(Game.time % 20)) console.log("Spawn blocked for " + (Game.time - spawn.memory.blocked) + "T");
            return;
        }

        let spawnRole = spawnQueue.shift();
        this.spawnCreep(spawn, spawnRole);
    },

    spawnCreep: function (spawn, role) {
        let name = Math.random().toString(36).substring(7);
        let parts = this.calculateRoleParts(spawn, role)

        console.log("Spawning creep with [" + parts.toString() + "].");
        spawn.createCreep(parts, name, {role: role});

        // switch (role) {
        //     case "ferry":
        //         spawn.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], name, {role: role});
        //         break;
        //     case "miner":
        //         spawn.createCreep([WORK, WORK, CARRY, MOVE], name, {role: role});
        //         break;
        //     case "constructor":
        //         spawn.createCreep([WORK, CARRY, CARRY, MOVE, MOVE], name, {role: role});
        //         break;
        // }
    },

    calculateRoleParts: function (spawn, role) {
        let roleConfig = creepC.getRoleConfig(role);
        let maxSpawnEnergy = spawn.room.energyCapacityAvailable;

        let roleParts = roleConfig.baseParts;
        let patternIndex = 0;
        while (this.calculatePartsCost(roleParts) <= maxSpawnEnergy) {
            if (patternIndex > roleConfig.pattern.length - 1) patternIndex = 0;

            roleParts.push(roleConfig.pattern[patternIndex]);

            patternIndex++;
        }

        roleParts.pop(); // Get rid of the last element to bring it below max. Dirty fix.
        return roleParts;
    },

    calculatePartsCost: function (parts) {

        let cost = 0;
        for (let i in parts) {
            cost += BODYPART_COST[parts[i]];
        }

        return cost;
    }
};

StructureSpawn.prototype.EnqueueSpawn = function(role) {
    if (!Array.isArray(this.memory.spawnQueue))
        this.memory.spawnQueue = [];

    this.memory.spawnQueue.push(role);
};

/**
 * @return {boolean}
 */
StructureSpawn.prototype.HasQueue = function() {
    return !(this.memory.spawnQueue === undefined || this.memory.spawnQueue.length === 0);
};