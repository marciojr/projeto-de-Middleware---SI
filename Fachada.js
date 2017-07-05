function login(){
	var username = document.getElementById("login_username").value;
	var password = document.getElementById("login_password").value;
	alert(username)

	var connection = new WebSocket('ws://localhost:9090/server');

	connection.onmessage = function(){

	}

	connection.onopen = function(){
		connection.send("login:" +username+":"+password);
	}

	connection.onclose = function(){

	}

}


function save(){
	var name = document.getElementById("name").value;
	var user = document.getElementById("userName").value;
	var password = document.getElementById("password").value;
	var topics = getTopics();
	alert(password);

	var connection = new WebSocket('ws://localhost:9090/server');

	connection.onmessage = function(){

	}

	connection.onopen = function(){
		connection.send("save:"+ name + ":" + user + ":" + password + ":" + topics );
	}

	connection.onclose = function(){

	}
}

function getTopics(){
	var topics = []; 
	var aChk = document.getElementsByName("item");
	for (var i=0;i<aChk.lenght;i++){
    	if (aChk[i].checked == true){
        	topics.push(aChk[i].value);
     	}
	}
}
