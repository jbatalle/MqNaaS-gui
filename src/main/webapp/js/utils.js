function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
/*
function xmlToJson(){
    var x2js = new X2JS();
    var json = x2js.xml_str2json( data );
    return json;
}
*/