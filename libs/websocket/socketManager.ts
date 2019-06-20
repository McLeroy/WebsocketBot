import {SocketServer, ISocket} from "./socketServer";
import moment from 'moment';
import randomFacts = require('random-facts');

export const handleMessage = (socket: ISocket, eventModel: EventModel) => {
    switch (eventModel.eventType) {
        case EventType.IN_EVENT_ONLINE:
            sendEvent(socket.uid, createWelcomeEventModel());
            break;
        case EventType.IN_EVENT_MESSAGE:
            processMessage(socket, (eventModel.payload as unknown as string));
            break;
    }
};

const processMessage = (socket: ISocket, payload: string) => {
    let eventModel: EventModel;
    if (payload.toLowerCase().includes('hi')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `Hello device ${socket.uid}`);
    } else if (payload.toLowerCase().includes('your name')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, 'My name is Byte. Nice to meet you');
    } else if (payload.toLowerCase().includes('byte')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `That's me :). What can I do for you?`);
    } else if (payload.toLowerCase().includes('fact')) {
            eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, randomFacts.randomFact());
    } else if (payload.toLowerCase().includes('the time')) {
        const now = moment();
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `The time where I am now is ${now.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);
    } else if (payload.toLowerCase().includes('byte')) {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `That's me :). What can I do for you?`);
    } else {
        eventModel = new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `You too ${payload} ;)`);
    }
    sendEvent(socket.uid, eventModel);
};

const createWelcomeEventModel = (): EventModel => {
    const supportedKeyword = getSupportedKeywords();
    return new EventModel().createFromEvent(EventType.OUT_EVENT_MESSAGE, `Welcome. Here are some things you can tell me \n ${supportedKeyword.join("\t")}. Or I can just reply your messages with a wink ;)`);
};

const getSupportedKeywords = (): string[] => {
    return ['What is your name', 'What is the time', 'Tell me a fact'];
};

export const sendEvent = (uid, eventModel: EventModel) => {
    const socketServer = SocketServer.getWebsocketServer();
    if (!socketServer || !uid) return;
    const socket = Array.from(socketServer.clients).filter(client => (client as ISocket).uid.toString() === uid.toString())[0];
    if (socket) {
        console.log(`Sending event. uid: ${uid}, event: ${eventModel.eventType}`);
        socket.send(JSON.stringify({event: eventModel.eventType, payload: eventModel.payload}));
    }
};

export const closeConnection = async (uid, message) => {
    const socketServer = SocketServer.getWebsocketServer();
    if (!socketServer || !uid) return;
    const socket = Array.from(socketServer.clients).filter(client => (client as ISocket).uid.toString() === uid.toString())[0];
    if (socket)
        (socket as any).drop(1002, message, true);
};

export class EventModel {
    public eventType: EventType;
    public payload: object;

    public createFromEvent = (eventType: EventType, payload: any): EventModel => {
        this.eventType = eventType;
        this.payload = payload;
        return this;
    }

    public createFromAny = (data: any): EventModel => {
        try {
            const object = JSON.parse(data);
            if (!object.hasOwnProperty('event')) return;
            this.eventType = object.event;
            this.payload = object.payload;
        } catch (e) {
            console.error('Json parse error: ', e);
        }
        return this;
    }
}

export enum EventType {
    // In Events
    IN_EVENT_ONLINE = 'online',
    IN_EVENT_MESSAGE= 'message',
    IN_EVENT_REQUEST_QUE = 'request_que',
    IN_EVENT_OFFLINE = 'offline',
    // Out Events
    OUT_EVENT_ONLINE = 'online',
    OUT_EVENT_MESSAGE = 'message',
}
