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

QUnit.test('$.sessionStorage Test', function(assert){
	assert.deepEqual($.sessionStorage('thisShouldBeNull'),
				 null,
				 'getter: non existent key returned null');
	
	assert.deepEqual($.sessionStorage('testNamespace', {van : true}),
				 {van : true},
				 'setter: returned the correct object');
	
	assert.deepEqual($.sessionStorage('testNamespace', {nincs: 5}),
				 {van : true, nincs : 5},
				 'setter: added new property and returned the new full object');
	
	assert.deepEqual($.sessionStorage('testNamespace', {van : false, nincs: 5}),
				 {van : false, nincs : 5},
				 'setter: overwrote a property and returned the new full object when given unchanged property');
	
	assert.deepEqual($.sessionStorage('testNamespace', {van : 13}),
				 {van : 13, nincs : 5},
				 'setter: overwrote a property and returned the new full object when given only what changed');

	assert.deepEqual($.sessionStorage.remove('testNamespace.nincs'),
				 {van : 13},
				 'remove: removed a sub-object and return the new object');


	assert.deepEqual($.sessionStorage('testNamespace'),
				 {van : 13},
				 'getter: gave the updated object after deleting one property');

	assert.deepEqual($.sessionStorage.remove('testNamespace'),
				 null,
				 'remove: returned null after deleting the whole object');
	
	assert.deepEqual($.sessionStorage('testNamespace', {a: 125}),
				 {a: 125},		//TODO this should not be a object, just simply true
				 'setter: returned the correct object');

	$.sessionStorage('sample', sample);
	
	assert.deepEqual($.sessionStorage('sample.widget.debug'),
				 "on",
				 'getter: returned the proper sub-sub-object when called by dot notation');
	
	$.sessionStorage.remove('sample.widget.window');
	$.sessionStorage.remove('sample.widget.image');
	assert.deepEqual($.sessionStorage.remove('sample.widget.text'),
				 {widget : {debug : 'on'}},
				 'remove: removed a sub-object and return the new object');    
});

QUnit.test('$.localStorage Test', function(assert){
	assert.deepEqual($.localStorage('testNamespace'),
				 null,
				 'getter: returned null, as this namespace does not exists in $.localStorage, only in $.sessionStorage');
	
	assert.deepEqual($.localStorage('testNamespace', {object: {level1 : {level2 : {level3 : 'level3'}}}}),
				 {object: {level1 : {level2 : {level3 : 'level3'}}}},
				 'setter: returned the new multi-level object');
	
	assert.deepEqual($.localStorage('testNamespace.object'),
				 {level1 : {level2 : {level3 : 'level3'}}},
				 'getter: returned the proper sub-object when called by dot notation');
	
	assert.deepEqual($.localStorage('testNamespace.object.level1.level2'),
				 {level3 : 'level3'},
				 'getter: returned the proper sub-sub-object when called by dot notation');
	
	assert.deepEqual($.localStorage.remove('testNamespace'),
				 null,
				 'remove: removed the object and returned null');
	
	assert.deepEqual($.localStorage('testNamespace'),
				 null,
				 'setter: returned null after the previous test deleted our object');
});

localStorage.clear();
sessionStorage.clear();