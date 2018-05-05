module.exports = {

    config: {
        base: [WORK, CARRY, MOVE],
        pattern: [WORK, CARRY, MOVE],
        role: "constructor",
    },

    init: function (creep, role, level) {
        if (creep.memory.role === undefined)
        {
            console.log("Setting uninitialized role.");
            creep.memory.role = role;
        }

        creep.memory.level = level;
        creep.memory.eating = false;

        console.log("Initialized a new creep.");
    },

    /** @param {Creep} creep **/
    run: function(parameters) {
        this.think(parameters.creep);
    },

    think: function (creep) {
        creep.say("\u{1F634}");
    },

    collectResource: function (creep) {

    },

};