function login(){
	var username = document.getElementById("login_username").value;
	var password = document.getElementById("login_password").value;

	var connection = new WebSocket('ws://localhost:9090/server');

	connection.onmessage = function(res){
		var msg = res.data;

		if(msg.indexOf("Incorretos") === -1 && msg.indexOf("Inexistente") === -1){
			alert("Usuário Logado com Sucesso!");
			document.location.href = "./tela1.html?"+username+"&"+msg;
		} else {
			alert(msg);
			location.href = "./index.html";
		}
	}

	connection.onopen = function(){
		connection.send("login:" +username+":"+password);
		console.log("Trying to LogIn...")
	}

	connection.onclose = function(){

	}
}

function save(){
	var name = document.getElementById("name").value;
	var user = document.getElementById("userName").value;
	var password = document.getElementById("password").value;
	var topics = getTopics();
	
	var connection = new WebSocket('ws://localhost:9090/server');

	connection.onmessage = function(res){
		var msg = res.data;
		alert(msg);
		
		if(msg.indexOf("Sucesso") !== -1){
			connection.send("updateUsers")
		}

		location.href = "./index.html";
	}

	connection.onopen = function(){
		connection.send("save:"+ name + ":" + user + ":" + password + ":" + topics );
		console.log("Trying to Registry...")
	}

	connection.onclose = function(){

	}
}

function getTopics() {
	var checks = [];
	var aChk = document.getElementsByName("item");
    for (var i=0;i<aChk.length;i++){ 
        if (aChk[i].checked == true){ 
            checks.push(aChk[i].value);
        }  
     }
     return checks;
}

function create(){
	var connection = new WebSocket('ws://localhost:9080/server');
	var title = document.getElementById("title").value;
	var option = document.getElementById("options").value;

	if(title == null || title === undefined || title == ""){
		alert("Por Favor, adicionar o título do Tópico!");
			location.href = "./tela2.html";
	} else {
		connection.onmessage = function(res){
			var msg = res.data;
			if(msg.indexOf("Sucesso") !== -1){
				alert(msg);
				connection.send("updateTopics");
				location.href = "./tela3.html";

			} else {
				alert("Impossível criar tópico!!");
				location.href = "./tela2.html";
				
			}
			
		}

		connection.onopen = function(){
			connection.send(title+":"+option);
			
		}

		connection.onclose = function(){

		}
	}
}