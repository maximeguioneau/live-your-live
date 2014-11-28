"use strict";

var model={
	
	getPlayer : function(callback){

		// Connexion au socket
		this.socket= io.connect('http://Maxime.local:3000');
		this.socket.emit('getPlayer');
		callback.call(this);

		// Récupération du volume changé par le desktop
		this.socket.on('getVolume',function(numVolume){
			controller.volume.value = numVolume;
		});
	},
	
}