function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/*
 * Check if is array. If not, convert to array. 
 * Only used when is required an array and with one element is not recognized as an arrray.
 * @param {type} possibleArray
 * @returns {Array}
 */
function checkIfIsArray(possibleArray) {
    if (possibleArray instanceof Array) {
        return possibleArray;
    } else if(possibleArray===undefined){
        return;
    } else {
        return [possibleArray];
    }
}

function generateUrl(action1, resource, action2) {
    var url;
    url = action1 + "/" + resource + "/" + action2;
    return url;
}