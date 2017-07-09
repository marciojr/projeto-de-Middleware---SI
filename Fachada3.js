window.onload = function() {

	var url = document.location.href;
	var helper = url.split("?");
	var title = helper[1].split("&")[0];
	var topic = helper[1].split("&")[1];
	var user = helper[1].split("&")[2];
	var user_topic = helper[1].split("&")[3];
	
	document.getElementById("chat_label").innerHTML = "User[  " + user +"  ] Titulo [ " + title + " ] Tópico [ " + topic + " ] <br>";

	var connection = new WebSocket('ws://localhost:9070/server');
	
	connection.onmessage = function(res){
		var msg = res.data;
		var topics = msg.split("|");
		
		for (var i = 0; i < topics.length - 1; i++) {
			var tokens = topics[i].split(":");
			if(isTopic(user_topic,tokens[1])){
				addTopic(" ID[ "+ tokens[2] + " ] Tópico[ "+ tokens[0] + " ] Tipo[ "+ tokens[1] + " ]",user, tokens[0]+":"+tokens[1]+":"+tokens[2]);
				
			}
		};
	}


	connection.onopen = function(){
		connection.send("loadBase");

				
	}

	connection.onclose = function(){

	}
	
}

function addTopic(msg,username,name_topic){
	var ul = document.getElementById("topics_area");
	var li = document.createElement("li");
	li.setAttribute("style", "font-size: 15px");
	li.setAttribute("id","topic")
	li.setAttribute("value", name_topic);
	li.setAttribute("onClick","setChatDiscussion(this)");
	li.appendChild(document.createTextNode(msg));
	ul.appendChild(li);
	ul.scrollTop = ul.scrollHeight;
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
	var username = helper[1].split("&")[2];
	var topics = helper[1].split("&")[3];

	if (confirm("Deseja Acessar o Chat deste Tópico?" ) == true) {
        document.location.href = "./tela3.html?"+aux[0]+"&"+aux[1]+"&"+username+"&"+topics+"&"+aux[2];
    } 
}



function send(){
	var chat_input = document.getElementById("chat_input").value;
	document.getElementById("chat_input").value = "";
	var ul = document.getElementById("chat_area");
	var li = document.createElement("li");
	li.setAttribute("id","chat_msg");
	li.appendChild(document.createTextNode(chat_input));
	ul.appendChild(li);
	ul.scrollTop = list_area.scrollHeight;

}


/*
 var source = new EventSource("http://localhost:9090");

    source.onmessage = function(event) {
    	addTopic();
        document.getElementById("result").innerHTML += event.data + "<br>";
}
*/