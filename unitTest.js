var sample = {
    widget: {
        debug: 'on',
        window: {
            title: 'The Title of The Widget',
            name: 'widget_window',
            width: 500,
            height: 500
        },
        image: {
            src: '../images/goura.png',
            name: 'Goura',
            hOffset: 250,
            vOffset: 250,
            alignment: 'center'
        },
        text: {
            data: 'Click Here',
            size: 36,
            style: 'bold',
            name: 'text1'
        }
    }
};

QUnit.test('$.sessionStorage Test', function(assert) {
    assert.deepEqual($.sessionStorage('thisShouldBeNull'),
        null,
        'getter: non existent key returned null');

    assert.deepEqual($.sessionStorage('testNamespace', {test: true}),
        {test: true},
        'setter: returned the correct object');

    assert.deepEqual($.sessionStorage('testNamespace', {otherKey: 5}),
        {test: true, otherKey: 5},
        'setter: added new property and returned the new full object');

    assert.deepEqual($.sessionStorage('testNamespace', {test: false, otherKey: 5}),
        {test: false, otherKey: 5},
        'setter: overwrote a property and returned the new full object when given unchanged property');

    assert.deepEqual($.sessionStorage('testNamespace', {test: 13}),
        {test: 13, otherKey: 5},
        'setter: overwrote a property and returned the new full object when given only what changed');

    assert.deepEqual($.sessionStorage('testNamespace.otherKey', 10),
        {test: 13, otherKey: 10},
        'setter: overwrote a property by dot notation with a simple value');

    assert.deepEqual($.sessionStorage('testNamespace.otherKey', {obj: true}),
        {test: 13, otherKey: {obj: true}},
        'setter: overwrote a property by dot notation with a object');

    assert.deepEqual($.sessionStorage('testNamespace.otherKey.obj', false),
        {test: 13, otherKey: {obj: false}},
        'setter: overwrote a deep property by dot notation with a single value');

    assert.deepEqual($.sessionStorage('testNamespace.newProp', 'gaura'),
        {test: 13, otherKey: {obj: false}, newProp: 'gaura'},
        'setter: create a new property and add its value');

    $.sessionStorage.remove('testNamespace.newProp');

    assert.deepEqual($.sessionStorage('testNamespace.deeper.sitting.newProp', 'gaura'),
        {
            test: 13,
            otherKey: {
                obj: false
            },
            deeper: {
                sitting: {
                    newProp: 'gaura'
                }
            }
        },
        'setter: create a new deeper level property and add its value');

    $.sessionStorage.remove('testNamespace.deeper');

    assert.deepEqual($.sessionStorage('testNamespace.deep.newProp', {isNewObj: true}),
        {
            test: 13,
            otherKey: {
                obj: false
            },
            deep: {
                newProp: {
                    isNewObj: true
                }
            }
        },
        'setter: create a new deeper level property and add its object value');

    $.sessionStorage('testNamespace.deep.newerProp', 'Gaura');
    assert.deepEqual($.sessionStorage.remove('testNamespace.deep'),
        {test: 13, otherKey: {obj: false}},
        'remove: removed a sub-object with multiple children');

    assert.deepEqual($.sessionStorage('testNamespace.otherKey.obj', sample),
        {test: 13, otherKey: {obj: sample}},
        'setter: overwrote a deep property by dot notation with an object');

    assert.deepEqual($.sessionStorage.remove('testNamespace.otherKey'),
        {test: 13},
        'remove: removed a sub-object and return the new object');

    assert.deepEqual($.sessionStorage('testNamespace'),
        {test: 13},
        'getter: gave the updated object after deleting one property');

    assert.deepEqual($.sessionStorage.remove('testNamespace'),
        null,
        'remove: returned null after deleting the whole object');

    assert.deepEqual($.sessionStorage('testNamespace', {a: 125}),
        {a: 125},
        'setter: returned the correct object');

    $.sessionStorage('sample', sample);

    assert.deepEqual($.sessionStorage('sample.widget.debug'),
        'on',
        'getter: returned the proper sub-sub-object when called by dot notation');

    $.sessionStorage.remove('sample.widget.window');
    $.sessionStorage.remove('sample.widget.image');
    assert.deepEqual($.sessionStorage.remove('sample.widget.text'),
        {widget: {debug: 'on'}},
        'remove: removed a sub-object and return the new object');

    assert.deepEqual($.sessionStorage('empt.cache', {}),
        {
            cache: {}
        },
        'setter: add an empty object');

    $.sessionStorage('gaura.cacheTest', true);
    assert.deepEqual($.sessionStorage('gaura.cache', {}),
        {
            cacheTest: true,
            cache: {}
        },
        'setter: add new key with similar start of an existing one');

    assert.deepEqual(
        $.sessionStorage(
            'gaura.cache',
            {
                arr: [
                    {a: 'a'},
                    {b: 'b'}
                ]
            }
        ),
        {
            cacheTest: true,
            cache: {
                arr: [
                    {a: 'a'},
                    {b: 'b'}
                ]
            }
        },
        'setter: handling arrays is the same');

    $.sessionStorage('laksmi.cache', {});
    $.sessionStorage('laksmi.cache.foo', [1,2]);
    $.sessionStorage('laksmi.cache.bar', [3,4,5]);
    assert.deepEqual($.sessionStorage('laksmi'),
        {cache:{
            'foo' : [1,2],
            'bar' : [3,4,5]
        }},
        'getter: after set arrays for multiple properties');

    assert.deepEqual($.sessionStorage('laksmi.cache', $([{l: 'l1', v: 'v1'},{l: 'l2', v: 'v2'}])),
        {cache:{
            'foo' : [1,2],
            'bar' : [3,4,5]
        }},
        'setter: mergeing a jQuery array');


    $.sessionStorage('turo.rudi', {});
    $.sessionStorage('turo.rudi.foo', [{a : 'a1', b : 'b1'}]);
    $.sessionStorage('turo.rudi.foobar', [{x : 'a2', y : 'b2'}]);
    assert.deepEqual($.sessionStorage('turo'),
        {rudi:{
            'foo' : [{a : 'a1', b : 'b1'}],
            'foobar' : [{x : 'a2', y : 'b2'}]
        }},
        'getter: get full object after set object arrays with similar names for multiple properties');
    assert.deepEqual($.sessionStorage('turo.rudi'),
        {
            'foo' : [{a : 'a1', b : 'b1'}],
            'foobar' : [{x : 'a2', y : 'b2'}]
        },
        'getter: get 2nd level after set object arrays with similar names for multiple properties');
    assert.deepEqual($.sessionStorage('turo.rudi.foo'),
         [{a : 'a1', b : 'b1'}],
        'getter: get 3rd level after set object arrays with similar names for multiple properties');
    assert.deepEqual($.sessionStorage('turo.rudi.foo.0'),
        {a : 'a1', b : 'b1'},
        'getter: get 4th level after set object arrays with similar names for multiple properties');
    assert.deepEqual($.sessionStorage('turo.rudi.foo.0.b'),
        'b1',
        'getter: get 5th level after set object arrays with similar names for multiple properties');

});

QUnit.test('$.localStorage Test', function(assert){
    assert.deepEqual($.localStorage('testNamespace'),
        null,
        'getter: returned null, as this namespace does not exists in $.localStorage, only in $.sessionStorage');

    assert.deepEqual($.localStorage('testNamespace', {level0: {level1 : {level2 : {level3 : 'level3'}}}}),
        {level0: {level1 : {level2 : {level3 : 'level3'}}}},
        'setter: returned the new multi-level object');

    assert.deepEqual($.localStorage('testNamespace.level0'),
        {level1 : {level2 : {level3 : 'level3'}}},
        'getter: returned the proper sub-object when called by dot notation');
    
    assert.deepEqual($.localStorage('testNamespace.level0.level1.level2'),
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