
  
# WebsocketBot  
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)  
  
This is a simple server built on Node.js, Express and Typescript (Javascript) that demonstrates the use of Websockets, Express and Typescript on the backend.  
  
It acts as a simple bot named Byte that can perform simple actions like  
  
 - Telling you his name  
 - Telling you the time  
 - Telling you a simple fact  
  
# Getting started!  
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes  
  
**Prerequisites**  
    
 - Git [Download here](https://git-scm.com/downloads)  
- NPM and Node.js [Download here](https://nodejs.org/en/download/)  
  
**Installation**  
- Install git, and the node.js on your local machine.  
- Create a folder anywhere you wish on your local machine  
- Open a command prompt in that folder and run  
- run `git clone` to clone the project  
- open the project folder location and run `npm install`  
- then run `npm start` to start the server  
- open your browser and navigate to `http://localhost` to ensure the server is running  
- open a command prompt and type `ipconfig` to get your IPv4 Address.  
- Grab any Websocket client of your choice and connect to `ws://{ipv4address}?deviceId={any random string}` e.g **ws://10.3.1.160?deviceId=686a603d-f287-4c06-8369-3f116d1aa724**  
## License  
This project is licensed under the MIT License - see the [LICENSE.md file](https://github.com/McLeroy/WebsocketBot/blob/master/LICENSE)