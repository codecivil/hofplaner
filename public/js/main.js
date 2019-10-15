//all forEach occurences replaced by for (count index) loop
//all innerText replaced by innerHTML
//all .append by .appendChild
//for compatibility to older browsers
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
		for ( i = 0; i<_onclicks.length; i++) {
			clickable = _onclicks[i];
			_onclick[i] = clickable.onclick;
			clickable.addEventListener('touchstart', _onclick[i], false);
			clickable.setAttribute('onclick',"return false");			
		}
		_onsubmits = document.querySelectorAll('input[type="submit"]');
		_onsubmit = new Array();
		for ( i = 0; i<_onsubmits.length; i++ ) {
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
	for (i=0; i<elements.length; i++) { 
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

function getMovies(form) {
	_titleinputs = form.querySelectorAll('input:checked');
	_titles = new Array();
	for (i = 0; i<_titleinputs.length; i++) { _titles.push(_titleinputs[i].value); };
	_allMovies = JSON.parse(document.getElementById('database').innerHTML);
	_movies = _allMovies.filter(function(movie){ return ( _titles.indexOf(movie.title) != -1 ); });		
	document.getElementById('movieshidden').innerHTML = JSON.stringify(_movies);
/*	phpscript = "/functions/getMovies.php";
	var _request = new XMLHttpRequest();
	var el = document.getElementById('movieshidden');
	_request.onload = function() { el.innerHTML = _request.responseText; }
	_request.open(form.method,phpscript,true);
	_request.send(new FormData (form));
*/
	unhide('marksoldout');	
	return false;
}

function generateFormSoldOut() {
	el = document.getElementById('formSoldOut');
	_movies = JSON.parse(document.getElementById('movieshidden').innerHTML);
	for (index=0; index<_movies.length; index++) { 
		movie = _movies[index];
		movie.begin = new Date(movie.unixtimestart*1000);
		movie.end = new Date(movie.unixtimeend*1000);
		movie.time = movie.begin.getDate()+'.'+(movie.begin.getMonth()+1)+'., '+movie.begin.getHours()+':'+movie.begin.getMinutes()+' - '+movie.end.getHours()+':'+movie.end.getMinutes();
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
	for (i=0; i<_soldout.length; i++) { 
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
	for (i=0; i<_available.length; i++) { 
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
	for (i=0; i<_available.length; i++) { 
		interval = _available[i];
		_return.push(JSON.parse(interval.value));
	};
	var el = document.getElementById('timeshidden');
	el.innerHTML = JSON.stringify(addIntervals(_return));
}

function addIntervals(intervalsarray) {
	intervalsarray = intervalsarray.sort((a,b)=>a[0]-b[0]); // sort ascending by interval begin
	for ( i=0; i<intervalsarray.length; i++ ) {
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
	for ( i=0; i<minuend.length; i++ ) {
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
	for (i=0; i<intervalsarray.length; i++) { 
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
	document.getElementById('submitOrder').disabled = true;
	_movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	_times = JSON.parse(document.getElementById('tmp_times').innerHTML);
	_titles_before = _movies.filter((el,i,a)=>( ! a[i+1] || el.title != a[i+1].title)); //get the unique titles (from the sorted array!)
	_soldout = JSON.parse(document.getElementById('tmp_soldout').innerHTML);
	//remove soldout movies
	if ( _soldout && _soldout.length > 0) {
		_movies = _movies.filter(movie=>(_soldout.indexOf(movie.id.toString()) == -1));
	}
	// remove movies that do not fit into the user's timetable
	for (index=0; index<_movies.length; index++) { 
		movie = _movies[index];
		var interval = [movie.unixtimestart,movie.unixtimeend];
		if ( ! fitsInto(_times,interval) ) { _movies.splice(index,1); }
	};
	// get titles (maybe some were removed)
	_titles = _movies.filter((el,i,a)=>( ! a[i+1] || el.title != a[i+1].title)); //get the unique titles (from the sorted array!)
	_impossible = _titles_before.filter(title=>( _titles.indexOf(title) == -1 ));
	// prepare iteration
	_movieswithtitle = new Array();
	_prod = [1]; //combinations as multibased number representations
	_factor = new Array();
	for (i=0; i<_titles.length; i++) { 
		title = _titles[i];
		_movieswithtitle.push(_movies.filter(el=>(el.title == title.title)));
		_prod.push(_movieswithtitle[_movieswithtitle.length-1].length*_prod[_prod.length-1]);
		_factor.push(_movieswithtitle[_movieswithtitle.length-1].length);
	};
	// now check all possibilities
	_results = new Array();
	document.getElementById('getresult').innerHTML = "Mögliche Filmpläne werden berechnet...";
	for ( i = 0; i<_prod[_prod.length-1]; i++ ) {
		_status = function(i) {
			_results[i] = new Array();
			var freetimes = _times;
			for ( j = 0; j<_titles.length; j++ ) {
				var index = Math.floor(i/_prod[j+1]) % _factor[j];
				var movie = _movieswithtitle[j][index];
				var interval = [movie.unixtimestart,movie.unixtimeend];
				if ( ! fitsInto(freetimes,interval) ) {
					_results.splice(i,1);
					break; 
				} else {
					console.log(i); console.log(_results[i]);
					_results[i].push(movie.id);
					freetimes = removeIntervals(freetimes,interval);	
				}				
			}
		}(i);
	}
	_results = _results.filter(function(result){ return result != undefined }); //reindex the array, so that length is applicable
	switch( _results.length) {
		case 0:
			document.getElementById('getresult').innerHTML = "<strong>Leider ist Ihre Auswahl so nicht möglich.</strong> Bitte reduzieren Sie die Anzahl der gewählten Filme oder erweitern Sie ihre vefügbaren Zeiten.";
			break;
		case 1:
			document.getElementById('getresult').innerHTML = "<strong>Sie haben Glück!</strong> Es gibt genau einen möglichen Filmplan.";
			document.getElementById('submitOrder').disabled = false;
			break;
		default:
			document.getElementById('getresult').innerHTML = "<strong>"+_results.length + "</strong> Möglichkeiten wurden gefunden.";
			document.getElementById('submitOrder').disabled = false;
	}
	if ( _impossible.length > 0 ) {
		document.getElementById('getresult').innerHTML += '<p>Folgende Filme laufen aber nie, wann Sie Zeit haben:</p><ul>';
		for (i=0; i<_impossible.length; i++) { 
			title = _impossible[i];
			document.getElementById('getresult').innerHTML += '<li>'+title.title+'</li>';
		}; 
		document.getElementById('getresult').innerHTML += '</ul>';
	}	
	document.getElementById('tmp_results').innerHTML = JSON.stringify(_results);
	if ( ! tmp ) { document.getElementById('resultshidden').innerHTML = JSON.stringify(_results); };
	unhide('getresult_wrapper');
	if (callback) { callback(); };
}

function startOrder() {
	_movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	_results = JSON.parse(document.getElementById('tmp_results').innerHTML);
	if ( _results.length == 0 || ( _results.length == 1 && _results[0].length == 0 ) ) { document.getElementById('orderwindow').style.zIndex = 100; _finish(); return; }
	_stilltoorder = _results[0].length;
	_count = new Array();
	for (i=0; i<_results.length; i++) { 
		_trash = function(i) {
			result = _results[i];
			//the idea is to order most frequently occuring screenings in the results at first
			result.forEach(function(id){
				if ( _count[id] ) { _count[id]++; } else { _count[id] = 1; }
			});
		}(i);
	};
	_maxid = -1; _maxcount = 0;
	for (i=0; i<_count.length; i++) { 
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
	el.innerHTML = '\
		<div id="ticketback" onclick="_restore(startOrder)"></div>\
	'
	el.innerHTML += '<form id="formFinished" action="" onsubmit="this.parentElement.style.zIndex = -100; document.getElementById(\'submitOrder\').disabled = false; _reset(); document.getElementById(\'choosemovies\').scrollIntoView(); return false;" /><input form="formFinished" type="submit" id="submitFinished" hidden /><label for="submitFinished" id="labelSubmitFinished"></label>';
	if ( _available && _available.length > 0 ) { el.innerHTML += '<h3>Sie haben:</h3><ul>'; };
	for (i=0; i<_available.length; i++) { 
		title = _available[i];
		el.innerHTML += '<li>'+title+'</li>';
	};
	if ( _available && _available.length > 0 ) { el.innerHTML += '</ul>'; }
	if ( _unavailable && _unavailable.length > 0 ) { el.innerHTML += '<h3>Sie haben leider <em>nicht</em>:</h3><ul>'; };
	for (i=0; i<_unavailable.length; i++) { 
		title = _unavailable[i];
		el.innerHTML += '<li>'+title+'</li>';
	};
	if ( _unavailable && _unavailable.length > 0 ) { el.innerHTML += '</ul>'; }
	if ( _available && _available.length > 0 ) { el.innerHTML += '<h3>Und das kostet: '+_pay+'€</h3>'; };
}

function _backup() {
	_history = document.getElementById('history');
	categories = _history.querySelectorAll('.hist');
//	for (let cat of categories) {
	for (i=0; i<categories.length; i++) { 
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
	for (i=0; i<categories.length; i++) { 
		cat = categories[i];
		catsdivs = cat.querySelectorAll('div');
		lastcat = catsdivs.length - 1;
		catsdivs[0].innerHTML = catsdivs[lastcat].innerHTML;
		if (lastcat > 0) { catsdivs[lastcat].remove() };
	};
	if (callback) { callback(); }
	//clear bought tickets
	document.getElementById('tmp_available').innerHTML = '[]';
}

function _reset(callback) {
	_history = document.getElementById('history');
	categories = _history.querySelectorAll('.hist');
//	for (let cat of categories){
	for (i=0; i<categories.length; i++) { 
		_trash = function(i){
			cat = categories[i];
			catsdivs = cat.querySelectorAll('div');
			catslength = catsdivs.length;
			for ( j = 1; j < catslength; j++ ){
				catsdivs[j].remove(); 
			};
		}(i);
	};
	if (callback) { callback(); }
}

function _yes(id) {
	//first, backup
	_backup();
	thismovie = _movies.filter(mov=>(mov.id == id))[0];
	//update results
	_results = JSON.parse(document.getElementById('tmp_results').innerHTML);
	_results = _results.filter(result=>(result.indexOf(id) > -1));
	for (i=0; i<_results.length; i++) { 
		result = _results[i];
		result.splice(result.indexOf(id),1);	
	};
	document.getElementById('tmp_results').innerHTML = JSON.stringify(_results);
	//remove title from _movies (for the case where you have to modify your search during order)
	_movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
	for (i=0; i<_movies.length; i++) { 
		movie = _movies[i];
		if ( movie.title ==  thismovie.title ) {
			_movies.splice(i,1);
		}
	};
	document.getElementById('tmp_movies').innerHTML = JSON.stringify(_movies);
	//add time slot to unaivalability (same reason)
	_times = JSON.parse(document.getElementById('tmp_times').innerHTML);
	interval = [thismovie.unixtimestart,thismovie.unixtimeend];
	_times = removeIntervals(_times,interval);
	document.getElementById('tmp_times').innerHTML = JSON.stringify(_times);
	//add title to available
	_available = JSON.parse(document.getElementById('tmp_available').innerHTML);
	_available.push(thismovie.title);
	document.getElementById('tmp_available').innerHTML = JSON.stringify(_available);
	//add to checkout sum
	_pay = parseInt(document.getElementById('tmp_pay').innerHTML);
	_datetime = new Date(thismovie.unixtimestart*1000);
	_hour = _datetime.getHours();
	if ( _hour < 18 ) { _pay += 7; } else { _pay += 8; } //is really meant: and hour>7 or so?
	document.getElementById('tmp_pay').innerHTML = _pay;
	//next order
	startOrder();
	return false;
}

function _no(id) {
	//first, backup
	_backup();
	thismovie = _movies.filter(mov=>(mov.id == id))[0];
	_results = JSON.parse(document.getElementById('tmp_results').innerHTML);
	_stilltoorder = _results[0].length;
	_results = _results.filter(result=>(result.indexOf(id) == -1));
	if ( _stilltoorder > 0 && ( _results.length == 0 || ( _results.length == 1 && _results[0].length == 0 ) ) ) {
		//remove title from _movies (for the case where you have to modify your search during order)
		_movies = JSON.parse(document.getElementById('tmp_movies').innerHTML);
		for (i=0; i<_movies.length; i++) { 
			movie = _movies[i];
			if ( movie.title ==  thismovie.title ) {
				_movies.splice(i,1);
			}
		};
		document.getElementById('tmp_movies').innerHTML = JSON.stringify(_movies);
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
