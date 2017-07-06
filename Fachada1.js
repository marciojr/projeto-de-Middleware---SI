/*Fachada da Tela001 - Tela de Listagem dos Tópicos*/

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
				addTopic(" ID[ "+ tokens[2] + " ] Tópico[ "+ tokens[0] + " ] Tipo[ "+ tokens[1] + " ]",username, tokens[0]+":"+tokens[1]);
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

function addTopic(msg,username,name_topic){
	var ul = document.getElementById("list_area");
	var li = document.createElement("li");
	li.setAttribute("style", "font-size: 30px");
	li.setAttribute("id","topic")
	li.setAttribute("value", name_topic);
	li.setAttribute("onClick","setChatDiscussion(this)");
	li.appendChild(document.createTextNode(msg));
	ul.appendChild(li);
	ul.scrollTop = ul.scrollHeight;

}

function changeView(){
	var url = document.location.href;
	var helper = url.split("?");
	var username = helper[1].split("&")[0];
	location.href = "./tela2.html?"+username;

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

function setChatDiscussion(res){
	var value = $(res).attr('value');
	var aux = value.split(":")


	var url = document.location.href;
	var helper = url.split("?");
	var username = helper[1].split("&")[0];
	var topics = helper[1].split("&")[1];
	
	console.log(res);

	if (confirm("Deseja Acessar o Chat deste Tópico?" ) == true) {
        document.location.href = "./tela3.html?"+aux[0]+"&"+aux[1]+"&"+username+"&"+topics;
    } 
}