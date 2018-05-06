var creepRole = {
    //worker: require('worker.role'), // Depreciated
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
        if (Memory.thinking === false) return;

        this.processTick();
    },

    initMemory: function () {

    },

    processTick: function () {
        for (let i in Game.creeps) {
            let creep = Game.creeps[i];

            // Recall the creep's tasks.
            creep.tasks = creep.memory.tasks;

            if (creep.memory.role !== undefined && creepRole[creep.memory.role] !== undefined)
                creepRole[creep.memory.role].run({creep: creep});
            else
                console.log("Undefined creep role " + creep.memory.role + " on creep " + creep.name + "."); // TODO Perhaps try and resolve the role?

            // Store the creep's tasks.
            creep.memory.tasks = creep.tasks;
        }
    },

    getRoleConfig: function (role) {
        return creepRole[role].config;
    },
};

Creep.prototype.tasks = [];
Creep.prototype.addTask = function (task) {
    if (this.task === undefined) this.task = task;
};