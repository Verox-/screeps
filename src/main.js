var roleWorker = require('worker.role');
var factoryC = require('factory.controller');
var creepC = require('creep.controller');

module.exports.loop = function () {

    factoryC.run();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleWorker.run({creep: creep});
    }
}