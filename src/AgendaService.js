'use strict';
const Storage = require('./Storage.js');
const Meeting = require('./Meeting.js');

class AgendaService {
    constructor() {

    }

    isRunning() {
        return this.name.length && this.password.length;
    }

    logOut() {
        this.name = '';
        this.password = '';
    }

    deleteAgendaAccount() {
        this.storage.userArray = this.storage.userArray.filter((user)=> {
            return user.name !== this.name;
        });
    }

    listAllUsers() {
        return this.storage.userArray;
    }

    createMeeting(title, participatorsArray, startDate, endDate) {
        if (participatorsArray.some(participator=> {
                return participator.name === this.name;
            }))
            return false;
        if (startDate >= endDate)
            return false;
        if (this.listMeetings(this.isInMeeting).some(meeting=> {
                return startDate <= meeting.startDate && meeting.endDate <= endDate;
            }))
            return false;

        if (participatorsArray.some((participatorName)=> {
                return this.listMeetings((meeting)=> {
                    return meeting.sponsor === participatorName ||
                        meeting.participators.some(participatorName=> {
                            return participatorName === this.name;
                        });
                }).some(meeting=> {
                    return startDate <= meeting.startDate && meeting.endDate <= endDate;
                });
            }))return false;
        this.storage.meetingArray.push(new Meeting(this.name, participatorsArray, startDate, endDate, title));
        return true;
    }

    listMeetings(filter) {
        return this.storage.meetingArray.filter(filter);
    }

    isSponsor(meetingObj) {
        return meetingObj.sponsor === this.name;
    }

    isParticipator(meetingObj) {
        return meetingObj.participators.some(participatorName=> {
            return participatorName === this.name;
        });
    }

    isInMeeting(meetingObj) {
        return this.isSponsor(meetingObj) || this.isParticipator(meetingObj);
    }
}

AgendaService.prototype.name = '';
AgendaService.prototype.password = '';
AgendaService.prototype.storage = new Storage();

module.exports = AgendaService;