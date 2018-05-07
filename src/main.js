var factoryC = require('factory.controller');
var creepC = require('creep.controller');

factoryC.init();
creepC.init();

module.exports.loop = function () {

    // Think the factories
    factoryC.run();

    // Think the creeps
    creepC.run();

    /**
     * Quick and dirty tower code for now.
     */
    let towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);

    towers.forEach((tower) => {
        if(tower) {
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            if(closestHostile) {
                tower.attack(closestHostile);
            }
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER) || structure.hits < (structure.hitsMax*0.0003)
            });

            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

        }
    })
};