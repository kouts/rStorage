rStorage
========

jQuery rStorage Plugin

#### localStorage and sessionStorage helper utility for jQuery

rStorage simplify the useage of localStorage and sessionStorage with JSON objects.

If you have idea about improving this plugin please let me know

Functionalities:
* Simple namespacing
* Store objects and encoding, decoding to or from JSON happens automatically
* Same function call for getters and setters
* Integrated unit tests

#### How to use

The API is the same for both storages.

    var myObject = {
      level1 : {
         level2 : {
            level3 : 'level3'
         }
      }
    }
    $.localStorage('testNamespace', myObject);     //setter
    $.localStorage('testNamespace');      //getter
    $.localStorage.remove('testNamespace.level1.level2');

    $.sessionStorage('testNamespace');     //getter, it does not see what we have in $.localStorage
    $.sessionStorage('testNamespace', {
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
    $.sessionStorage('testNamespace');    //getter will return our book object