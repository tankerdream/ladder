function IoTServer(protocol,options){
    if(protocol == 'coap')
        return CoAPServer(options)
    else
        return 'other protocol'
}

function CoAPServer(options){
    return require('coap')
}

module.exports = IoTServer