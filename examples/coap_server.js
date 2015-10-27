var  iot_server = require('../').iot_server
    ,coap_server = iot_server('coap').createServer()

coap_server.on('request', function(req, res) {
  res.end('Hello ' + req.url.split('/')[1] + '\n')
})

coap_server.listen(function() {
  console.log('CoAP server started')
})
