'use strict';

const actionTypes = {
    default: 'DEFAULT'
};

const listMeetingsTypes = {
    All: 'ALL',
    Sponsor: 'SPONSOR',
    Participator: 'PARTICIPATOR'
};

class Action {
    constructor() {
        this.type = actionTypes.default;
    }
}

module.exports = {
    Action, actionTypes, listMeetingsTypes
};