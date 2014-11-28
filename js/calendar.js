$(document).ready(function() {

		// Date actuelle
    	var actualDate = new Date();
    	var month = actualDate.getUTCMonth() + 1;
		var day = actualDate.getUTCDate();
		var year = actualDate.getUTCFullYear();

		// Récupération de la lise des concerts à venir via l'API Songkick
		  $.ajax({
			  url:  "http://api.songkick.com/api/3.0/metro_areas/28909/calendar.json?apikey=hSIVvYCGQWO4SX0N&per_page=100&jsoncallback=?",
			  dataType:   "jsonp",
			  success:    function(data){

			  	var num=0;
			  	var cate;

			  	// Pour chaque résultat
			    $.each(data["resultsPage"]["results"]["event"], function(i, entry){
			    	
			    		// Triage des selon la popularité du concert
				    	if(entry["popularity"]>0.003){

				    		// Conversion de la date du concert
							newdate = year + "-" + month + "-" + day;
					    	var dateEN = entry["start"]["date"];

					    	// Récupération de l'artiste
					    	var artist = entry["displayName"];
					    	var artist = artist.split('at');

					    	// Si le nom de l'artiste est trop long, on réduit le nombre de caractères
					    	if(artist[0].length > 20){
					    		artist[0] = artist[0].substring(0,17)+'...';
					    	}

					    	// Affichage des 27 premiers concerts dans le HTML en 3 colonnes
					    	if(dateEN>=newdate){
					    		var tabEN = dateEN.split('-');

					    		if(num<9){
					    			cate = '#day1';
					    			$(cate).append('<a href="#"><span class="bolddate">'+tabEN[2]+'.'+tabEN[1]+'</span> '+artist[0]+' ('+entry["venue"]["displayName"]+')</a><br />');
					    		}

					    		else if(num>=9 && num<18){
					    			cate = '#day2';
					    			$(cate).append('<a href="#"><span class="bolddate">'+tabEN[2]+'.'+tabEN[1]+'</span> '+artist[0]+' ('+entry["venue"]["displayName"]+')</a><br />');
					    		}

					    		else if(num>=18 && num<27){
					    			cate = '#day3';
					    			$(cate).append('<a href="#"><span class="bolddate">'+tabEN[2]+'.'+tabEN[1]+'</span> '+artist[0]+' ('+entry["venue"]["displayName"]+')</a><br />');
					    		}

					        	num++;
					    	}

				    	}

			    });

			  }

		  });

});