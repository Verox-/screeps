interface Role {
    config: {
        role: string,
        baseParts: Array<string>,
        pattern: Array<string>
    };

    init(): void;
    run(creep: Creep): void;
}