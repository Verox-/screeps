export class RoleConstructor implements Role {

    config: {
        role: string,
        baseParts: Array<BodyPartConstant>,
        pattern: Array<BodyPartConstant>
    };

    constructor() {
        this.config = {
            role: "constructor",
            baseParts: [WORK, CARRY, MOVE],
            pattern: [WORK, CARRY, MOVE],
        }
    }

    init() {

    }

    /** @param {Creep} creep **/
    run(creep: Creep) {
        this.think(creep);
    }

    think(creep: Creep) {
        // Override the constructor's task list and upgrade the controller if it's low..
        let room: Room = Game.spawns['Seed'].room;
        if (room.controller && room.controller.ticksToDowngrade < 4000) {
            this.upgrade(creep);
        }
        else {
            this.build(creep);
        }
    }

    collectResource(creep: Creep) {
        // Stop collection if we're pending a build.
        if (Game.spawns['Seed'].HasQueue()) return;

        let sources = creep.room.find(FIND_MY_SPAWNS);

        console.log("Withdrawing from" + sources[0]);
        let withdrawResult = creep.withdraw(sources[0], RESOURCE_ENERGY);
        if(withdrawResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else {
            console.log("ERR" + withdrawResult);
        }
    }

    upgrade(creep: Creep) {
        let room: Room = Game.spawns['Seed'].room;
        if (!room.controller) return;

        if (_.sum(creep.carry) < creep.carryCapacity && !creep.memory.working)
            this.collectResource(creep);
        else if(Game.spawns['Seed'].room.controller !== undefined && creep.upgradeController(room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F53A}");
            creep.memory.working = true;
        }
        else if (creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say("\u{1F37D}");
        }
    }

    build(creep: Creep) {
        if(creep.memory.working && creep.carry.energy === 0) {
            creep.memory.working = false;
            creep.say('ð');
        }
        if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('\u{1F528}');
        }

        if(creep.memory.working) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                this.upgrade(creep);
            }
        }
        else {
            this.collectResource(creep);
        }
    }

}