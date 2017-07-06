window.onload = function() {

	var url = document.location.href;
	var helper = url.split("?");
	var title = helper[1].split("&")[0];
	var topic = helper[1].split("&")[1];
	var user = helper[1].split("&")[2];
	document.getElementById("chat_label").innerHTML = "User[  " + user +"  ] Titulo [ " + title + " ] Tópico [ " + topic + " ] <br>";

	var connection = new WebSocket('ws://localhost:9060/server');
	connection.onmessage = function(res){
		
	}

	connection.onopen = function(){
		
			
	}

	connection.onclose = function(){

	}

}

function send(){
	var chat_input = document.getElementById("chat_input").value;
	var ul = document.getElementById("chat_area");
	var li = document.createElement("li");
	li.setAttribute("id","chat_msg");
	li.appendChild(document.createTextNode(chat_input));
	ul.appendChild(li);
	ul.scrollTop = list_area.scrollHeight;
	
	

}