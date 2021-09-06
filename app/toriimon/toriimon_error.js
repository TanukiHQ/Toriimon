class ToriimonError extends Error {
    constructor(args) {
        super(args[1])
        this.name = args[0]
    }
}

module.exports = ToriimonError
