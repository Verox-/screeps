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
        Memory.creepCapacity = 3;
    },

    processTick: function () {
        for (var i in Game.spawns) {
            var spawn = Game.spawns[i];

            if (spawn.spawning || Object.keys(Game.creeps).length >= Memory.creepCapacity) return;

            this.spawnCreep(spawn, "worker");
        }
    },

    spawnCreep: function (spawn, role) {
        var name = Math.random().toString(36).substring(7);
        spawn.createCreep([WORK, MOVE, CARRY], name, {role: role})
        Game.creeps[name].init()
    }
};