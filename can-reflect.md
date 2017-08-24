@module {Object} can-reflect
@parent can-infrastructure
@group can-reflect/call 3 Call reflections
@group can-reflect/get-set 2 Get/Set reflections
@group can-reflect/observe 5 Observable reflections
@group can-reflect/shape 4 Shape reflections
@group can-reflect/type 1 Type reflections
@package ./package.json

@description Perform operations and read information on unknown data types.

@type {Object} The `can-reflect` package exports an object with
methods used to perform operations and read information on unknown data
types. For example the sets the `name` property on some type of map:

```js
const canReflect = require("can-reflect");

const map = CREATE_MAP_SOMEHOW();

canReflect.setKeyValue(map,"name", "my map");
```

Any object can interact with the reflect APIs by having the right
[can-symbol] symbols.  The following creates an object that informs how
[can-reflect.getKeyValue] and [can-reflect.setKeyValue] behave:

```js
const canSymbol = require("can-symbol");

const obj = {
	_data: new Map()
};
obj[canSymbol.for("can.getKeyValue")] = function(key){
	return this._data.get(key);
};
obj[canSymbol.for("can.setKeyValue")] = function(key, value){
	return this._data.set(key, value);
};
```

@body

The different reflections you can use are grouped by reflection type as follows:

- Type Reflections - Tell you what the value is.
  - `.isConstructorLike `
  - `.isFunctionLike`
  - `.isIteratorLike`
  - `.isListLike`
  - `.isMapLike`
  - `.isMoreListThanMapLike` (lists can often still be maps)
  - `.isObservableLike`
  - `.isValueLike`
  - `.isSymbolLike`
- Shape Reflections - Give you information about the value.
  - _own and enumerable_
    - `.eachIndex`
	- `.eachKey`
	- `.each`
    - `.getOwnEnumerableKeys` (aka `.keys`)
	- `.toArray`
  - _own_
	- `.getOwnKeys`
	- `.getOwnKeyDescriptor`
  - _all_ (pending)
- Getter / Setter Reflections - get or set some value on another value.
  - `.getKeyValue`, `.setKeyValue`, `.deleteKeyValue` - for maps (`get`, `set`, and `delete` are aliases)
  - `.getValue`, `.setValue` - for things like computes
  - `.splice`, `.addKeys(keyValues[,index])`, `.removeKeys(keysOrValues[,index])` (PENDING?)
- Function Reflections - call functions or create instances
  - `.call`
  - `.apply`
  - `.new`
- Observe Reflections - listen to when things change
  - `.onKeyValue`, `.offKeyValue`
  - `.onKeys` - when anything changes
  - `.onKeysAdded`, `.onKeysRemoved`
  - `.getKeyDependencies` - for debugging
  - `.keyHasDependencies`
  - `.onValue`, `.offValue`
  - `.getValueDependencies`
  - `.valueHasDependencies`
  - `.onEvent`, `.offEvent` - listen to an event on something
