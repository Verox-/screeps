export class RoleFerry implements Role {
    config: {
        role: string,
        baseParts: Array<BodyPartConstant>,
        pattern: Array<BodyPartConstant>
    };

    constructor() {
        this.config = {
            role: "ferry",
            baseParts: [MOVE, CARRY],
            pattern: [MOVE, CARRY]
        }
    }

    init() {

    }

    /** @param {Creep} creep **/
    run(creep: Creep) {
        this.think(creep);
    }

    think(creep: Creep) {
        if (creep.memory.lastAction === undefined)
            creep.memory.lastAction = "collect";



        else if (creep.memory.lastAction === "collect" && _.sum(creep.carry) >= creep.carryCapacity)
            this.deposit(creep);
        else if (creep.memory.lastAction === "deposit" && _.sum(creep.carry) <= 0)
            this.collect(creep);
        else if (creep.memory.lastAction === "collect")
            this.collect(creep);
        else if (creep.memory.lastAction === "deposit")
            this.deposit(creep);
        else
        if (this.collect(creep))
            this.deposit(creep);
    }

    collect(creep: Creep) {
        creep.memory.lastAction = "collect";
        if (!this.collectDropped(creep))
            this.collectContainer(creep);

        return _.sum(creep.carry) >= creep.carryCapacity;
    }

    /**
     * Finds dropped resources in this room and tries to pick them up.
     * @param creep Reference to the creep
     * @returns {boolean} TRUE if pick up success
     */
    collectDropped(creep: Creep) {
        let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (resource === null) return false;

        if(_.sum(creep.carry) < creep.carryCapacity)
        {
            let pickupResult = creep.pickup(resource);

            if (pickupResult === OK)
                return true;
            else if(pickupResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("\u{1F697}\u{26A1}");
            }
            else {
                creep.say(pickupResult.toString());
            }
        }


        return false;
    }

    collectContainer(creep: Creep) {

        let closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER});
        if (closestContainer === null) return false;

        if(_.sum(creep.carry) < creep.carryCapacity)
        {
            let withdrawResult = creep.withdraw(closestContainer, RESOURCE_ENERGY);

            if (withdrawResult === OK)
                return true;
            else if(withdrawResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say("\u{1F697}\u{26A1}");
            }
            else {
                creep.say(withdrawResult.toString());
            }
        }


        return false;
    }

    deposit(creep: Creep) {
        creep.memory.lastAction = "deposit";
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (targets.length <= 0) {
            if (creep.room.storage === undefined)
                return;
            else
                targets[0] = creep.room.storage;
        }

        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{1F3E0}");
        }
    }

};