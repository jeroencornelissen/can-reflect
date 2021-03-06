var QUnit = require("steal-qunit");
var shape = require("../reflections/shape/shape");
require("./map");

if(typeof Map !== "undefined") {
    QUnit.module("can-reflect/types/map Map");

    QUnit.test("assign", function(){
        var map = new Map();
        shape.assign( map, {name: "CanJS"} );
        QUnit.equal( map.get("name"), "CanJS" , "object to map");

        var map1 = new Map();
        map = new Map();
        var o1 = {name: "foo"};
        var o2 = {name: "bar"};

        map1.set(o1, o2);
        shape.assign( map, map1 );
        QUnit.equal( map.get(o1), o2 , "map to map");

    });

    QUnit.test("has", function(){
        var map = new Map();
        var o1 = {name: "foo"};
        var o2 = {name: "bar"};
        map.set(o1, o2);
        QUnit.ok( shape.hasOwnKey(map, o1), true);
    });

    QUnit.test("update", function(){
        var map = new Map();
        var o1 = {name: "o1"};
        var o2 = {name: "o2"};
        var o3 = {name: "o3"};
        map.set(o1, o2);
        map.set(o2, o1);


        var map2 = new Map();
        map2.set(o1, o3);
        map2.set(o3, o1);
        shape.update(map, map2);

        QUnit.notOk( map.has(o2), "removed key");
        QUnit.equal( map.get(o3), o1, "added key");
        QUnit.equal( map.get(o1), o3, "updated key");

    });
}


if(typeof WeakMap !== "undefined") {
    QUnit.module("can-reflect/types/map WeakMap");

    QUnit.test("assign", function(){
        var canjs = new Map();
        var name = {name: "toUpperCase"};
        canjs.set(name, "CANJS");

        var map = new WeakMap();

        shape.assign( map, canjs );
        QUnit.equal( map.get(name), "CANJS" , "map to weakmap");


        map = new WeakMap();

        var map1 = new Map();
        var o1 = {name: "foo"};
        var o2 = {name: "bar"};
        map1.set(o1, o2);

        shape.assign( map, map1 );
        QUnit.equal( map.get(o1), o2 , "map to map");

    });

    QUnit.test("has", function(){
        var map = new WeakMap();
        var o1 = {name: "foo"};
        var o2 = {name: "bar"};
        map.set(o1, o2);
        QUnit.ok( shape.hasOwnKey(map, o1), true);
    });

    QUnit.test("update", function(){
        var map = new WeakMap();
        var o1 = {name: "o1"};
        var o2 = {name: "o2"};
        var o3 = {name: "o3"};
        map.set(o1, o2);
        map.set(o2, o1);


        var map2 = new WeakMap();
        map2.set(o1, o3);
        map2.set(o3, o1);
        try{
            shape.update(map, map2);
        } catch(e) {
            QUnit.ok(true, "throws an error");
        }

    });
}
