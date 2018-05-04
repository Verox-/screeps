var roleWorker = require('worker.role');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleWorker.run(creep);
    }
}