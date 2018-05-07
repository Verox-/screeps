var factoryC = require('factory.controller');
var creepC = require('creep.controller');
var tasksLib = require('base.task');

factoryC.init();
creepC.init();

module.exports.loop = function () {

    // Think the factories
    factoryC.run();

    // Think the creeps
    creepC.run();
};

