'use strict';

const actionTypes = {
    default: 'DEFAULT'
};

class Action {
    constructor() {
        this.type = actionTypes.default;
    }
}

module.exports = {
    Action, actionTypes
};