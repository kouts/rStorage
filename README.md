rStorage
========

This a fork of the jQuery rStorage Plugin
The differences are:
* Different method for gettter and setter
* Put flatten and unflatten methods in local scope

## localStorage and sessionStorage helper utility for jQuery

rStorage simplify the usage of localStorage and sessionStorage with JSON objects.

If you have any idea about improving this plugin please let me know

## Functionalities

* Simple namespacing
* Store objects and encoding, decoding to or from JSON happens automatically
* Different function call for getters and setters
* Setters and getters recognize dot notation format
* Integrated unit tests

## How to use

The API is the same for both storages.

### Setter

```js
var myObject = {
  level1 : {
     level2 : {
        level3 : 'level3'
     }
  }
}

$.localStorage.set('testNamespace', myObject);     //setter

//updating an existing key somewhere deep inside the object
$.localStorage.set(
    'testNamespace.level1.level2',
    {
        foo : {
            bar : 'Gauranga!'
        }
    });

//insert a new key deeply
$.localStorage.set(
    'testNamespace.aNew.deeply.foo',
    {
        bar : 'Gauranga!'
    });
```

### Getter

```js
$.localStorage.get('testNamespace');      //getter
$.localStorage.get('testNamespace.level1');      //dot notation getter
```

### Removing parts by dot notation

```js
$.localStorage.remove('testNamespace.level1.level2');
```

### Same examples for sessionStorage

```js
$.sessionStorage.get('testNamespace');     //getter, it does not see what we have in $.localStorage
$.sessionStorage.set('testNamespace',
    {
       book : {
          chapter1: {
             title : 'First Chapter',
             pages : 200
          }
          chapter2: {
             title : 'Second Chapter',
             pages : 300
          }
       }
    });

$.sessionStorage.set(
    'testNamespace.level1.level2',
    {
        foo : {
            bar : 'Gauranga!'
        }
    });

$.sessionStorage.set(
    'testNamespace.aNew.deeply.foo',
    {
        bar : 'Gauranga!'
    });


$.sessionStorage.get('testNamespace');    //getter will return our book object
```
