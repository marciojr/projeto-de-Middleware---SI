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


/*     Server-Send Events     */
var http = require("http");

var clients = {};
var id=0;
http.createServer(function(req, res){
    var my_id = id++;
    clients[my_id] = res;

    res.writeHeader(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive", 
        "Access-Control-Allow-Origin": "*"
    });

}).listen(9000);

function sendEventSource(data){


    for( id in  clients){
        clients[id].write("data: "+JSON.stringify(data)+"\n\n");
    }
}

function uploadListTopicChat(id, titulo, topico){
    var data = {
        id: id,
        titulo: titulo, 
        topico: topico
    }

    sendEventSource(data);
}

/*------------------------------------------------------------------*/

/*    WS-Server    */
var WebSocketServer = require('ws').Server;

/*Conexão do Index - Registrar e Logar - tela index*/
wss = new WebSocketServer({port: 9090, path: '/server'});
wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		var msg = message.split(":");

		if(msg[0] == 'login'){
			// comandos do login
			username = msg[1];
			password = msg[2];
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
            var index = getContador(top);
            var count = parseInt(index) + 1;
            uploadListTopicChat(count,msg.split(':')[0], msg.split(':')[1]);
			ws.send(result);
		}	
	});
});

/*Carregando tópicos da base e rodando Chat - tela 1 e 3*/
wss2 = new WebSocketServer({port: 9070, path: '/server'});

var wss_JAVA = new Array()
var wss_PYTHON = new Array()
var wss_NODEJS = new Array()
var wss_RUBY = new Array()
var wss_SWIFT = new Array()
var wss_JS = new Array()

wss2.on('connection', function(ws) {

	ws.on('message', function(message) {
		var msg = message;

		if(msg == '@#$%loadBase%$#@'){
			ws.send(top);
		}else if(msg.indexOf("@#%$add%$#@") !== -1){
			var helper = msg.split(":");
			ws.sockname = helper[3]+":"+helper[1];
			updateWSList(helper[2],ws,"add",null);
		}else if (msg.indexOf("@#$%delete%$#@") !== -1){
			console.log(msg)
            console.log("adasdasdasdasdasda")
            var helper = msg.split(":")
            updateWSList(helper[2],null,"delete",helper[1]+":"+helper[3])
		}else if(msg.indexOf("@#%$changeChat%$#@") !== -1){

		}else if(msg.indexOf("@#$%broadCastMsg%$#@") !== -1){
			var helper = msg.split(":");
			broadCastMsg(helper[1],helper[2],helper[3],helper[4]);
		}
	});
});

/*   Métodos Auxiliares   */
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
		var text1 = text[size - 2];
		var text2 = text1.split(":");
	
		return text2[2];
	}
}

function updateWSList(type,ws,command,name){
    switch (type) {
    case 'Java':
        if(command == 'add'){
        	wss_JAVA.push(ws)
        }else{
        	for (var i = 0; i < wss_JAVA.length; i++) {
        		if(wss_JAVA[i] != undefined){
                    if(wss_JAVA[i].sockname == name){
                    delete wss_JAVA[i]
                    }
                }
        	};
        }
        break; 
    case 'Python':
       	if(command == 'add'){
       		wss_PYTHON.push(ws)
        }else{
        	for (var i = 0; i < wss_PYTHON.length; i++) {
                if(wss_PYTHON[i] != undefined){
                    if(wss_PYTHON[i].sockname == name){
                    delete wss_PYTHON[i]
                    }
                }
            };
        }
        break; 
    case 'Nodejs':
        if(command == 'add'){
        	wss_NODEJS.push(ws)
        }else{
        	for (var i = 0; i < wss_NODEJS.length; i++) {
                if(wss_NODEJS[i] != undefined){
                    if(wss_NODEJS[i].sockname == name){
                    delete wss_NODEJS[i]
                    }
                }
            };
        }
        break;
    case 'Swift':
        if(command == 'add'){
        	wss_SWIFT.push(ws)
        }else{
        	for (var i = 0; i < wss_SWIFT.length; i++) {
                if(wss_SWIFT[i] != undefined){
                    if(wss_SWIFT[i].sockname == name){
                    delete wss_SWIFT[i]
                    }
                }
            };
        }
        break; 
    case 'JavaScript':
        if(command == 'add'){
        	wss_JS.push(ws)
        }else{
        	for (var i = 0; i < wss_JS.length; i++) {
                if(wss_JS[i] != undefined){
                    if(wss_JS[i].sockname == name){
                    delete wss_JS[i]
                    }
                }
            };
        }
        break; 
    case 'Ruby':
        if(command == 'add'){
        	wss_RUBY.push(ws)
        }else{
        	for (var i = 0; i < wss_RUBY.length; i++) {
                if(wss_RUBY[i] != undefined){
                    if(wss_RUBY[i].sockname == name){
                    delete wss_RUBY[i]
                    }
                }
            };
        }
        break;  
	}
}

function broadCastMsg(id,type,user,msg){
	switch (type) {
    case 'Java':
       	for (var i = 0; i < wss_JAVA.length; i++) {
       		if(wss_JAVA[i] != undefined){
                if(wss_JAVA[i].sockname.split(":")[0] === id){
                    wss_JAVA[i].send("@#%$broadCastMsg@#%$:"+ user+ ":"+ msg);
                }
            }
       	};
        break;
    case 'Python':
       	for (var i = 0; i < wss_PYTHON.length; i++) {
            if(wss_PYTHON[i] != undefined){
                if(wss_PYTHON[i].sockname.split(":")[0] === id){
                    wss_PYTHON[i].send("@#%$broadCastMsg@#%$:"+ user+ ":"+ msg);
                }
            }
        };
        break; 
    case 'Nodejs':
        for (var i = 0; i < wss_NODEJS.length; i++) {
            if(wss_NODEJS[i] != undefined){
                if(wss_NODEJS[i].sockname.split(":")[0] === id){
                    wss_NODEJS[i].send("@#%$broadCastMsg@#%$:"+ user+ ":"+ msg);
                }
            }
        };
        break;
    case 'Swift':
        for (var i = 0; i < wss_SWIFT.length; i++) {
            if(wss_SWIFT[i] != undefined){
                if(wss_SWIFT[i].sockname.split(":")[0] === id){
                    wss_SWIFT[i].send("@#%$broadCastMsg@#%$:"+ user+ ":"+ msg);
                }
            }
        };
        break;
    case 'JavaScript':
       for (var i = 0; i < wss_JS.length; i++) {
            if(wss_JS[i] != undefined){
                if(wss_JS[i].sockname.split(":")[0] === id){
                    wss_JS[i].send("@#%$broadCastMsg@#%$:"+ user+ ":"+ msg);
                }
            }
        };
        break; 
    case 'Ruby':
        for (var i = 0; i < wss_RUBY.length; i++) {
            if(wss_RUBY[i] != undefined){
                if(wss_RUBY[i].sockname.split(":")[0] === id){
                    wss_RUBY[i].send("@#%$broadCastMsg@#%$:"+ user+ ":"+ msg);
                }
            }
        };
        break;  
	}
}
