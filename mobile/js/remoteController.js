"use strict";

var controller={
	
	init : function(){


		// Déclaration des Variables
		this.playpause=document.getElementById('playpause');
		this.fullscreen=document.getElementById('fullscreen');
		this.mute=document.getElementById('mute');
		this.volume=document.getElementById('volumeBar');
		this.cam1=document.getElementById('cam1');
		this.cam2=document.getElementById('cam2');
		this.cam3=document.getElementById('cam3');

		// Fonction pour accéder au socket
		model.getPlayer(function(){

			// Activer les évènements du player

			controller.playpause.addEventListener('click',function(){ controller.buttonClicked('playpause');
			},false);
			controller.playpause.addEventListener('touchend',function(){ controller.buttonClicked('playpause');
			}, false);

			controller.fullscreen.addEventListener('click',function(){ controller.buttonClicked('fullscreen');
			},false);
			controller.fullscreen.addEventListener('touchend',function(){ controller.buttonClicked('fullscreen');
			},false);

			controller.mute.addEventListener('click',function(){ controller.buttonClicked('mute');
			},false);
			controller.mute.addEventListener('touchend',function(){ controller.buttonClicked('mute');
			},false);

			controller.volume.addEventListener('change',controller.setVolume,false);

			controller.cam1.addEventListener('click',function(){ controller.buttonClicked('cam1');
			},false);
			controller.cam1.addEventListener('touchend',function(){ controller.buttonClicked('cam1');
			},false);

			controller.cam2.addEventListener('click',function(){ controller.buttonClicked('cam2');
			},false);
			controller.cam2.addEventListener('touchend',function(){ controller.buttonClicked('cam2');
			},false);

			controller.cam3.addEventListener('click',function(){ controller.buttonClicked('cam3');
			},false);
			controller.cam3.addEventListener('touchend',function(){ controller.buttonClicked('cam3');
			},false);
		});
	},

	// Fonction lancé lors du clic d'un bouton
	buttonClicked : function(button){
		var newVolume;

		// Si le bouton cliqué est mute
		if(button == 'mute' && controller.volume.value != 0){
			newVolume = controller.volume.value = 0;
			controller.setVolume(newVolume);
		}
		else if(button == 'mute' && controller.volume.value == 0){
			newVolume = controller.volume.value = 50;
			controller.setVolume(newVolume);
		}

		// Sinon
		else if(button != 'mute')
			model.socket.emit('buttonClicked', button);
	},

	// Fonction lancé si le volume est changé
	setVolume : function(){
		var numVolume = controller.volume.value;
		model.socket.emit('setVolume', numVolume);
	}

}
controller.init();