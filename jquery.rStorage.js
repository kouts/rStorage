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
* Version: 1.3.1
*
*/
JSON.unflatten = function(data) {
    'use strict';
    if (Object(data) !== data || Array.isArray(data) || Object.getOwnPropertyNames(data).length === 0)
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

(function($) {
	function RStorage(target) {
        return {
            _getNamespace : function (path) {
                if (path.search(/\./) == -1) {
                    return path;
                }
                return path.substr(0, path.indexOf('.'));
            },

            _getKey : function (path) {
                if (path.search(/\./) == -1) {
                    return null;
                }
                return path.substr(path.indexOf('.') + 1);
            },

            get : function (path) {
				//returns part of the object identified by path
                // (myNamespace.firstLevel.secondLevel)
                // or return null if the path does not exists
                var namespace = this._getNamespace(path);
                //get the first part like nsp from nsp.firstLevel.secondLevel
                path = this._getKey(path);
                if (!path) {
                    return JSON.parse(target.getItem(namespace));
                } else {
                    var json = target.getItem(namespace);
                    if (json) {
                        json = JSON.flatten(JSON.parse(json));
                        if (json[path] === undefined) {
                            /*
                            we did not find the value identified by path
                            but it can be a found in upper in path
                            so path is something like level2.level3
                             */
                            var j = {}, k;
                            $.each(json, function (key, value) {
                                //if key is level1.level2.level3 and path is as above
                                if (key.indexOf('.') != -1 && key.search(path) != -1) {
                                    //chop off path from key to get the new key for unflatten
                                    k = key.replace(path + '.', '');
                                    j[k] = value;
                                    return false;   //exit from each
                                }
                            });
                            json = k ? j : null;
                        } else {
                            json = json[path];
                        }
                        return JSON.unflatten(json);
                    } else {
                        return null;
                    }
                }
			},

			_save : function (path, json) {
                var namespace = this._getNamespace(path);
                path = this._getKey(path);
                var originalJson = target.getItem(namespace);
                if (originalJson) {
                    originalJson = JSON.flatten(JSON.parse(originalJson));
                    var updatedJson = originalJson;
                    var keyUpdated = false;
                    $.each(originalJson, function (index) {
                        if (index == path) {
                            updatedJson[path] = json;
                            keyUpdated = true;
                        }
                    });
                    if (!keyUpdated) {
                        //this is a new path, lets insert it
                        if (path) {
                            updatedJson[path] = json;
                        } else {
                            updatedJson = json;
                        }
                    }
                    json = JSON.unflatten(updatedJson);
                } else if (path) {
                    var j = {};
                    j[path] = json;
                    json = j;
                }
                //objects can be stored only after stringify
                target.setItem(namespace, JSON.stringify(json));
                return json;
			},

			remove : function (path) {
				//removes part of the object identified by path (myNamespace.firstLevel.secondLevel)
				var namespace = this._getNamespace(path);
                path = this._getKey(path);
				if (path) {
					var json = target.getItem(namespace);
                    if (json) {
                        json = JSON.flatten(JSON.parse(json));
                        if (json[path]) {
                            delete json[path];
                        } else {
                            //it can be there at first level of path (even multiple times)
                            var j = json;
                            $.each(j, function (key) {
                                if (key.search(path) != -1) {
                                    delete json[key];
                                }
                            });
                        }
                        json = JSON.unflatten(json);
                    }
					this._save(namespace, json);
				}
				else{
					target.removeItem(namespace);
				}
				return this.get(namespace);
			},

			set : function (path, json) {
				// set part of the object identified by path
                // (myNamespace.firstLevel.secondLevel)
                // overwrites if it is already there, otherwise extends it
                if (typeof(json) == 'object') {
                    var originalJson = this.get(path);
                    json = jQuery.extend(originalJson, json);
                }
				return this._save(path, json);
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