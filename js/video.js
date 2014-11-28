'use strict';


var player={

	init:function(){

		// Déclaration des Variables
		this.audio=document.getElementById('audio');
		this.video=document.getElementById('video1');
		this.video2=document.getElementById('video2');
		this.video3=document.getElementById('video3');
		this.playpause=document.getElementById('playpause');
		this.fullscreen=document.getElementById('fullscreen');
		this.mute=document.getElementById('mute');
		this.volume=document.getElementById('volumeBar');
		this.pB=document.getElementById('progressBar');
		this.button=document.getElementById('button');
		this.button.classList.add('loading');
		this.currentTime=document.getElementById('currentTime');
		this.totalTime=document.getElementById('totalTime');
		this.cam1=document.getElementById('cam1');
		this.cam2=document.getElementById('cam2');
		this.cam3=document.getElementById('cam3');

		// Initialisation : barre de controle et les 2 dernières vidéos masqués
		document.getElementsByClassName('controls')[0].classList.add('controlsFadeout');
		player.video2.classList.add('videoHidden');
		player.video3.classList.add('videoHidden');

		// Fonction pour accéder au socket
		model.getCommands(function(buttonMobile){

			// Si le bouton est un nombre (= volume)
			if(!isNaN(parseInt(buttonMobile * 1))){
				player.volume.value = buttonMobile;
				player.audio.volume = player.volume.value / 100;	
			}

			// Sinon (= bouton)
			else{
				model.useButton(buttonMobile);
			}
		});

		// Chargement des vidéos
		model.load(function(){

			// Activer les évènements du player
			player.video.addEventListener('click',player.playPause,false);
			player.playpause.addEventListener('click',player.playPause,false);
			player.video2.addEventListener('click',player.playPause,false);
			player.video3.addEventListener('click',player.playPause,false);
			player.button.addEventListener('click',player.playPause,false);
			player.fullscreen.addEventListener('click',player.toggleFullScreen,false);
			player.mute.addEventListener('click',player.setMute,false);
			player.audio.addEventListener('timeupdate',player.playProgress,false);
			player.audio.addEventListener('progress',player.bufferProgress,false);
			player.audio.addEventListener('timeupdate',player.seekTimeUpdate,false);
			player.volume.addEventListener('change',player.setVolume,false);
			player.pB.addEventListener('click',player.setVideoTime,false);
			player.cam1.addEventListener('click',player.changeCamera1,false);
			player.cam2.addEventListener('click',player.changeCamera2,false);
			player.cam3.addEventListener('click',player.changeCamera3,false);
			document.getElementById('videoContainer').addEventListener('mouseout', function(){ 
				document.getElementsByClassName('controls')[0].classList.add('controlsFadeout'); 
			},false);
			document.getElementById('videoContainer').addEventListener('mouseover', function(){ 
				document.getElementsByClassName('controls')[0].classList.remove('controlsFadeout'); 
			},false);
		});

	},

	// Faire avancer la barre de progression du player
	playProgress:function(){
		var self=this;
		var progress=self.currentTime*100/self.duration;
		document.querySelector('.progress').style.width=progress+'%';
	},

	// Activation de play ou pause
	playPause:function(){
		player.button.classList.remove('loading');

		// Si l'audio est en pause, on met le player sur play
		if(player.audio.paused){
			player.button.style.visibility="hidden";
			player.audio.play();
			player.video.play();
			player.button.classList.add('play');
			document.getElementById('playpause').src = 'img/player/pause.png';
		}

		// Sinon on met le player sur pause
		else{
			player.button.style.visibility="visible";
			player.audio.pause();
			player.video.pause();
			player.button.classList.remove('play');
			document.getElementById('playpause').src = 'img/player/play.png';
		}	
	},

	// Fonction lors du clic de l'utilisateur sur la barre de progression
	setVideoTime:function(e){
		e.stopPropagation();
		player.audio.currentTime=e.offsetX*player.audio.duration/this.offsetWidth;
		console.log(player.audio.paused);

		// Si l'audio est en pause lors du clic, on garde le player en pause
		if(player.audio.paused){
			player.audio.pause();
			player.video.pause();
		}

		// Sinon on garde le player sur play
		else{
			player.audio.play();
			player.video.play();
		}	
	},

	// Progresion du buffer
	bufferProgress:function(){
		// Buffer en fonction de l'audio
	    var bufferedEnd = player.audio.buffered.end(player.audio.buffered.length - 1);
	    var duration =  player.audio.duration;
	    if (duration > 0) {
	      document.querySelector('.buffer').style.width = ((bufferedEnd / duration)*100) + "%";
	    }
	},

	// Initialisation et actualisation du temps de l'audio
	seekTimeUpdate:function(){
		var curmins = Math.floor(player.audio.currentTime / 60);
		var cursecs = Math.floor(player.audio.currentTime - curmins * 60);
		var durmins = Math.floor(player.audio.duration / 60);
		var dursecs = Math.floor(player.audio.duration - durmins * 60);
		player.video.currentTime = player.audio.currentTime;
		UI.showTime(cursecs,curmins,durmins,dursecs);
	},

	// Appel de la fonction pour mettre en place le fullscreen
	toggleFullScreen:function() {
		model.setFullscreen();
	},

	// Appel de la fonction pour mettre en place l'audio en mute
	setMute:function(){
		model.mute();
	},

	// Changement du volume
	setVolume:function(){
		player.audio.volume = player.volume.value / 100;

		if(player.audio.volume == 0)
			document.getElementById('mute').src = 'img/player/mute.png';

		else
			document.getElementById('mute').src = 'img/player/volume.png';

		// Envoi de l'information au server
		model.socket.emit('changeVolume',player.volume.value);
	},

	// Appel de la caméra 1
	changeCamera1:function(){

		var old_video=player.video;
		player.video=document.getElementById('video1');

		// Si le nouveau player est le même que l'actuel
		if(player.video==old_video){
			console.log('same video');
		}

		// Sinon
		else {

			// Apparition et disparition des vidéos
			document.getElementById('video1').classList.remove('videoHidden');
			document.getElementById('video2').classList.add('videoHidden');
			document.getElementById('video3').classList.add('videoHidden');

			document.getElementById('video1').classList.add('videoOverlay');
			document.getElementById('video2').classList.remove('videoOverlay');
			document.getElementById('video3').classList.remove('videoOverlay');

			// Le temps des vidéos est mis à hauteur du temps de l'audio
			player.video.currentTime = player.audio.currentTime;
			document.getElementById('video2').currentTime = player.audio.currentTime;
			document.getElementById('video3').currentTime = player.audio.currentTime;

			// Si l'audio est en pause, la vidéo est en pause
			if(player.audio.paused){
				player.video.pause();
			}
			// Si la vidéo est sur play
			else{
				player.video.play();
			}
			old_video.pause();
		}
	},

	// Appel de la caméra 2
	changeCamera2:function(){

		var old_video=player.video;
		player.video=document.getElementById('video2');

		// Si le nouveau player est le même que l'actuel
		if(player.video==old_video){
			console.log('same video');
		}

		// Sinon
		else {

			// Apparition et disparition des vidéos
			document.getElementById('video1').classList.add('videoHidden');
			document.getElementById('video2').classList.remove('videoHidden');
			document.getElementById('video3').classList.add('videoHidden');

			document.getElementById('video1').classList.remove('videoOverlay');
			document.getElementById('video2').classList.add('videoOverlay');
			document.getElementById('video3').classList.remove('videoOverlay');

			// Le temps des vidéos est mis à hauteur du temps de l'audio
			player.video.currentTime = player.audio.currentTime;
			document.getElementById('video1').currentTime = player.audio.currentTime;
			document.getElementById('video3').currentTime = player.audio.currentTime;

			// Si l'audio est en pause, la vidéo est en pause
			if(player.audio.paused){
				player.video.pause();
			}

			// Si la vidéo est sur play
			else{
				player.video.play();
			}
			old_video.pause();
		}
	},

	// Appel de la caméra 3
	changeCamera3:function(){

		var old_video=player.video;
		player.video=document.getElementById('video3');

		// Si le nouveau player est le même que l'actuel
		if(player.video==old_video){
			console.log('same video');
		}

		// Sinon
		else {

			// Apparition et disparition des vidéos
			document.getElementById('video1').classList.add('videoHidden');
			document.getElementById('video2').classList.add('videoHidden');
			document.getElementById('video3').classList.remove('videoHidden');

			document.getElementById('video1').classList.remove('videoOverlay');
			document.getElementById('video2').classList.remove('videoOverlay');
			document.getElementById('video3').classList.add('videoOverlay');

			// Le temps des vidéos est mis à hauteur du temps de l'audio
			player.video.currentTime = player.audio.currentTime;
			document.getElementById('video1').currentTime = player.audio.currentTime;
			document.getElementById('video2').currentTime = player.audio.currentTime;

			// Si l'audio est en pause, la vidéo est en pause
			if(player.audio.paused){
				player.video.pause();
			}
			// Si la vidéo est sur play
			else{
				player.video.play();
			}
			old_video.pause();
		}
	},

}
player.init();

