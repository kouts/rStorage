/*
* jQuery rStorage Plugin
*
* localStorage and sessionStorage helper utility for jQuery
* If you have idea about improving this plugin please let me know
*
* Copyright (c) 2014-2016 rrd@1108.cc
*
* Licensed under the MIT license:
* http://opensource.org/licenses/MIT
*
* Project home:
* https://github.com/rrd108/rStorage
*
* Version: 1.2.0
*
*/
JSON.unflatten = function(data) {
    'use strict';
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var result = {}, cur, prop, idx, last, temp;
    for(var p in data) {
        cur = result, prop = '', last = 0;
        do {
            idx = p.indexOf('.', last);
            temp = p.substring(last, idx !== -1 ? idx : undefined);
            cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
            prop = temp;
            last = idx + 1;
        } while(idx >= 0);
        cur[prop] = data[p];
    }
    return result[''];
};
JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for(var i=0, l=cur.length; i<l; i++)
                recurse(cur[i], prop ? prop+'.'+i : ''+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+'.'+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, '');
    return result;
};

(function($){
	function RStorage(target){
		return {
			get : function(key){
				//returns part of the object identified by key
                // (myNamespace.firstLevel.secondLevel)
                // or return null if the key does not exists
				//TODO use only local not native
				key = key.split('.');
                //get the first part like nsp from nsp.firstLevel.secondLevel
				var namespace = key.shift();
				try{
					if (key.length) {
                        //still there are dots in the key, walk into deepest
						var json = JSON.parse(target.getItem(namespace));
						for(var i = 0; i < key.length ; i++){
							json = json[key[i]];
						}
						return json;
					}
					else{
						return JSON.parse(target.getItem(namespace));
					}
				} catch(e){
					return JSON.parse(target.getItem(namespace));
				}
			},

			_reset : function(key, json){
                var namespace;
                if (key.search(/\./) == -1) {
                    namespace = key;
				}
				else{
					//the key does contain dots example: textNamespace.nincs.obj
                    var keys = key.split('.');
                    namespace = keys.shift();
                    key = key.replace(namespace + '.', '');
                    var originalJson = JSON.flatten(JSON.parse(target.getItem(namespace)));
                    var updatedJson = originalJson;
                    $.each(originalJson, function (index){
                        if (index == key) {
                            updatedJson[key] = json;
                        }
                    });
                    json = JSON.unflatten(updatedJson);
                    target.setItem(namespace, json);
				}
                //objects can be stored only after stringify
                target.setItem(namespace, JSON.stringify(json));
                return json;
			},

			remove : function(key){
				//removes part of the object identified by key (myNamespace.firstLevel.secondLevel)
				key = key.split('.');
				var namespace = key.shift();
				if (key.length) {		//3: canto2, stories, second
					var json = JSON.parse(target.getItem(namespace));
					var part = json[key[0]];
                    // TODO rewiev this and use flatten
					//remove json.canto2.title or json['canto2']['title']
					for(var i = 1; i < (key.length -1) ; i++){	//we stop before the last, as that is we want to delete
						part = part[key[i]]
					}
					if (key[i]) {
						delete part[key[i]];
					}
					else{		//if there was only one dot we should directly remove from json
						delete json[key[0]];
					}
					this._reset(namespace, json);
				}
				else{
					target.removeItem(namespace);
				}
				return this.get(namespace);
			},

			set : function(key, json){
				// set part of the object identified by key
                // (myNamespace.firstLevel.secondLevel)
                // overwrites if it is already there, otherwise extends it
                if (typeof(json) == 'object') {
                    var originalJson = this.get(key);
                    json = jQuery.extend(originalJson, json);
                }
				return this._reset(key, json);
			},
		}
	}

	var rSessStorage = new RStorage(sessionStorage);
	$.sessionStorage = function(namespace, path){
		if (typeof(path) === 'undefined') {
			return rSessStorage.get(namespace);
		}
		else{
			return rSessStorage.set(namespace, path);
		}
	};
	$.sessionStorage.remove = function(namespace){
		return rSessStorage.remove(namespace);
	};

	var rLocStorage = new RStorage(localStorage);
	$.localStorage = function(namespace, path){
        if (typeof(path) === 'undefined') {
			return rLocStorage.get(namespace);
		}
		else{
			return rLocStorage.set(namespace, path);
		}
	};
	$.localStorage.remove = function(namespace){
		return rLocStorage.remove(namespace);
	};

}(jQuery));