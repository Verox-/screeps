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

    },

    processTick: function () {
        for (var i in Game.creeps) {
            var creep = Game.creeps[i];

            creep.run({creep: creep});
        }
    }

};