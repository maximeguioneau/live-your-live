
var remote={
	init : function(){

		// Mis en place de socket.io
		this.io = require('socket.io').listen(3000);
		this.io.sockets.on('connection',this.listen);

	},
	
	listen : function(socket){

		// Lors du clic sur un bouton sur le mobile
		socket.on('buttonClicked',function(button){
			// Envoi de la valeur cliqué au desktop
			remote.io.sockets.emit('commandButton', button);	
		});

		// Lors du changement du volume sur le mobile
		socket.on('setVolume',function(numVolume){
			// Envoi de la valeur du volume au desktop
			remote.io.sockets.emit('commandVolume', numVolume);
		});

		// Lors du changement du volume sur le desktop
		socket.on('changeVolume',function(numVolume){
			// Envoi de la valeur du volume au mobile
			remote.io.sockets.emit('getVolume',remote.volume);
		});

	}
	
};
remote.init();