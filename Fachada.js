function login(){
	var username = document.getElementById("login_username").value;
	var password = document.getElementById("login_password").value;

	var connection = new WebSocket('ws://localhost:9090/server');

	connection.onmessage = function(res){
		var msg = res.data;
		alert(msg);

		if(msg.indexOf("Sucesso") !== -1){
			document.location.href = "./tela1.html?username="+username;
			loadBase();
		} else {
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


function changeView(){
	location.href = "./tela2.html";

}

function create(){
	var connection = new WebSocket('ws://localhost:9080/server');
	var title = document.getElementById("title").value;
	var option = document.getElementById("options").value;
	
	if(title == null || title === undefined || title == ""){
		alert("Favor, preencher o título da discussão!");
			location.href = "./tela2.html";
	} else {
		connection.onmessage = function(res){
			var msg = res.data;
			if(msg.indexOf("Sucesso") !== -1){
				alert(msg);
				location.href = "./tela1.html";
				loadBase();
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


function loadBase() {
	var connection = new WebSocket('ws://localhost:9070/server');
	connection.onmessage = function(res){
		var msg = res.data;
		addTopic(msg);
	}

	connection.onopen = function(){
		connection.send("loadBase");
			
	}

	connection.onclose = function(){

	}

}

function addTopic(res){
	var list_area = document.getElementById(list_area);
	var size = list_area.children.length
	alert(size)
	var newTopic = document.createElement('li');
	var children = list_area.children.length +1;

//	newTopic.textContent = newTopic.innerText = res;

	newTopic.setAttribute('onClick',"alert(res)");
	newTopic.setAttribute('id',"own");
	newTopic.appendChild(document.createTextNode(children))
	list_area.appendChild(newTopic);
	list_area.scrollTop = list_area.scrollHeight;

}
