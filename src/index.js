'use strict';

const Koa = require('koa');
const co = require('co');
const path = require('path');
const server = require('koa-static');
const logger = require('koa-logger');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const AgendaService = require('./AgendaService.js');
const Action = require('./Action.js').Action;
const PORT = 2333;


let app = new Koa();
let Agenda = new AgendaService();

app.use(logger());
app.use(bodyParser());
app.use(server('./assets'));


// ========================  router  ========================
router.get('/api', (ctx, next)=> {
    ctx.body = Agenda.name;
});

router.get('/api/login', (ctx, next)=> {
    let userSimpleInfo = ctx.query;
    // if succeed to login
    if (Agenda.storage.userArray.some((user)=> {
            return userSimpleInfo.name === user.name && userSimpleInfo.password === user.password;
        })) {
        console.log(`@${userSimpleInfo.name} log in!`);
        Agenda.name = userSimpleInfo.name;
        Agenda.password = userSimpleInfo.password;
        ctx.body = `<h3>I'm ${Agenda.name}.</h3>`;
    } else {
        ctx.body = 'no-log';
    }
});

router.get('/am-i-logged', (ctx, next)=> {
    if (Agenda.isRunning())
        ctx.body = `<h3>I'm ${Agenda.name}.</h3>`;
    else
        ctx.body = 'no-log';
});

router.get('/api/operation', (ctx, next)=> {
    console.log(ctx.query);
    if (Agenda.isRunning())
        switch (ctx.query['type']) {
            case 'o':
                Agenda.logOut();
                ctx.body = '<p>succeed to log out !!</p>' +
                    '<p>Please go to the / to log in again!</p>';
                break;
            case 'dc':
                Agenda.deleteAgendaAccount();
                ctx.body = 'your account has been deleted!!';
                break;
            case 'lu':
                ctx.body = Agenda.listAllUsers();
                break;
            case 'cm':
                if (Agenda.createMeeting(ctx.query.title, ctx.query.participators, ctx.query.startDate, ctx.query.endDate))
                    ctx.body = '<p>success to create meeting</p>';
                else
                    ctx.boy = '<p>fail to create new meeting</p>';
                break;
            case 'la':
                ctx.body = Agenda.listMeetings(Agenda.isInMeeting);
                break;
            case 'las':
                ctx.body = Agenda.listMeetings(Agenda.isSponsor);
                break;
            case 'lap':
                ctx.body = Agenda.listMeetings(Agenda.isParticipator);
                break;
            case 'qm':
                ctx.body = Agenda.listMeetings(Agenda.isInMeeting).filter((meeting)=> {
                    let title = ctx.query.title || '';
                    return meeting.title === title;
                });
                break;
            case 'qt':
                ctx.body = Agenda.listMeetings(Agenda.isInMeeting).filter((meeting)=> {
                    // Date String : [yyyy-mm-dd hh-mm-ss]
                    let start = new Date(ctx.query.startString) || new Date();
                    let end = new Date(ctx.query.endString) || new Date();
                    return start <= meeting.startDate && meeting.startDate <= end ||
                        start <= meeting.endDate && meeting.endDate <= end;
                });
                break;
            case 'dm':
                break;
            case 'da':
                break;
            default:
                ctx.body = 'Your query string is not Valid!'
        }
    else return next();
});


app.use(router.routes()).use(router.allowedMethods());
app.use(co.wrap(function *(ctx, next) {
    if (Agenda.isRunning()) {
        yield next();
    } else
        ctx.body = '[fetch] you don\'t log in, please go to the / and log';
}));
app.listen(PORT);
console.log(`The server is running at port: ${PORT}`);