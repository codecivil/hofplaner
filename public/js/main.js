//all forEach occurences replaced by for (count index) loop
//all innerText replaced by innerHTML
//all .append by .appendChild
//for compatibility to older browsers

//config
_hof_walktime = 1800; //blocked time after screenings (including lateness and director Q&A) for walking to next screening
//

function is_touch_device() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
	return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
	return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

//seems not to be necessary
function adaptTouchiness() {
	if ( false ) {
//	if ( is_touch_device() ) {
		_onclicks = document.querySelectorAll('[onclick]');
		_onclick = new Array();
		for ( var i = 0; i<_onclicks.length; i++) {
			clickable = _onclicks[i];
			_onclick[i] = clickable.onclick;
			clickable.addEventListener('touchstart', _onclick[i], false);
			clickable.setAttribute('onclick',"return false");			
		}
		_onsubmits = document.querySelectorAll('input[type="submit"]');
		_onsubmit = new Array();
		for ( var i = 0; i<_onsubmits.length; i++ ) {
			clickable = _onsubmits[i];
			console.log(_onsubmit[i]);
			if ( clickable.parentElement.tagName == "FORM" ) {
				_onsubmit[i] = clickable.parentElement.onsubmit;
				clickable.addEventListener('touchstart', _onsubmit[i], false);
				clickable.parentElement.setAttribute('onsubmit',"return false");			
			} else {
				_form = document.getElementById(clickable.getAttribute('form'));
				_onsubmit[i] = _form.onsubmit;
				clickable.addEventListener('touchstart', _onsubmit[i], false);
				_form.setAttribute('onsubmit',"return false");			
			}			
		};
	}
}

function toggle(id) {
	el = document.getElementById(id);
	el.hidden = ! el.hidden;
	if ( ! el.hidden ) { el.scrollIntoView(); }
	return false;
}

function unhide(id) {
	el = document.getElementById(id);
	el.hidden = "";
	adaptTouchiness;
	el.scrollIntoView({behavior:"smooth"});
//	_previous = el.previousElementSibling;
//	setTimeout(function(){hide(_previous.id);},700);
	return false;
}

function hide(id) {
	el = document.getElementById(id);
	el.hidden = "hidden";
	return false;
}

function toggleClass(classname) {
	elements = document.querySelectorAll('.'+classname);
	status = ! elements[0].checked;
	for ( var i=0; i<elements.length; i++) { 
		el = elements[i];
		el.checked = ( status == "true" ); 
	};
}

function _back(el) {
	_section = el.parentElement.parentElement;
	_previous = _section.previousElementSibling;
	if ( _previous == null ) { unhide('info'); 	setTimeout(function(){hide('planung');},500); }
	else {
		unhide(_previous.id);
		setTimeout(function(){hide(_section.id);},500);
	}
}

function getTitles(form,callback) {
	var _titleinputs = form.querySelectorAll('input:checked');
	var _titles = new Array();
	for ( var i = 0; i<_titleinputs.length; i++) { _titles.push(_titleinputs[i].value); };
	document.getElementById('tmp_titles').innerHTML = JSON.stringify(_titles);
	if (callback) { callback(); };	
}

