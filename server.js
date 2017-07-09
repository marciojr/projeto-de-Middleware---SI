var name;
var password;
var username;
var topics;
var users;
var result;
getData();
var top
getTopic();
var clients;

var WebSocketServer = require('ws').Server;


/*Conexão do Index - Registrar e Logar*/
wss = new WebSocketServer({port: 9090, path: '/server'});
var clients = {};

var id = 0;
wss.on('connection', function(ws) {
	ws.id = id++;
	
	clients[id] = ws;


	ws.on('message', function(message) {

		var msg = message.split(":");

		if(msg[0] == 'login'){
			// comandos do login
			username = msg[1];
			password = msg[2];
			console.log("user: " + username + "   pass: " + password)
			result = verificator();
	
			ws.send(result)
		}else if(msg[0] == 'save'){
			//comandos save
			name = msg[1];
			username = msg[2];
			password = msg[3];
			topics = msg[4];
			
			if(hasUsername()){
				result = "Username Indisponível!";
			}else{
				result = setUser();
				console.log(result)
			}
			ws.send(result);
		}else{
			getData()
		}
	});
});



/*Conexão da tela de Tópicos - Tela 2*/
wss1 = new WebSocketServer({port: 9080, path: '/server'});
wss1.on('connection', function(ws) {

	ws.on('message', function(message) {
		var msg = message;

		if(msg == 'updateTopics'){
			getTopic();
			var index = getContador(top);
			var count = parseInt(index) + 1;
			ws.send("id:"+count)
		}else{
			var result = setTopic(msg);
			ws.send(result);
		}	
	});
});


/*Carregando tópicos da base */
wss2 = new WebSocketServer({port: 9070, path: '/server'});
wss2.on('connection', function(ws) {

	ws.on('message', function(message) {
		var msg = message;
		ws.send(top);

		
	});
});



/*Criando o Server-Sent Events*/
function updateListTopic(){
	var http = require("http");

var serverRead;

http.createServer(function(req, res) {

    res.writeHeader(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });
    
    serverRead = res;

}).listen(9090);	
}

function getData() {
	var fs = require('fs');
	fs.readFile('./Data.txt', 'utf-8', function (err, data) {
    	if(err) throw err;
    	users = data;
	});
}

function setUser(){
	var fs = require('fs');
	fs.appendFile('./Data.txt',(name+":"+username+":"+password+":"+topics+"|"), function (err) {
		if (err) throw err;
	});
	console.log("Usuário "+ name +" adicionado ao banco...")
	return "Usuário Cadastrado com Sucesso!";
}

function hasUsername(){
	getData();
	if (users == null) {
		return false
	}else if(users.indexOf(username) !== -1){
		return true
	}else{
		return false
	}
}

function verificator(){
	var exist = isUserName(username);
	
	if(!exist){
		console.log( "Usuário Inexistente.")
		return "Usuário Inexistente.";
	}else{
		var data = getUser(users.split("|"));
		if(data != "Error"){
			console.log( "Usuário Logado com Sucesso!")
			return data
		}else{
			console.log( "Senha e/ou Username Incorretos!")
			return "Senha e/ou Username Incorretos!"
		}
	}
}

function isUserName(){
	var helper = users.split("|");
	for (var i = 0; i < helper.length; i++) {
		var tokens = helper[i].split(":");
		var auxName = tokens[1];
			
		if(username == auxName){
			return true
		}
	}  	
	return false
}

function getUser(userData){
	for (var i = 0; i < userData.length; i++) {
		var tokens = userData[i].split(":");
		var auxName = tokens[1];
		var auxPass = tokens[2];
		var topics = tokens[3];
		
		if(username == auxName){
			if(password == auxPass){
				return topics
			}else{
				return "Error"
			}
		}
	}
	return false
}

function getTopic() {
	var fs = require('fs');
	fs.readFile('./Topic.txt', 'utf-8', function (err, data) {
    	if(err) throw err;
    	top = data;

	});
}

function setTopic(m){
	var msg = m.split(":");
	var fs = require('fs');

	var aux = top;
	var index = getContador(aux);
	
	var contador = parseInt(index) + 1;
	fs.appendFile('./Topic.txt',(msg[0]+":"+msg[1]+":"+contador+"|"), function (err) {
		if (err) throw err;
	});
	console.log("Topico "+ msg[0] +" adicionado ao banco...")
	return "Tópico criado com Sucesso!";
}


function getContador(data){
	if(data == null || data === undefined || data == ""){
		return 0;
	} else {
		var text = data.split("|");
		var size = text.length;
		//console.log(size);
		var text1 = text[size - 2];
		var text2 = text1.split(":");
		console.log(text2[2]);
		return text2[2];
	}
}