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
        Memory.creepCapacity = 4;
        Memory.minerCapacity = 4;
        Memory.builderCapacity = 4;

        Memory.factoryIsInitialized = true;
    },

    processTick: function () {
        for (let i in Game.spawns) {
            let spawn = Game.spawns[i];

            if (spawn.spawning || Object.keys(Game.creeps).length >= Memory.creepCapacity) return;

            if (_.sum(_.filter(Game.creeps, (creep) => creep.memory.role === 'miner')) < Memory.minerCapacity)
                this.spawnCreep(spawn, "miner");

            else if (_.sum(_.filter(Game.creeps, (creep) => creep.memory.role === 'builder')) < Memory.builderCapacity)
                this.spawnCreep(spawn, "builder");
        }
    },

    spawnCreep: function (spawn, role) {
        let name = Math.random().toString(36).substring(7);
        spawn.createCreep([WORK, MOVE, CARRY], name, {role: role});
    }
};