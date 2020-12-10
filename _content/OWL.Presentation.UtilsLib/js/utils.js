var OWLUtils = new (function () {

    // Thanks to https://remibou.github.io/How-to-keep-js-object-reference-in-Blazor/
    // Resolving JavaScript Object references    
    var jsObjectRefs = {};
    var jsObjectRefId = 0;
    var me = this;

    const jsRefKey = '__jsObjectRefId';

    DotNet.attachReviver(function (key, value) {
        if (value &&
            typeof value === 'object' &&
            value.hasOwnProperty(jsRefKey) &&
            typeof value[jsRefKey] === 'number') {
    
            var id = value[jsRefKey];
            if (!(id in jsObjectRefs)) {
                throw new Error("This JS object reference does not exists : " + id);
            }
            const instance = jsObjectRefs[id];
            return instance;
        } else {
            return value;
        }
    });   
    this.storeObjectRef = function (obj) {
        var id = jsObjectRefId++;
        jsObjectRefs[id] = obj;
        var jsRef = {};
        jsRef[jsRefKey] = id;
        return jsRef;
    }   
    this.removeObjectRef = function (id) {
        delete jsObjectRefs[id];
    }
    // End Resolving JavaScript Object references

    // Calling Javascript Methods on object instances
    this.callInstanceMethod = function (instance, methodPath, ...args) {
        this.callInstanceMethodWithReturn(instance, methodPath, ...args);
    };
    this.callInstanceMethodWithReturn = function (instance, methodPath, ...args) {
        if (methodPath.indexOf('.') >= 0) {
            //if it's a method call on a child object we get this child object so the method call will happen in the context of the child object
            //some method like window.locaStorage.setItem  will throw an exception if the context is not expected
            var instancePath = methodPath.substring(0, methodPath.lastIndexOf('.'));
            instance = me.getInstanceProperty(instance, instancePath);
            methodPath = methodPath.substring(methodPath.lastIndexOf('.') + 1);
        }
        for (let index = 0; index < args.length; index++)  {
            const element = args[index];
            //we change null value to undefined as there is no way to pass undefined value from C# and most of the browser API use undefined instead of null value for "no value"
            if (element === null) {
                args[index] = undefined;
            }
        }
        var method = me.getInstanceProperty(instance, methodPath);
        return method.apply(instance, args);
    };
    function getPropertyList(path) {
        var res = path.replace('[', '.').replace(']', '').split('.');
        if (res[0] === "") { // if we pass "[0].id" we want to return [0,'id']
            res.shift();
        }
        return res;
    }
    this.getInstanceProperty = function (instance, propertyPath) {
        if (propertyPath === '') {
            return instance;
        }
        var currentProperty = instance;
        var splitProperty = getPropertyList(propertyPath);

        for (i = 0; i < splitProperty.length; i++) {
            if (splitProperty[i] in currentProperty) {
                currentProperty = currentProperty[splitProperty[i]];
            } else {
                return null;
            }
        }
        return currentProperty;
    };
    // End Calling Javascript Methods on object instances
    
});
