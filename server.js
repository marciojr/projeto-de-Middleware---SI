var name;
var password;
var username;
var topics;
var users;
var result;
getData();
var contador = 0;

var WebSocketServer = require('ws').Server;

/*Conexão do Index - Registrar e Logar*/
wss = new WebSocketServer({port: 9090, path: '/server'});
wss.on('connection', function(ws) {

	ws.on('message', function(message) {

		var msg = message.split(":");

		if(msg[0] == 'login'){
			// comandos do login
			getData()
			username = msg[1];
			password = msg[2];
			console.log("user: " + username + "   pass: " + password)
			result = verificator();
	
			ws.send(result)
		}else{
			//comandos save
			name = msg[1];
			username = msg[2];
			password = msg[3];
			topics = msg[4];
			getData()
			
			if(hasUsername()){
				result = "Username Indisponível!";
			}else{
				result = setUser();
				console.log(result)
			}
			ws.send(result);
		}
	});
});



/*Conexão da tela de discussão - Tela 2*/
wss1 = new WebSocketServer({port: 9080, path: '/server'});
wss1.on('connection', function(ws) {

	ws.on('message', function(message) {
		var msg = message;
		var result = setTopic(msg);
		ws.send(result);

		
	});
});


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
	var index = users.indexOf(username);
	
	if(index === -1){
		console.log( "Usuário Inexistente.")
		return "Usuário Inexistente.";
	}else{
		var data = getUser(users.split("|"));
		if(data){
			console.log( "Usuário Logado com Sucesso!")
			return "Usuário Logado com Sucesso!"
		}else{
			console.log( "Senha e/ou Username Incorretos!")
			return "Senha e/ou Username Incorretos!"
		}
	}
}

function getUser(userData){
	for (var i = 0; i < userData.length; i++) {
		var tokens = userData[i].split(":");
		var auxName = tokens[1];
		var auxPass = tokens[2];

		console.log(auxName)

		if(username == auxName){
			if(password == auxPass){
				return true
			}else{
				return false
			}
		}
	}
	return false
}


function getTopic() {
	var fs = require('fs');
	fs.readFile('./Topic.txt', 'utf-8', function (err, data) {
    	if(err) throw err;
    	users = data;
	});
}

function setTopic(m){
	var msg = m.split(":");
	var fs = require('fs');
	fs.appendFile('./Topic.txt',(msg[0]+":"+msg[1]+"|"), function (err) {
		if (err) throw err;
	});
	console.log("Topico "+ msg[0] +" adicionado ao banco...")
	return "Tópico criado com Sucesso!";
}
