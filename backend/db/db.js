const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect('mongodb://localhost:27017/quoteDB')
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error:', err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database.getInstance();
