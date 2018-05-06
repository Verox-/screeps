/**
 * Not production ready
 * Testing out the concept of a Task to control creep behaviours
 */

Task.prototype.run = function (creep) {

    if (this.isComplete(creep)) creep.task = null;
};

Task.prototype.isComplete = function (creep) {
    return true;
};

Task.prototype.target = null;
Task.prototype.name = null;
Task.prototype.priority = 0;
