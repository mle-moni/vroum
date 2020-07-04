/*
Copyright 2020 LE MONIES DE SAGAZAN Mayeul

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

const http = require('http');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = require("../global/db_url").art;
const handler = require("./srv_files/handler").handle;
const connection = require("../global/connection");

const server = http.createServer(handler).listen(8069, "localhost");

const io = require('socket.io')(server);

const rooms = require("./srv_files/game/rooms");

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
	let dbo = db.db("art");

	io.on('connection', function (socket) {
		
		connection.setupEvents(socket, dbo);
		rooms.setupEvents(socket, dbo);

		socket.on("MAJ", txt=> { // pour les mises a jour critiques du site -> refresh de force pour les utilisateurs :)
			if (socket.psd == "Redz") {
				socket.broadcast.emit("MAJ", txt);
				socket.emit("MAJ", txt);
			} else {
				socket.emit("MAJ", "Bien pris qui croyais prendre x)");
			}
		});
	
		socket.on("disconnect", ()=>{
			if (!socket.hasOwnProperty("psd")) {
				return ;
			}
			if (socket.hasOwnProperty("gameRoom")) {
				socket.gameRoom.kick(socket);
			}
		});
	});
});

console.log("online at : http://localhost:8069");
