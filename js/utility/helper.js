export function setAttributes(element, attributes) {
    for(let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

export function setObjectProperties(obj, keyValueObject) {
    // {name: "kimberly"}
    for(let prop in keyValueObject) {
        obj[prop] = keyValueObject[prop];
    }
    return obj;

}