//tmp = true; save screenings only in tmp div
function getMovies(tmp) {
	try { var _titles = JSON.parse(document.getElementById('tmp_titles').innerHTML); } catch(error) { var _titles = JSON.parse(document.getElementById('tmp_titles').innerText); }
	try { var _removedtitles = JSON.parse(document.getElementById('tmp_removedtitles').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_removedtitles').innerText); }
	try { var _removedmovies = JSON.parse(document.getElementById('tmp_removedmovies').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_removedmovies').innerText); }
	//for iPhone compatibility: iPhone cannot parse the innerHTML as JSON...
	try { var _allMovies = JSON.parse(document.getElementById('database').innerHTML); } catch(error) { var _allMovies = JSON.parse(document.getElementById('database').innerText); }
	//put long and short movies together
	var _combinedmovies = new Array();
	var _longmovie = new Object();
	var _shortmovie = new Object();
	_allMovies = _allMovies.sort((mv1,mv2)=> ( mv1.identifier - mv2.identifier )); // sort by identifier, - instead of > for comp. with LineageOS (Android 7)
	for ( var i = 0; i < _allMovies.length; i++ ) {
		if ( _allMovies[i+1] && _allMovies[i+1].identifier == _allMovies[i].identifier ) {
			if ( ( _allMovies[i+1].unixtimeend - _allMovies[i+1].unixtimestart) > ( _allMovies[i].unixtimeend - _allMovies[i].unixtimestart ) ) {
				_longmovie = _allMovies[i+1]; _shortmovie = _allMovies[i]; _splice = i;
			} else {
				_longmovie = _allMovies[i]; _shortmovie = _allMovies[i+1]; _splice = i+1;
			}
			_longmovie.unixtimeend += _shortmovie.unixtimeend - _shortmovie.unixtimestart;
		}
	}
	//determine selected movies and remove removed movies from selected movies
	var _movies = _allMovies.filter(function(movie){ return ( _titles.indexOf(movie.title) != -1 && _removedmovies.indexOf(movie.identifier) == -1 ); });
	//cleanup removed categories
	//...later 
	_combinedmovies = _movies.sort((mv1,mv2)=> ( mv1.identifier > mv2.identifier )); // sort by identifier
	//is this test correct? Do we have to test all orders of same identifier screenings?
	for ( var i = 0; i < _combinedmovies.length; i++ ) {
		if ( _combinedmovies[i+1] && _combinedmovies[i+1].identifier == _combinedmovies[i].identifier ) {
			if ( ( _combinedmovies[i+1].unixtimeend - _combinedmovies[i+1].unixtimestart) > ( _combinedmovies[i].unixtimeend - _combinedmovies[i].unixtimestart ) ) {
				_longmovie = _combinedmovies[i+1]; _shortmovie = _combinedmovies[i]; _splice = i;
			} else {
				_longmovie = _combinedmovies[i]; _shortmovie = _combinedmovies[i+1]; _splice = i+1;
			}
			var _tmptitle = _longmovie.title + ' + '+_shortmovie.title;
			if ( _removedtitles.indexOf(_tmptitle) == -1 ) {
				_longmovie.title = _tmptitle;
				_combinedmovies.splice(_splice,1);
				i--;
			}
		}
	}
	//add _hof_walktime to screening
	for ( var i = 0; i < _combinedmovies.length; i++ ) {
		_combinedmovies[i].unixtimeend += _hof_walktime;
	}
	_movies = _combinedmovies.sort((mv1,mv2)=> (''+mv1.title).localeCompare(mv2.title) );
	//
	if ( tmp ) {
		document.getElementById('tmp_movies').innerHTML = JSON.stringify(_movies);
	} else {
		document.getElementById('movieshidden').innerHTML = JSON.stringify(_movies);
		unhide('marksoldout');	
	}
/*	phpscript = "/functions/getMovies.php";
	var _request = new XMLHttpRequest();
	var el = document.getElementById('movieshidden');
	_request.onload = function() { el.innerHTML = _request.responseText; }
	_request.open(form.method,phpscript,true);
	_request.send(new FormData (form));
*/
	return false;
}

function generateFormSoldOut() {
	el = document.getElementById('formSoldOut');
	el.innerHTML = '';
	try { var _movies = JSON.parse(document.getElementById('movieshidden').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('movieshidden').innerText); }
//	_movies = JSON.parse(document.getElementById('movieshidden').innerHTML);
	for ( var index=0; index<_movies.length; index++) { 
		movie = _movies[index];
		movie.begin = new Date(movie.unixtimestart*1000);
		movie.end = new Date((movie.unixtimeend-_hof_walktime)*1000);
		movie.time = movie.begin.getDate()+'.'+(movie.begin.getMonth()+1)+'., '+movie.begin.getHours()+':'+(movie.begin.getMinutes()<10?'0':'')+movie.begin.getMinutes()+' - '+movie.end.getHours()+':'+(movie.end.getMinutes()<10?'0':'')+movie.end.getMinutes();
		el.innerHTML += '\
			<input type="checkbox" hidden id="soldout_'+index+'" value="'+movie.id+'"> \
			<label for="soldout_'+index+'"> \
				<h5>'+movie.title+'</h5> \
				<h3>'+movie.identifier+'</h5> \
				<p>'+movie.time+'</p> \
				<p>'+movie.extras+'</p> \
			</label>'
	};
	el.innerHTML += '<input type="submit" id="submitSoldOut" hidden /><label for="submitSoldOut"></label>';
	unhide(el.id);
 }

function markSoldOut(form) {
	_soldout = form.querySelectorAll('input:checked');
	_soldoutids = new Array();
	for ( var i=0; i<_soldout.length; i++) { 
		option = _soldout[i];
		_soldoutids.push(option.value);
	};
	document.getElementById('soldouthidden').innerHTML = JSON.stringify(_soldoutids);
	unhide('choosetimes');
}

function getTimes(form) {
	formname = form.id;
	_available = document.getElementById(formname).parentElement.querySelectorAll('input[form="'+formname+'"]:checked');
	_return = new Array();
	for ( var i=0; i<_available.length; i++) { 
		interval = _available[i];
		_return.push(JSON.parse(interval.value));
	};
	var el = document.getElementById('timeshidden');
	el.innerHTML = JSON.stringify(addIntervals(_return));
}

function getAllTimes(form) {
	formname = form.id;
	_available = document.getElementById(formname).parentElement.querySelectorAll('input[form="'+formname+'"][type="checkbox"]');
	_return = new Array();
	for ( var i=0; i<_available.length; i++) { 
		interval = _available[i];
		_return.push(JSON.parse(interval.value));
	};
	var el = document.getElementById('timeshidden');
	el.innerHTML = JSON.stringify(addIntervals(_return));
}

function addIntervals(intervalsarray) {
	intervalsarray = intervalsarray.sort((a,b)=>a[0]-b[0]); // sort ascending by interval begin
	for ( var i=0; i<intervalsarray.length; i++ ) {
		//combine overlapping intervals
		if ( intervalsarray[i+1] && intervalsarray[i][1] >= intervalsarray[i+1][0] ) {
			intervalsarray[i][1] = intervalsarray[i+1][1];
			intervalsarray.splice(i+1,1);
			i--;
		}
	}
	return intervalsarray;
}

//minuend: array of intervals, subtrahend: one interval
function removeIntervals(minuend,subtrahend) {
	minuend = minuend.sort((a,b)=>a[0]-b[0]); // sort ascending by interval begin
	for ( var i=0; i<minuend.length; i++ ) {
		//reduce intervals when hitting the subtrahend
		// // minuend is contained in subtrahend
		if ( minuend[i][0] >= subtrahend[0] && minuend[i][1] <= subtrahend[1] ) {
			minuend.splice(i,1);
			i--;
		}
		// // subtrahend overlaps from left
		if ( minuend[i][0] >= subtrahend[0] && minuend[i][0] <= subtrahend[1] && minuend[i][1] > subtrahend[1] ) {
			minuend[i][0] = subtrahend[1];
		}
		// // subtrahend overlaps from right
		if ( minuend[i][0] < subtrahend[0] && minuend[i][1] > subtrahend[0] && minuend[i][1] <= subtrahend[1] ) {
			minuend[i][1] = subtrahend[0];
		}
		// // subtrahend is contained in minuend
		if ( minuend[i][0] < subtrahend[0] && minuend[i][1] > subtrahend[1] ) {
			newinterval = [subtrahend[1],minuend[i][1]];
			minuend[i][1] = subtrahend[0];
			minuend.splice(i+1,0,newinterval);
			i++;
		}
		
	}
	minuend = minuend.sort((a,b)=>a[0]-b[0]); // should not be necessary; omit it?
	return minuend;
}

function fitsInto(intervalsarray,interval) {
	_return = false;
	for (var i=0; i<intervalsarray.length; i++) { 
		iv = intervalsarray[i];
		if ( iv[0] <= interval[0] && iv[1] >= interval[1] ) { _return = true; }
	};
	return _return;
}

function prepareStorage(callback) {
	document.getElementById('tmp_movies').innerHTML = document.getElementById('movieshidden').innerHTML;
	document.getElementById('tmp_times').innerHTML = document.getElementById('timeshidden').innerHTML;
	document.getElementById('tmp_soldout').innerHTML = document.getElementById('soldouthidden').innerHTML;
	document.getElementById('tmp_results').innerHTML = document.getElementById('resultshidden').innerHTML;
	document.getElementById('tmp_unavailable').innerHTML = document.getElementById('unavailablehidden').innerHTML;
	if (callback) { callback(); };	
}

function getResults(callback,tmp) {
	unhide('progress');
	unhide('getresult_wrapper');
//	document.getElementById('computation').innerHTML = "<div class=\"button\">Mögliche Filmpläne werden berechnet...</div>";
	document.getElementById('submitOrder').disabled = true;
	try { var _movies = JSON.parse(document.getElementById('tmp_movies').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_movies').innerText); }
//	_movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	_times = JSON.parse(document.getElementById('tmp_times').innerHTML);
	_titles_before = _movies.filter((el,i,a)=>( ! a[i+1] || el.title != a[i+1].title)); //get the unique titles (from the sorted array!)
	_soldout = JSON.parse(document.getElementById('tmp_soldout').innerHTML);
	//remove soldout movies
	if ( _soldout && _soldout.length > 0) {
		_movies = _movies.filter(movie=>(_soldout.indexOf(movie.id.toString()) == -1));
	}
	// remove movies that do not fit into the user's timetable
	for ( var index=0; index<_movies.length; index++) { 
		var movie = _movies[index];
		var interval = [movie.unixtimestart,movie.unixtimeend];
		if ( ! fitsInto(_times,interval) ) { _movies.splice(index,1); index--; }
	};	
	// get titles (maybe some were removed)
	_titles = _movies.filter((el,i,a)=>( ! a[i+1] || el.title != a[i+1].title)); //get the unique titles (from the sorted array!)
	var _onlytitles = new Array(); //really only titles, not movie objects
	for ( var i = 0; i<_titles.length; i++ ) {
		_onlytitles.push(_titles[i].title);
	}
	_impossible = _titles_before.filter(title=>( _onlytitles.indexOf(title.title) == -1 ));
	//implement "combined screenings first" policy: keep only most combined screenings
	for ( var i=0; i<_titles.length; i++ ) {
		var _title_array = _titles[i].title.split(' + ');
		console.log(_title_array);
		var _combination = _title_array.length;
		for ( var j=0; j<_titles.length; j++) {
			var _othertitle = _titles[j].title;
			var _tobeignored = false;
			if ( _othertitle.split(' + ').length < _combination ) {
				_tobeignored = true;
				var _othertitle_array = _othertitle.split(' + ');
				console.log('Test:'); console.log(_othertitle_array);
				for ( var k=0; k<_othertitle_array.length; k++ ) {
					if ( _title_array.indexOf(_othertitle_array[k]) == -1 ) { _tobeignored = false; }
					console.log(_tobeignored);
				}
			}
			if ( _tobeignored ) { 
				_titles.splice(j,1);
				console.log(_titles);
			}
		}
	}
	// prepare iteration
	_movieswithtitle = new Array();
	_prod = [1]; //combinations as multibased number representations
	_factor = new Array();
	for ( var i=0; i<_titles.length; i++) { 
		title = _titles[i];
		_movieswithtitle.push(_movies.filter(el=>(el.title == title.title)));
		_prod.push(_movieswithtitle[_movieswithtitle.length-1].length*_prod[_prod.length-1]);
		_factor.push(_movieswithtitle[_movieswithtitle.length-1].length);
	};
	// now check all possibilities
	resultsWorker = new Worker('/js/worker.js');
	var _results = new Array();
	var _initialize = new Object();
	_initialize._times = JSON.parse(document.getElementById('tmp_times').innerHTML);
	_initialize._prod = _prod;
	_initialize._factor = _factor;
	_initialize._titles = _titles;
	_initialize._movieswithtitle = _movieswithtitle;
	resultsWorker.postMessage(_initialize);
	resultsWorker.onmessage = function(e) {
		if ( ! e.data.msgtype ) { return; }
		console.log(e.data);
		switch(e.data.msgtype) {
		case 'progress':
			var progress = document.getElementById('progress');
			progress.querySelector('.number').innerText = e.data.msg + ' %';
			progress.querySelector('.bar').style.width = Math.max(e.data.msg,5) + '%';
			break;
		case 'result':
			hide('progress');
			_results = e.data.msg;
			switch( _results.length) {
				case 0:
					document.getElementById('getresult').innerHTML = "<strong>Leider ist Deine Auswahl so nicht möglich.</strong> Bitte reduziere die Anzahl der gewählten Filme oder erweitere Deine vefügbaren Zeiten.";
					break;
				case 1:
					document.getElementById('getresult').innerHTML = "<strong>Glück gehabt!</strong> Es gibt genau einen möglichen Filmplan.";
					document.getElementById('submitOrder').disabled = false;
					break;
				default:
					document.getElementById('getresult').innerHTML = "<strong>"+_results.length + "</strong> Möglichkeiten wurden gefunden.";
					document.getElementById('submitOrder').disabled = false;
			}
			if ( _impossible.length > 0 ) {
				document.getElementById('getresult').innerHTML += '<p>Folgende Filme laufen dann aber nie:</p><ul>';
				for ( var i=0; i<_impossible.length; i++) { 
					title = _impossible[i];
					document.getElementById('getresult').innerHTML += '<li>'+title.title+'</li>';
				}; 
				document.getElementById('getresult').innerHTML += '</ul>';
			}	
			document.getElementById('tmp_results').innerHTML = JSON.stringify(_results);
			if ( ! tmp ) { document.getElementById('resultshidden').innerHTML = JSON.stringify(_results); };
//			document.getElementById('computation').innerHTML += "<p>Scrolle nun nach unten, falls dies nicht automatisch passiert.</p>";
			if (callback) { callback(); };
			break;
		}
	}
}

function startOrder() {
	try { var _movies = JSON.parse(document.getElementById('tmp_movies').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_movies').innerText); }
//	_movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	_results = JSON.parse(document.getElementById('tmp_results').innerHTML);
	if ( _results.length == 0 || ( _results.length == 1 && _results[0].length == 0 ) ) { document.getElementById('orderwindow').style.zIndex = 100; _finish(); return; }
	_stilltoorder = _results[0].length;
	_count = new Array();
	for ( var i=0; i<_results.length; i++) { 
		_trash = function(i) {
			result = _results[i];
			//the idea is to order most frequently occuring screenings in the results at first
			result.forEach(function(id){
				if ( _count[id] ) { _count[id]++; } else { _count[id] = 1; }
			});
		}(i);
	};
	_maxid = -1; _maxcount = 0;
	for ( var i=0; i<_count.length; i++) { 
		el = _count[i];
		if ( el != undefined && el > _maxcount ) { _maxcount = el; _maxid = i; };
	};
 	movie = _movies.filter(movie=>(movie.id == _maxid))[0];
	_askForMovie(movie,_stilltoorder);
}

function _askForMovie(movie,stilltoorder) {
	_height = Math.min(10*stilltoorder,100) + 'vh';
	el = document.getElementById('orderwindow');
	el.classList.remove('finish');
	el.innerHTML = '\
		<div id="stobackground"><div id="stilltoorder" style="height: '+_height+'">'+stilltoorder+'</div></div>\
		<div id="yes" class="button yes" onclick="_yes('+movie.id+')">ja</div>\
		<div class="screening title">'+movie.title+'</div>\
		<div id="ticketback" onclick="_restore(startOrder)"></div>\
		<div class="screening identifier">'+movie.identifier+'</div>\
		<div class="screening extras">'+movie.extras+'</div>\
		<div id="no" class="button no" onclick="_no('+movie.id+')">nein</div>\
	'
	el.style.zIndex = 100;
}

function _finish() {
	el = document.getElementById('orderwindow');
	el.classList.add('finish');
	_unavailable = JSON.parse(document.getElementById('tmp_unavailable').innerHTML);
	_available = JSON.parse(document.getElementById('tmp_available').innerHTML);
	_pay = JSON.parse(document.getElementById('tmp_pay').innerHTML);
	var _movies = JSON.parse(document.getElementById('movieshidden').innerHTML);
	var _bookedmovie_array = new Array();
	el.innerHTML = '\
		<div id="ticketback" onclick="_restore(startOrder)"></div>\
	'
	el.innerHTML += '<form id="formFinished" action="" onsubmit="event.preventDefault(); this.parentElement.style.zIndex = -100; document.getElementById(\'submitOrder\').disabled = false; _reset(); document.getElementById(\'choosemovies\').scrollIntoView(); return false;" /><input form="formFinished" type="submit" id="submitFinished" hidden /><label for="submitFinished" id="labelSubmitFinished"></label></form>';
	if ( _available && _available.length > 0 ) { el.innerHTML += '<h3>Du hast:</h3>'; };
	var _tablerows = '<table>'; //innerHTML must always be valid HTML, i.e tags must be closed immediately or they will be by the browser
	_tablerows += '<colgroup><col class="col_identifier" /><col class="col_title" /></colgroup>';
	for ( var i=0; i<_available.length; i++) { 
		title = _available[i];
		_bookedmovie_array.push(_movies.filter(mov=>(mov.identifier == title[0]))[0]);
		_tablerows += '<tr><td>'+title[0]+'</td><td>'+title[1]+'</td></tr>';
	};
	var _icsstring = _generateICS(_bookedmovie_array);
	if ( _available && _available.length > 0 ) { 
		_tablerows += '</table>';
//this simple download solution does not work often enough
//		el.innerHTML += '<div class="button maybe"><a href="data:text/plain;charset=utf-8,'+encodeURIComponent(_icsstring)+'" download="HOF.ics">Speichern</a></div>';
		el.innerHTML +='<div class="button maybe" onclick="_saveAsICS(\''+encodeURI(_icsstring)+'\')">Speichern</div>'
   		el.innerHTML += '<div><tiny>(um in einen Kalender oder diese Anwendung zu importieren; funktioniert nicht in allen mobilen Browsern)</tiny></div><br />'
	}
	el.innerHTML += _tablerows;
	_lis = '';
	if ( _unavailable && _unavailable.length > 0 ) { _lis += '<h3>Du hast leider <em>nicht</em>:</h3><ul>'; };
	for ( var i=0; i<_unavailable.length; i++) { 
		title = _unavailable[i];
		_lis += '<li>'+title+'</li>';
	};
	if ( _unavailable && _unavailable.length > 0 ) { _lis += '</ul>'; }
	el.innerHTML += _lis;
	if ( _available && _available.length > 0 ) { el.innerHTML += '<h3>Und das kostet: '+_pay+' €</h3>'; };
}

function _saveAsICS(_string) {
	var _blob = new Blob([decodeURI(_string)],{type: "text/plain;charset=utf-8"});
	if ( false ) {
// debug: jelly browser (lineage os) still does not do the download; not at all this time
// seems to have no purpose at all
//	if ( is_touch_device() ) {
		var rq = new XMLHttpRequest();
		var rnd = Math.floor(Math.random()*1000000000);
		rq.onload = function() {
			var el = document.getElementById('orderwindow').querySelector('.button.maybe');
			el.innerHTML = '<form action="../php/saveAs.php" method="post">\
				<input type="text" name="content" hidden value="'+_string+'"/>\
				<label for="downloadSubmit"><div class="button inbutton">Jetzt herunter laden</div></label>\
				<input type="submit" id="downloadSubmit" hidden />'
//			el.innerHTML = '<a href="/tmp/HOF_'+rnd+'.ics" download="HOF.ics">Jetzt herunterladen</a>';
			el.nextSibling.innerHTML = "Aus technischen Gründen muss die Datei vom Server geladen werden; sie wird aber weder gespeichert noch geloggt.";
			el.removeAttribute('onclick');
		};
		rq.open('POST','../php/saveAs.php',true);
		var _file = new FormData();
		_file.append('content',decodeURI(_string));
		_file.append('filename','HOF_'+rnd+'.ics');
		rq.send(_file);
	} else {
// this is our solution now: use FileSaver.js
		saveAs(_blob,'HOF.ics');
	}
}

function _backup() {
	_history = document.getElementById('history');
	categories = _history.querySelectorAll('.hist');
//	for (let cat of categories) {
	for ( var i=0; i<categories.length; i++) { 
		cat = categories[i];
		_backupdiv = cat.querySelector('div').cloneNode(true);
		_backupdiv.removeAttribute('id');
		cat.appendChild(_backupdiv);
	};
}

function _restore(callback) {
	_history = document.getElementById('history');
	categories = _history.querySelectorAll('.hist');
//	for (let cat of categories){
	for ( var i=0; i<categories.length; i++) { 
		cat = categories[i];
		catsdivs = cat.querySelectorAll('div');
		lastcat = catsdivs.length - 1;
		catsdivs[0].innerHTML = catsdivs[lastcat].innerHTML;
		if (lastcat > 0) { catsdivs[lastcat].remove() };
	};
	if (callback) { callback(); }
}

function _reset(callback) {
	_history = document.getElementById('history');
	categories = _history.querySelectorAll('.hist');
//	for (let cat of categories){
	for ( var i=0; i<categories.length; i++) { 
		_trash = function(i){
			cat = categories[i];
			catsdivs = cat.querySelectorAll('div');
			catslength = catsdivs.length;
			for ( j = 1; j < catslength; j++ ){
				catsdivs[j].remove(); 
			};
		}(i);
	};
	//clear bought tickets
	getTitles(document.getElementById('formMovies'));
	document.getElementById('tmp_available').innerHTML = '[]';
	document.getElementById('tmp_removedtitles').innerHTML = '[]';
	document.getElementById('tmp_removedmovies').innerHTML = '[]';
	document.getElementById('tmp_movies').innerHTML = '[]';
	document.getElementById('tmp_unavailable').innerHTML = '[]';
	document.getElementById('tmp_pay').innerHTML = '0';
//	document.getElementById('computation').innerHTML = '';
	document.getElementById('getresult').innerHTML = '';
	if (callback) { callback(); }
}

function _yes(id) {
	//first, backup
	_backup();
	try { var _movies = JSON.parse(document.getElementById('tmp_movies').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_movies').innerText); }
	try { var _titles = JSON.parse(document.getElementById('tmp_titles').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_titles').innerText); }
//	var _movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	thismovie = _movies.filter(mov=>(mov.id == id))[0];
	var thismovie_array = thismovie.title.split(' + ');
	//update results
	_results = JSON.parse(document.getElementById('tmp_results').innerHTML);
	_results = _results.filter(result=>(result.indexOf(id) > -1));
	for ( var i=0; i<_results.length; i++) { 
		result = _results[i];
		result.splice(result.indexOf(id),1);	
	};
	document.getElementById('tmp_results').innerHTML = JSON.stringify(_results);
	//remove title from _movies (for the case where you have to modify your search during order)
	for ( var i=0; i<thismovie_array.length; i++ ) {
		console.log(thismovie_array); console.log(_titles);
		console.log(_titles.indexOf(thismovie_array[i]));
		_titles.splice(_titles.indexOf(thismovie_array[i]),1);
	}
	document.getElementById('tmp_titles').innerHTML = JSON.stringify(_titles);
	getMovies(true);
/*	for ( var i=0; i<_movies.length; i++) { 
		movie = _movies[i];
//		if ( movie.title ==  thismovie.title ) {
//		remove if all movies of movie are contained in thismovie
		var movie_array = movie.title.split(' + ');
		var _contained = true;
		for ( var j=0; j<movie_array.length; j++ ) {
			if ( thismovie_array.indexOf(movie_array[j]) == -1 ) { _contained = false; }
		}
		if ( _contained ) {
			_movies.splice(i,1);
			i--;
		}
	};
	document.getElementById('tmp_movies').innerHTML = JSON.stringify(_movies);
*/
	//add time slot to unaivalability (same reason)
	_times = JSON.parse(document.getElementById('tmp_times').innerHTML);
	interval = [thismovie.unixtimestart,thismovie.unixtimeend];
	_times = removeIntervals(_times,interval);
	document.getElementById('tmp_times').innerHTML = JSON.stringify(_times);
	//add title to available
	_available = JSON.parse(document.getElementById('tmp_available').innerHTML);
	_available.push([thismovie.identifier,thismovie.title]);
	document.getElementById('tmp_available').innerHTML = JSON.stringify(_available);
	//add to checkout sum
	var _price_afternoon = parseFloat(document.getElementById('price_afternoon').innerHTML);
	var _price_evening = parseFloat(document.getElementById('price_evening').innerHTML);
	_pay = parseInt(document.getElementById('tmp_pay').innerHTML);
	_datetime = new Date(thismovie.unixtimestart*1000);
	_hour = _datetime.getHours();
	if ( _hour < 18 ) { _pay += _price_afternoon; } else { _pay += _price_evening; } //is really meant: and hour>7 or so?
	document.getElementById('tmp_pay').innerHTML = _pay;
	//next order
	startOrder();
	return false;
}

function _no(id) {
	//first, backup
	_backup();
	try { var _removedtitles = JSON.parse(document.getElementById('tmp_removedtitles').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_removedtitles').innerText); }
	try { var _titles = JSON.parse(document.getElementById('tmp_titles').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_titles').innerText); }
	try { var _movies = JSON.parse(document.getElementById('tmp_movies').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_movies').innerText); }
	try { var _removedmovies = JSON.parse(document.getElementById('tmp_removedmovies').innerHTML); } catch(error) { var _movies = JSON.parse(document.getElementById('tmp_removedmovies').innerText); }
//	var _movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	var thismovie = _movies.filter(mov=>(mov.id == id))[0];
	var thismovie_array = thismovie.title.split(' + ');
	_results = JSON.parse(document.getElementById('tmp_results').innerHTML);
	_stilltoorder = _results[0].length;
	_results = _results.filter(result=>(result.indexOf(id) == -1));
	_removedmovies.push(thismovie.identifier);
	document.getElementById('tmp_removedmovies').innerHTML = JSON.stringify(_removedmovies);
	if ( _stilltoorder > 0 && ( _results.length == 0 || ( _results.length == 1 && _results[0].length == 0 ) ) ) {
		//remove title from _movies (for the case where you have to modify your search during order)
		//still wrong: same screenings get re-presented with fewer combinations; have to remove the screenings as well!
		if ( thismovie_array.length > 1 ) {
			_removedtitles.push(thismovie.title);
			document.getElementById('tmp_removedtitles').innerHTML = JSON.stringify(_removedtitles);
		} else {
			_titles.splice(_titles.indexOf(thismovie.title),1);
			document.getElementById('tmp_titles').innerHTML = JSON.stringify(_titles);
		}
		getMovies(true);
		//add title to unavailablehidden
		_unavailable = JSON.parse(document.getElementById('tmp_unavailable').innerHTML);
		_unavailable.push(thismovie.title);
		document.getElementById('tmp_unavailable').innerHTML = JSON.stringify(_unavailable);	
		//start over
		getResults(startOrder,'tmp');
		return false;
	}
	//this is only reached, when results are left
	document.getElementById('tmp_results').innerHTML = JSON.stringify(_results);
	startOrder();
	return false;
}

function unix2icsTime(_unixtime) {
	var _ut = new Date(_unixtime*1000); //need milliseconds instead of seconds
	_ics = new Object();
	_ics.year = _ut.getFullYear();
	_ics.month = (_ut.getMonth()<9?'0':'')+(_ut.getMonth()+1);
	_ics.day = (_ut.getDate()<10?'0':'')+(_ut.getDate());
	_ics.hours = (_ut.getHours()<10?'0':'')+(_ut.getHours());
	_ics.minutes = (_ut.getMinutes()<10?'0':'')+(_ut.getMinutes());
	_ics.seconds = (_ut.getSeconds()<10?'0':'')+(_ut.getSeconds());
	var _icsTime = _ics.year.toString() + _ics.month + _ics.day + 'T' + _ics.hours + _ics.minutes + _ics.seconds;
	return _icsTime;
}

function _generateICS(_bookedmovie_array) {
	var _body = "BEGIN:VCALENDAR\n\
VERSION:2.0\n\
CALSCALE:GREGORIAN\n\
PRODID:-//hofplaner//hofplaner 19-1.0//DE\n\
X-WR-CALNAME:\n\
X-APPLE-CALENDAR-COLOR:\n\
BEGIN:VTIMEZONE\n\
TZID:Europe/Berlin\n\
BEGIN:DAYLIGHT\n\
TZOFFSETFROM:+0100\n\
TZOFFSETTO:+0200\n\
TZNAME:CEST\n\
DTSTART:19700329T020000\n\
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3\n\
END:DAYLIGHT\n\
BEGIN:STANDARD\n\
TZOFFSETFROM:+0200\n\
TZOFFSETTO:+0100\n\
TZNAME:CET\n\
DTSTART:19701025T030000\n\
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10\n\
END:STANDARD\n\
END:VTIMEZONE\n\
";
	for ( var i=0; i < _bookedmovie_array.length; i++ ) {
		var _bookedmovie = _bookedmovie_array[i];
		var _created = unix2icsTime(Math.floor(new Date()/1000));
		var _lastmodified = _created;
		var _uid = "hp53"+(Math.floor(new Date()/1))+Math.floor(Math.random()*100000);
		var _summary = "HOF: "+_bookedmovie.identifier+" / "+_bookedmovie.title;
		var _dtstart = unix2icsTime(_bookedmovie.unixtimestart);
		var _dtend = unix2icsTime(_bookedmovie.unixtimeend-_hof_walktime);
		_body += "\
BEGIN:VEVENT\n\
CREATED:"+_created+"\n\
LAST-MODIFIED:"+_lastmodified+"\n\
UID:"+_uid+"\n\
DTSTAMP:"+_created+"\n\
SUMMARY:"+_summary+"\n\
DTSTART;TZID=Europe/Berlin:"+_dtstart+"\n\
DTEND;TZID=Europe/Berlin:"+_dtend+"\n\
TRANSP:OPAQUE\n\
END:VEVENT\n\
";
	}
	_body += "END:VCALENDAR";
	return _body;
}

function _importFiles(_input) {
	var _files = _input.files;
	for ( var i=0; i< _files.length; i++ ) {
		var _import = function(i) { 
			_file = _files[i];
			//validate file type
//			if ( _file.type.indexOf('text/') == -1 ) { return; } // not reliable
			//read file and process
			_filereader = new FileReader();
			_filereader.onload = function() {
				var _ics = _filereader.result.split('\n'); //separate lines in array
				var _event = false;	
				var _interval = new Array();
				for ( var j=0; j < _ics.length; j++ ) {
					if ( _ics[j].indexOf('BEGIN:VEVENT') != -1 ) { _event = true; }
					if ( _ics[j].indexOf('END:VEVENT') != -1 ) { _event = false; }
					if ( _event && _ics[j].indexOf('DTSTART') != -1 ) {
						var _raw = _ics[j].substr(_ics[j].indexOf(':')+1);
						var _date = new Object();
						_date.year = parseInt(_raw.substr(0,4));
						_date.month = parseInt(_raw.substr(4,2))-1;
						_date.day = parseInt(_raw.substr(6,2));
						_date.hours = parseInt(_raw.substr(9,2));
						_date.minutes = parseInt(_raw.substr(11,2));
						_date.hours = parseInt(_raw.substr(9,2));						
//						var _datestring = _raw.substr(0,4)+"-"+_raw.substr(4,2)+'-'+_raw.substr(6,2)+'T'+_raw.substr(9,2)+':'+_raw.substr(11,2)+':'+_raw.substr(13,2);
						_interval[0] = Math.floor(new Date(_date.year,_date.month,_date.day,_date.hours,_date.minutes)/1000);
					}
					if ( _event && _ics[j].indexOf('DTEND') != -1 ) {
						var _raw = _ics[j].substr(_ics[j].indexOf(':')+1);
						var _date = new Object();
						_date.year = parseInt(_raw.substr(0,4));
						_date.month = parseInt(_raw.substr(4,2))-1;
						_date.day = parseInt(_raw.substr(6,2));
						_date.hours = parseInt(_raw.substr(9,2));
						_date.minutes = parseInt(_raw.substr(11,2));
						_date.hours = parseInt(_raw.substr(9,2));						
//						var _datestring = _raw.substr(0,4)+"-"+_raw.substr(4,2)+'-'+_raw.substr(6,2)+'T'+_raw.substr(9,2)+':'+_raw.substr(11,2)+':'+_raw.substr(13,2);
						_interval[1] = Math.floor(new Date(_date.year,_date.month,_date.day,_date.hours,_date.minutes)/1000);
						_uncheck(_interval);
						_interval = new Array();
					}
				}
			}
			_filereader.readAsText(_file);
		}(i);
	}
	_input.value = '';
}

function _uncheck(_interval) {
	_slots = document.getElementById('timestable').querySelectorAll('[type="checkbox"]');
	for ( var i=0; i < _slots.length; i++ ) {
		var _slotinterval = JSON.parse(_slots[i].value);
		//uncheck if intervals intersect
		if ( (_slotinterval[1] - _interval[0]) > 0  && ( _interval[1] - _slotinterval[0]) > 0 ) {
			console.log(_slotinterval);
			_slots[i].checked = false;
		}
	}
}
