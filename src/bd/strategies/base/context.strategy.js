const IDb = require('./interface.bd')

class ContextStrategy extends IDb {
    constructor(database) {
        super();
        this._database = database;
    }


    connect() {
        return this._database.connect();
    }
    isConnected() {
        return this._database.isConnected();
    }

    insert(entity) {
        return this._database.insert(entity);
    }

    read(entity, skip = 0, limit = 10) {
        return this._database.read(entity, skip, limit);
    }

    update(id, entity, upsert = false) {
        return this._database.update(id, entity, upsert);
    }

    delete(id) {
        return this._database.delete(id);
    }
}

module.exports = ContextStrategy;