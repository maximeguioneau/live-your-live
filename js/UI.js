'use strict';

var UI={

	// Affichage du temps dans la barre de controle
	showTime:function(cursecs,curmins,durmins,dursecs){
		if(cursecs < 10){ cursecs = "0"+cursecs; }
		if(dursecs < 10){ dursecs = "0"+dursecs; }
		if(curmins < 10){ curmins = "0"+curmins; }
		if(durmins < 10){ durmins = "0"+durmins; }
		currentTime.innerHTML = curmins+":"+cursecs;
		totalTime.innerHTML = durmins+":"+dursecs;
	},

}