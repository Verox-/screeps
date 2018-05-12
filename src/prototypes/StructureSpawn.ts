interface StructureSpawn {
    EnqueueSpawn(role: string): void;
    HasQueue(): boolean;
}

StructureSpawn.prototype.EnqueueSpawn = function(role: string) {
    if (!Array.isArray(this.memory.spawnQueue))
        this.memory.spawnQueue = [];

    this.memory.spawnQueue.push(role);
};

/**
 * @return {boolean}
 */
StructureSpawn.prototype.HasQueue = function() {
    return !(this.memory.spawnQueue === undefined || this.memory.spawnQueue.length === 0);
};

