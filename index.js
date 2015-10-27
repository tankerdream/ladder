var  IoTServer = require('./lib/iot_server')

module.exports.request = function(protocol,url){
    if (protocol === 'coap')
        return require('coap').request(url)
}

module.exports.iot_server = IoTServer
module.exports.stream = require('./lib/stream')
