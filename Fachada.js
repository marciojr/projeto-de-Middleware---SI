function login(){
	var username = document.getElementById("login_username").value;
	var password = document.getElementById("login_password").value;

	var connection = new WebSocket('ws://localhost:9090/server');

	connection.onmessage = function(res){
		var msg = res.data;
		alert(msg);

		if(msg.indexOf("sucesso") !== -1){
			document.location.href = "./tela1.html?username="+username;
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
