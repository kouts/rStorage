/*
* jQuery rStorage Plugin
*
* localStorage and sessionStorage helper utility for jQuery
* If you have idea about improving this plugin please let me know
*
* Copyright (c) 2014 rrd
*
* Licensed under the MIT license:
* http://opensource.org/licenses/MIT
*
* Project home:
* https://github.com/rrd108/rStorage
*
* Version: 1.0
*
*/
(function($){

	function RStorage(target){
		return {
			get : function(key){
				//returns part of the object identified by key (myNamespace.firstLevel.secondLevel) or return null if the key does not exists
				//TODO use only local not native
				key = key.split('.');
				var namespace = key.shift();	//get the first part like nsp from myNamespace.firstLevel.secondLevel				
				try{
					if (key.length) {		//still there are .-s in the key, walk into deeper
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
					return target.getItem(namespace);
				}
			},

			_reset : function(key, json){
				if (key.search(/\./) == -1) {
					target.setItem(key, JSON.stringify(json));
					return json;
				}
				else{
					//the key is in dot notation form, reject it
					throw new Error(key + ' is an invalid key');
				}
			},

			remove : function(key){
				//removes part of the object identified by key (myNamespace.firstLevel.secondLevel)
				key = key.split('.');
				var namespace = key.shift();
				if (key.length) {		//3: canto2, stories, second
					var json = JSON.parse(target.getItem(namespace));
					var part = json[key[0]];
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
				//set part of the object identified by key (myNamespace.firstLevel.secondLevel) overwrites if it is already there, otherwise extends
				//TODO save to native and local also
				var originalJson = this.get(key);
				json = jQuery.extend(originalJson, json);
				return this._reset(key, json);
			}
		}
	}

	var rSessStorage = new RStorage(sessionStorage);
	$.sessionStorage = function(namespace, path){
		if (!path) {
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
		if (!path) {
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