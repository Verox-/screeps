/**
 * Not production ready
 * Testing out the concept of a Task to control creep behaviours
 */

function resolveTask(details) {
    return new global[details.name](details);
}

class Task {
    details = {
        target: null,
        name: "Task"
    };
    priority = 0;
    TASK_LIMIT = 10;

    Task(constructDetails) {
        constructDetails.name = details.name;
        details = constructDetails;
    }

    run (creep) {
        if (this.isComplete(creep)) creep.tasks.pop();
    };

    isComplete (creep) {
        return true;
    };
}

class TaskHarvest extends Task {

    run (creep) {

        details = {
            target: null,
            name: "TaskHarvest"
        };

        let sources = creep.room.find(FIND_SOURCES);
        let harvestResult = creep.harvest(sources[0]);

        if(harvestResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}});
            creep.say("\u{1F697}\u{26A1}");
        }

        super.run(creep);
    }

    isComplete (creep) {
        return false;
    }
}

class TaskMove extends Task {
    details = {
        target: null,
        tolerance: 1,
        name: "TaskMove"
    };

    run (creep) {
        creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffffff'}});

        super.run(creep);
    }

    isComplete (creep) {
        return false;
    }
}


Task.prototype.run = function (creep) {


};

Task.prototype.isComplete = function (creep) {
    return true;
};

Task.prototype.details  = {
    target: null,
    name: null
};

