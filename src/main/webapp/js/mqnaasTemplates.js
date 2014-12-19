getTSON = function(endpoint){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>TSON</type><model>Internal</model><version>1.0</version></specification><endpoints><endpoint><uri>'+endpoint+'</uri></endpoint></endpoints></ns2:rootResourceDescriptor>';
};

getARN = function(endpoint){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>ARN</type><model>Internal</model><version>1.0</version></specification><endpoints><endpoint><uri>'+endpoint+'</uri></endpoint></endpoints></ns2:rootResourceDescriptor>';
};

getNETWORK = function(){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>NETWORK</type><model>Internal</model><version>1.0</version></specification></ns2:rootResourceDescriptor>';
};
