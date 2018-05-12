import { CreepController } from "controllers/CreepController";

export class FactoryController {

    public init(): FactoryController | null {
        console.log("Initializing worker memory");

        this.initMemory();

        return this;
    }

    public run() {
        this.processTick();
    }

    initMemory() {
        Memory.creepCapacity = 8;
        Memory.minerCapacity = 1;
        Memory.ferryCapacity = 2;
        Memory.constructorCapacity = 1;

        Memory.factories = {};

        Memory.factoryIsInitialized = true;
    }

    processTick() {
        for (let i in Game.spawns) {
            // Only evaluate the requirements every 50th tick.
            if (Game.time % 50) this.evaluateRequirements(Game.spawns[i]);

            // Process this spawn's SQ.
            this.processSpawnQueue(Game.spawns[i]);
        }
    }

    // Evaluates the requirements for this room to function.
    evaluateRequirements(spawn: StructureSpawn) {

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
    }

    processSpawnQueue(spawn: StructureSpawn) {
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
        else if (spawn.memory.blocked && spawn.room.energyAvailable == spawn.room.energyCapacityAvailable)
        {
            delete spawn.memory.blocked;
        }
        else if (spawn.room.energyAvailable < 300 || (Game.time - spawn.memory.blocked) < 120) {
            if (!(Game.time % 20)) console.log("Spawn '"+ spawn.name +"' blocked for " + (Game.time - spawn.memory.blocked) + "T");
            return;
        }

        delete spawn.memory.blocked;
        let spawnRole = spawnQueue.shift();
        if (spawnRole)
            this.spawnCreep(spawn, spawnRole);
    }

    spawnCreep(spawn: StructureSpawn, role: string) {
        let name = Math.random().toString(36).substring(7);
        let parts = this.calculateRoleParts(spawn, role)
        let creepMemory: CreepMemory = {role: role};

        if (parts === null) return;

        console.log("Spawning creep with [" + parts.toString() + "].");
        spawn.spawnCreep(parts, name, {memory: creepMemory});

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
    }

    calculateRoleParts(spawn: StructureSpawn, role: string) {
        let roleConfig = CreepController.getRoleConfig(role);
        let maxSpawnEnergy = spawn.room.energyAvailable;

        if (roleConfig === null) return null;

        let patternIndex = 0;
        let parts = roleConfig.baseParts;
        while (this.calculatePartsCost(parts) <= maxSpawnEnergy) {
            if (patternIndex > roleConfig.pattern.length - 1) patternIndex = 0;

            parts.push(roleConfig.pattern[patternIndex]);

            patternIndex++;
        }

        parts.pop(); // Get rid of the last element to bring it below max. Dirty fix.

        return parts;
    }

    calculatePartsCost(parts: Array<BodyPartConstant>):number {

        let cost = 0;

        for (let i in parts) {
            cost += BODYPART_COST[parts[i]];
        }

        return cost;
    }
};

