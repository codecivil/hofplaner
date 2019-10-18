// now check all possibilities
onmessage = function (e) {
	console.log(e.data);
	var _times = e.data._times;
	var _titles = e.data._titles;
	var _movieswithtitle = e.data._movieswithtitle;
	var _prod = e.data._prod;
	var _factor = e.data._factor;
	var _results = new Array();
	var _freetimes = new Array();
	var _msg = new Object();
	var _oldpercent = 0;
	for ( var i = 0; i < _prod[_prod.length-1]; i++ ) {
		var _percent = Math.floor(100*i/_prod[_prod.length-1]+0.5);
		if ( _percent > _oldpercent ) { 
			_msg.msgtype = 'progress';
			_msg.msg = _percent;
			postMessage(_msg);
			_oldpercent = _percent;
		}
		//at i=1 the _freetimes[1] array is reduced to the first interval of _freetimes[0]; why? removeIntervals does not work, perhaps?
		var _status = function (i) {
			_results[i] = new Array();
			//_freetimes[i] = _times.slice(); //clones an array
			_freetimes[i] = JSON.parse(JSON.stringify(_times)); //clone the easy way...
			for ( j = 0; j<_titles.length; j++ ) {
				var _stat2 = function (i,j) {
					var index = Math.floor(i/_prod[j]) % _factor[j];
					var movie = _movieswithtitle[j][index];
					var interval = [movie.unixtimestart,movie.unixtimeend];
					if ( ! fitsInto(_freetimes[i],interval) ) {
						return false; 
					} else {
						_results[i].push(movie.id);
						_freetimes[i] = removeIntervals(_freetimes[i],interval);
						return true;	
					}
				}(i,j);				
				if ( ! _stat2 ) { _results.splice(i,1); break; }
			}
		}(i);
	}
	_results = _results.filter(function(result){ return result != undefined }); //reindex the array, so that length is applicable
	_msg.msgtype = 'result';
	_msg.msg = _results;
	postMessage(_msg);
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

