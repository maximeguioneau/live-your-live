'use strict';

var model={

	getCommands : function(callback){
		var buttonSelected='null';

		var currentVolume = player.volume.value / 100;

		// Connexion au socket
		this.socket= io.connect('http://Maxime.local:3000');

		// Envoi du volume au server
		this.socket.emit('getCommands',currentVolume);

		// Récupération du bouton cliqué sur le mobile
		this.socket.on('commandButton',function(button){
			buttonSelected = button;
			callback.call(this,buttonSelected);
		});

		// Récupération du volume changé par le mobile
		this.socket.on('commandVolume',function(numVolume){
			buttonSelected = numVolume;
			callback.call(this,buttonSelected);
		});

	},
	
	// Appliquer le bouton cliqué avec le mobile
	useButton : function(buttonMobile){
		if(buttonMobile=='playpause')
			player.playPause();

		else if(buttonMobile=='fullscreen'){
			console.log('player.toggleFullScreen');
			player.toggleFullScreen();
		}		

		else if(buttonMobile=='cam1')
			player.changeCamera1();

		else if(buttonMobile=='cam2')
			player.changeCamera2();

		else if(buttonMobile=='cam3')
			player.changeCamera3();
	},

	// Chargement du player
	load:function(callback){

		var loadAud = false, loadVid1 = false, loadVid2 = false, loadVid3 = false;
		var timeout;

		// Chargement de l'audio et des vidéos
		player.audio.load();
		player.video.load();
		player.video2.load();
		player.video3.load();
		console.log('load ok');

		// Initialisation du volume à 50%
		player.audio.volume = 0.5;
		
		// Initialisation du volume des vidéos à 0
		player.video.volume = 0;
		player.video2.volume = 0;
		player.video3.volume = 0;
		
		callback.call(this);
		
	},

	// Appliquer le fullscreen
	setFullscreen:function(){
		console.log('fullscreen : '+player.video);
		if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)){
			if(player.video.requestFullScreen) {
		        player.video.requestFullScreen();
		    } else if(player.video.webkitRequestFullScreen) {
		        player.video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		    } else if(player.video.mozRequestFullScreen){
		        player.video.mozRequestFullScreen();
		    } else {
		        alert('Votre navigateur ne supporte pas le mode plein écran, veuillez le mettre à jour pour utiliser ce service');
		    }
		}
	    else {
		    if (document.cancelFullScreen) {
		    	document.cancelFullScreen();
		    } else if (document.mozCancelFullScreen) {
		    	document.mozCancelFullScreen();
		    } else if (document.webkitCancelFullScreen) {
		    	document.webkitCancelFullScreen();
		    }
		}
	},

	// Couper le son
	mute:function(){

		// Si l'audio est muté
		if(player.audio.muted){
			player.audio.muted = false;
			player.mute.innerHTML = "Mute";
			player.volume.value = 50;
			document.getElementById('mute').src = 'img/player/volume.png';
		}

		// Si l'audio est actif
		else {
			player.audio.muted = true;
			player.mute.innerHTML = "Unmute";
			player.volume.value = 0;
			document.getElementById('mute').src = 'img/player/mute.png';
		}

		// Envoi de l'information au server
		socket.emit('setVolume', player.volume.value);
		socket.emit('changeVolume', player.volume.value);
	},

}