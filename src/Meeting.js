'use strict';

class Meeting {
    constructor(sponsorName, participatorArray, startDate, endDate, title) {
        this.sponsor = sponsorName;
        this.participators = participatorArray;
        this.startDate = startDate;
        this.endDate = endDate;
        this.title = title;
    }

    isInParticipators(queryName) {
        return this.participators.some((participatorName)=> {
            return participatorName === queryName;
        });
    }
}

module.exports = Meeting;