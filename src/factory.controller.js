module.exports = {

    init: function () {
        if (Memory.factoryIsInitialized === true)
            return;

        this.initMemory();
    },

    run: function () {
        this.processTick();
    },

    initMemory: function () {
        Memory.creepCapacity = 10;
    },

    processTick: function () {
        for (var i in Game.spawns) {
            var spawn = Game.spawns[i];

            if (spawn.spawning) return;

            this.spawnCreep(spawn, "worker");
        }
    },

    spawnCreep: function (spawn, role) {
        var name = Math.random().toString(36).substring(7);
        spawn.createCreep([WORK, MOVE, CARRY], name, {role: role})
    }
};