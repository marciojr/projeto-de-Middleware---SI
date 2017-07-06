window.onload = function() {

	var url = document.location.href;
	var helper = url.split("?");
	var username = helper[1].split("&")[0];
	var topics = helper[1].split("&")[1];

	document.getElementById("username").innerHTML += "User[  " + username +"  ] Tópicos Escolhidos[ " + topics + " ]" + "<br>";

	var connection = new WebSocket('ws://localhost:9070/server');
	connection.onmessage = function(res){
		var msg = res.data;
		var topic = msg.split("|");
		for (var i = 0; i < topic.length - 1; i++) {
			var tokens = topic[i].split(":");
			
			if(isTopic(topics,tokens[1])){
				addTopic(" ID[ "+ tokens[2] + " ] Tópico[ "+ tokens[0] + " ] Tipo[ "+ tokens[1] + " ]",username);
			}
		};
	}

	connection.onopen = function(){
		connection.send("loadBase");
			
	}

	connection.onclose = function(){

	}

}

function addUserName(){

}

function addTopic(msg,username){
	var ul = document.getElementById("list_area");
	var li = document.createElement("li");
	li.setAttribute("style", "font-size: 20px");
	li.setAttribute("id","topic")
	li.setAttribute("onClick","setChatDiscussion()")
	li.appendChild(document.createTextNode(msg));
	ul.appendChild(li);
	ul.scrollTop = list_area.scrollHeight;

}

function changeView(){
	location.href = "./tela2.html";

}

function isTopic(topics,topic){
	var arr = topics.split(",");

	for (var i = 0; i < arr.length; i++) {
		if(topic == arr[i]){
			return true
		}
	};
	return false
}

function setChatDiscussion(){
	var url = document.location.href;
	var helper = url.split("?");
	var username = helper[1].split("&")[0];
	var topics = helper[1].split("&")[1];

	if (confirm("Deseja Acessar o Chat deste Tópico?" ) == true) {
        document.location.href = "./tela3.html?"+username+"&"+topics;
    } 
}


