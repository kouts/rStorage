var sample = {
		widget: {
			debug: "on",
			window: {
				title: "The Title of The Widget",
				name: "widget_window",
				width: 500,
				height: 500
			},
			image: {
				src: "../images/goura.png",
				name: "Goura",
				hOffset: 250,
				vOffset: 250,
				alignment: "center"
			},
			text: {
				data: "Click Here",
				size: 36,
				style: "bold",
				name: "text1"
			}
		}
	};

test('$.sessionStorage Test', function(){
	deepEqual($.sessionStorage('thisShouldBeNull'),
				 null,
				 'getter: non existent key returned null');
	
	deepEqual($.sessionStorage('testNamespace', {van : true}),
				 {van : true},
				 'setter: returned the correct object');
	
	deepEqual($.sessionStorage('testNamespace', {nincs: 5}),
				 {van : true, nincs : 5},
				 'setter: added new property and returned the new full object');
	
	deepEqual($.sessionStorage('testNamespace', {van : false, nincs: 5}),
				 {van : false, nincs : 5},
				 'setter: overwrote a property and returned the new full object when given unchanged property');
	
	deepEqual($.sessionStorage('testNamespace', {van : 13}),
				 {van : 13, nincs : 5},
				 'setter: overwrote a property and returned the new full object when given only what changed');

	deepEqual($.sessionStorage.remove('testNamespace.nincs'),
				 {van : 13},
				 'remove: removed a sub-object and return the new object');


	deepEqual($.sessionStorage('testNamespace'),
				 {van : 13},
				 'getter: gave the updated object after deleting one property');

	deepEqual($.sessionStorage.remove('testNamespace'),
				 null,
				 'remove: returned null after deleting the whole object');
	
	deepEqual($.sessionStorage('testNamespace', {a: 125}),
				 {a: 125},		//TODO this should not be a object, just simply true
				 'setter: returned the correct object');

	$.sessionStorage('sample', sample);
	
	deepEqual($.sessionStorage('sample.widget.debug'),
				 "on",
				 'getter: returned the proper sub-sub-object when called by dot notation');
	
	$.sessionStorage.remove('sample.widget.window');
	$.sessionStorage.remove('sample.widget.image');
	deepEqual($.sessionStorage.remove('sample.widget.text'),
				 {widget : {debug : 'on'}},
				 'remove: removed a sub-object and return the new object');    
});

test('$.localStorage Test', function(){
	deepEqual($.localStorage('testNamespace'),
				 null,
				 'getter: returned null, as this namespace does not exists in $.localStorage, only in $.sessionStorage');
	
	deepEqual($.localStorage('testNamespace', {object: {level1 : {level2 : {level3 : 'level3'}}}}),
				 {object: {level1 : {level2 : {level3 : 'level3'}}}},
				 'setter: returned the new multi-level object');
	
	deepEqual($.localStorage('testNamespace.object'),
				 {level1 : {level2 : {level3 : 'level3'}}},
				 'getter: returned the proper sub-object when called by dot notation');
	
	deepEqual($.localStorage('testNamespace.object.level1.level2'),
				 {level3 : 'level3'},
				 'getter: returned the proper sub-sub-object when called by dot notation');
	
	deepEqual($.localStorage.remove('testNamespace'),
				 null,
				 'remove: removed the object and returned null');
	
	deepEqual($.localStorage('testNamespace'),
				 null,
				 'setter: returned null after the previous test deleted our object');
});

localStorage.clear();
sessionStorage.clear();