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
    },

    processTick: function () {
        for (var i in Game.spawns) {
            var spawn = Game.spawns[i];

            if (spawn.spawning || Object.keys(Game.creeps).length >= Memory.creepCapacity) return;

            if (_.sum(_.filter(Game.creeps, (creep) => creep.memory.role === 'miner')) < Memory.minerCapacity)
                this.spawnCreep(spawn, "miner");

            if (_.sum(_.filter(Game.creeps, (creep) => creep.memory.role === 'builder')) < Memory.builderCapacity)
                this.spawnCreep(spawn, "builder");
        }
    },

    spawnCreep: function (spawn, role) {
        var name = Math.random().toString(36).substring(7);
        spawn.createCreep([WORK, MOVE, CARRY], name, {role: role})
        Game.creeps[name].init()
    }
};