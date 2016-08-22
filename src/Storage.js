'use strict';
const fs = require('fs');
const Meeting = require('./Meeting.js');
const User = require('./User.js');

class Storage {
    constructor() {
        if (isEmpty(this.userArray)) {
            this.userArray = this.readFromFile('./json/User.json');
        }

        if (isEmpty(this.meetingArray)) {
            this.meetingArray = this.readFromFile('./json/Meeting.json');
        }
    }

    writeToFile(path, data) {
        return new Promise((resolve, reject)=> {
            fs.writeFile(path, JSON.stringify(data), (err)=> {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    readFromFile(path) {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    }


}

Storage.prototype.userArray = [];
Storage.prototype.meetingArray = [];
Storage.prototype.isDirty = false;

function isEmpty(array) {
    return !array.length;
}
module.exports = Storage;