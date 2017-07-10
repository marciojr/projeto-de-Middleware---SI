var conn;
var topic;
var id;
var user;
var user_topic;
window.onload = function() {

	var url = document.location.href;
	var helper = url.split("?");
	var title = helper[1].split("&")[0];
	topic= helper[1].split("&")[1];
	user = helper[1].split("&")[2];
	user_topic = helper[1].split("&")[3];
	id = helper[1].split("&")[4]
	
	document.getElementById("chat_label").innerHTML = "User[  " + user +"  ] Titulo [ " + title + " ] Tópico [ " + topic + " ] <br>";

	var connection = new WebSocket('ws://localhost:9070/server');
	conn = connection;
	connection.onmessage = function(res){
		var msg = res.data;
		
		if(msg.indexOf("@#%$broadCastMsg@#%$") !== -1){
			send("sendedMsg:"+msg);
		}else{
			var topics = msg.split("|");
		
			for (var i = 0; i < topics.length - 1; i++) {
				var tokens = topics[i].split(":");
				if(isTopic(user_topic,tokens[1])){
					addTopic(" ID[ "+ tokens[2] + " ] Tópico[ "+ tokens[0] + " ] Tipo[ "+ tokens[1] + " ]",user, tokens[0]+":"+tokens[1]+":"+tokens[2]);	
				}
			};
		}
	}


	connection.onopen = function(){
		connection.send("@#$%loadBase%$#@");
		connection.send("@#%$add%$#@"+":"+user+":"+topic+":"+id);
		send('connect')
				
	}

	connection.onclose = function(){
		send('desconnect');
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
        send("@#$%changeChat%$#@:"+id+":"+aux[2]+":"+topic+":"+helper[1].split("&")[1])
    } 
}



function send(msg){
	var chat_input;
	var show;

	if(msg == "html"){
		chat_input = document.getElementById("chat_input").value;
		document.getElementById("chat_input").value = "";
		conn.send("@#$%broadCastMsg%$#@:" + id + ":" + topic + ":" + user + ":" + chat_input);
		show = true;
	}else if(msg == 'connect'){
		show = true;
		chat_input = "Você entrou no chat...";
		conn.send("@#$%broadCastMsg%$#@:"+ id + ":" + topic + ":" + user + ":" + "Usuário "+ user + " entrou no chat...");
	}else if(msg.indexOf("sendedMsg") !== -1){
		var helper = msg.split(":");
		if(helper[2] == user){
			show = false;
		}else{
			if(helper[3].indexOf("Usuário") !== -1){
				chat_input = helper[3];
			}else{
				chat_input = "[ "+ helper[2] + " ]  " + helper[3];
			}
			show = true;
		}
	}else if(msg == 'disconnect'){
		show = false;
		conn.send("@#$%delete%$#@:" + id + ":" + topic + ":" + user)
	}
	
	if(show){
		var ul = document.getElementById("chat_area");
		var li = document.createElement("li");
		li.setAttribute("id","chat_msg");
		li.appendChild(document.createTextNode(chat_input));
		ul.appendChild(li);
		ul.scrollTop = ul.scrollHeight;
	}
}

function disconnect(){
	console.log("disconnect")
	send("disconnect")
}



function upload(msg){

	console.log('ENTREI NA FACHADA!! '+ msg);
}

 var source = new EventSource("http://localhost:9000");

    source.onmessage = function(event) {
    	var data = JSON.parse(event.data); 
    	console.log(user_topic);
    	if(isTopic(user_topic,data.topico)){
    		addTopic(" ID[ "+ data.id + " ] Tópico[ "+ data.titulo + " ] Tipo[ "+ data.topico + " ]",user, data.titulo+":"+data.topico+":"+data.id);	
    	}
}
