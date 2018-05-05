var creepRole = {
    worker: require('worker.role'),
    miner: require('miner.role'),
    ferry: require('ferry.role'),
    constructor: require('constructor.role'),
};

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
        for (let i in Game.creeps) {
            let creep = Game.creeps[i];

            if (creep.memory.role !== undefined)
                creepRole[creep.memory.role].run({creep: creep});
            else
                console.error("Undefined creep role."); // TODO Perhaps try and resolve the role?

            //creep.run({creep: creep});
        }
    }

};