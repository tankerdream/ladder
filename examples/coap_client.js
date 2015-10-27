const coap  = require('../')
    , req   = coap.request('coap','coap://localhost/Matteo')

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()
