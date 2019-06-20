"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketServer_1 = require("./socketServer");
const moment_1 = __importDefault(require("moment"));
const randomFacts = require("random-facts");
exports.handleMessage = (socket, eventModel) => {
    switch (eventModel.eventType) {
        case EventType.IN_EVENT_ONLINE:
            exports.sendEvent(socket.uid, createWelcomeEventModel());
            break;
        case EventType.IN_EVENT_MESSAGE:
            processMessage(socket, eventModel.payload);
            break;
    }
};
const processMessage = (socket, payload) => {
    let eventModel;
    if (payload.toLowerCase().includes('hi')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `Hello device ${socket.uid}`);
    }
    else if (payload.toLowerCase().includes('your name')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, 'My name is Byte. Nice to meet you');
    }
    else if (payload.toLowerCase().includes('byte')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `That's me :). What can I do for you?`);
    }
    else if (payload.toLowerCase().includes('fact')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, randomFacts.randomFact());
    }
    else if (payload.toLowerCase().includes('the time')) {
        const now = moment_1.default();
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `The time where I am now is ${now.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);
    }
    else if (payload.toLowerCase().includes('byte')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `That's me :). What can I do for you?`);
    }
    else {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `You too ${payload} ;)`);
    }
    exports.sendEvent(socket.uid, eventModel);
};
const createWelcomeEventModel = () => {
    const supportedKeyword = getSupportedKeywords();
    return new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `Welcome. Here are some things you can tell me \n ${supportedKeyword.join("\t")}. Or I can just reply your messages with a wink ;)`);
};
const getSupportedKeywords = () => {
    return ['What is your name', 'What is the time', 'Tell me a fact'];
};
exports.sendEvent = (uid, eventModel) => {
    const socketServer = socketServer_1.SocketServer.getWebsocketServer();
    if (!socketServer || !uid)
        return;
    const socket = Array.from(socketServer.clients).filter(client => client.uid.toString() === uid.toString())[0];
    if (socket) {
        console.log(`Sending event. uid: ${uid}, event: ${eventModel.eventType}`);
        socket.send(JSON.stringify({ event: eventModel.eventType, payload: eventModel.payload }));
    }
};
exports.closeConnection = async (uid, message) => {
    const socketServer = socketServer_1.SocketServer.getWebsocketServer();
    if (!socketServer || !uid)
        return;
    const socket = Array.from(socketServer.clients).filter(client => client.uid.toString() === uid.toString())[0];
    if (socket)
        socket.drop(1002, message, true);
};
class EventModel {
    constructor() {
        this.createFromEvent = (eventType, payload) => {
            this.eventType = eventType;
            this.payload = payload;
            return this;
        };
        this.createFromAny = (data) => {
            try {
                const object = JSON.parse(data);
                if (!object.hasOwnProperty('event'))
                    return;
                this.eventType = object.event;
                this.payload = object.payload;
            }
            catch (e) {
                console.error('Json parse error: ', e);
            }
            return this;
        };
    }
}
exports.EventModel = EventModel;
var EventType;
(function (EventType) {
    // In Events
    EventType["IN_EVENT_ONLINE"] = "online";
    EventType["IN_EVENT_MESSAGE"] = "message";
    EventType["IN_EVENT_REQUEST_QUE"] = "request_que";
    EventType["IN_EVENT_OFFLINE"] = "offline";
    // Out Events
    EventType["OUT_EVENT_ONLINE"] = "online";
    EventType["OUT_EVENT_MESSAGE"] = "message";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=socketManager.js.map