/*Fachada da Tela002 - Tela de Criação da Discussão*/

function create(){
	var connection = new WebSocket('ws://localhost:9080/server');
	var title = document.getElementById("title").value;
	var option = document.getElementById("options").value;
	var url = document.location.href;
	var helper = url.split("?");

	if(title == null || title === undefined || title == ""){
		alert("Por Favor, adicionar o título do Tópico!");
			location.href = "./tela2.html";
	} else {
		connection.onmessage = function(res){
			var msg = res.data;
			if(msg.indexOf("Sucesso") !== -1){
				alert(msg);
				connection.send("updateTopics");
				location.href = "./tela3.html?"+title+"&"+option+"&"+helper[1];

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