var QUnit = require('steal-qunit');
var canSymbol = require('can-symbol');
var shapeOperators = require("./shape");
var getSetOperators = require("../get-set/get-set");

QUnit.module('can-operate: shape operators: own+enumerable');

function testModifiedMap(callback, symbolToMethod){
	symbolToMethod = symbolToMethod || {
		getOwnEnumerableKeys: "keys",
		hasOwnKey: "has",
		getKeyValue: "get"
	};

	if(typeof Map !== "undefined") {
		shapeOperators.eachKey(symbolToMethod, function(method, symbol){
			getSetOperators.setKeyValue(Map.prototype,canSymbol.for("can."+symbol),function(){
				return this[method].apply(this, arguments);
			});
		});

		callback();

		shapeOperators.eachKey(symbolToMethod, function(symbol){
			delete Map.prototype[canSymbol.for(symbol)];
		});

	}
}


QUnit.test("getOwnEnumerableKeys (aka: keys)", function(){

	QUnit.deepEqual( shapeOperators.keys( {foo: 1, bar: 2}), ["foo","bar"], "POJO" );

	QUnit.deepEqual( shapeOperators.keys( ["0", "1"] ), Object.keys([1,2]), "Array"  );

	// Can we decorate a Map
	testModifiedMap(function(){
		var map = new Map(),
			obj = {};
		map.set("foo",1);
		map.set(obj, 2);

		QUnit.deepEqual( shapeOperators.toArray(shapeOperators.keys(map)),
			["foo",{}], "Decorated Map with can.getOwnEnumerableKeys" );
	});

	// Can we do the long form w/o the fast path
	var proto = {};
	getSetOperators.setKeyValue(proto,canSymbol.for("can.getOwnKeys"),function(){
		return ["a","b","c"];
	});
	getSetOperators.setKeyValue(proto,canSymbol.for("can.getOwnKeyDescriptor"),function(key){
		return ({
			a: {enumerable: false},
			b: {enumerable: true },
			c: {enumerable: true }
		})[key];
	});


	var defineMapLike = Object.create(proto,{});

	QUnit.deepEqual( shapeOperators.toArray(shapeOperators.keys(defineMapLike)),
		["b","c"], "Decorated Object with can.getOwnKeys and can.getOwnKeyDescriptor");

	/*var map = new Map(),
		obj = {};
	map.set("foo",1);
	map.set(obj, 2);

	QUnit.deepEqual( shapeOperators.toArray(shapeOperators.keys(map)),
		["foo",{}], "un-decorated Map" );*/
});

QUnit.test("eachIndex", function(){
	// Iterators work
	var Ctr = function(){};
	var arr = ["a", "b"];
	getSetOperators.setKeyValue(Ctr.prototype,canSymbol.iterator,function(){
		return {
			i: 0,
			next: function(){
				if(this.i === 1) {
					return { value: undefined, done: true };
				}
				this.i++;

				return { value: arr, done: false };
			}
		};
	});

	var obj = new Ctr();

	shapeOperators.eachIndex(obj, function(value, index){
		QUnit.equal(index, 0);
		QUnit.equal(value,arr);
	});

	shapeOperators.eachIndex(["a"], function(value, index){
		QUnit.equal(index, 0);
		QUnit.equal(value, "a");
	});
});

QUnit.test("eachKey", function(){
	var index;
	var answers, map;
	// Defined on something

	testModifiedMap(function(){
		var o1 = {}, o2 = {};
		map = new Map([[o1, "1"], [o2, 2]]);
		index = 0;
		answers = [[o1, "1"], [o2, 2]];
		shapeOperators.eachKey(map, function(value, key){
			var answer = answers[index++];
			QUnit.equal(value, answer[1], "map value");
			QUnit.equal(key, answer[0], "map key");
		});
	});

	var obj = {a: "1", b: "2"};
	index = 0;
	answers = [["a", "1"], ["b", "2"]];
	shapeOperators.eachKey(obj, function(value, key){
		var answer = answers[index++];
		QUnit.equal(value, answer[1], "object value");
		QUnit.equal(key, answer[0], "object key");
	});


	/*
	map = new Map([[o1, "1"], [o2, 2]]);
	index = 0;
	answers = [[o1, "1"], [o2, 2]];
	shapeOperators.eachKey(map, function(value, key){
		var answer = answers[index++];
		QUnit.equal(value, answer[1], "plain map value");
		QUnit.equal(key, answer[0], "plain map key");
	});*/
});

QUnit.test("toArray", function(){
	if(typeof document !== "undefined") {
		var ul = document.createElement("ul");
		ul.innerHTML = "<li/><li/>";
		var arr = shapeOperators.toArray(ul.childNodes);

		QUnit.equal(arr.length, 2, "childNodes");
		QUnit.equal(arr[0].nodeName.toLowerCase(), "li", "childNodes");
	}
});


QUnit.module('can-operate: shape operators: own');

QUnit.test("hasOwnKey", function(){

	var index;
	var answers, map;
	// Defined on something

	testModifiedMap(function(){
		var o1 = {}, o2 = {};
		map = new Map([[o1, "1"], [o2, 2]]);
		index = 0;
		answers = [[o1, "1"], [o2, 2]];
		QUnit.ok( shapeOperators.hasOwnKey(map, o1) , "Map" );
	});

	var obj = {foo: "bar"};

	QUnit.ok( shapeOperators.hasOwnKey(obj, "foo") , "obj" );
	QUnit.ok( !shapeOperators.hasOwnKey(obj, "bar") , "obj" );

});


QUnit.test("getOwnKeys", function(){
	var obj = Object.create(null,{
		foo: {value: "1", enumerable: true},
		bar: {value: "2", enumerable: false},
	});

	QUnit.deepEqual( shapeOperators.getOwnKeys(obj), ["foo","bar"] , "obj" );
});

QUnit.test("getOwnKeyDescriptor", function(){

});

QUnit.module('can-operate: shape operators: proto chain');

QUnit.test("in", function(){

});

QUnit.test("getAllEnumerableKeys", function(){

});

QUnit.test("getAllKeys", function(){

});
