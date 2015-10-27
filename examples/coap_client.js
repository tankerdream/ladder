const ladder  = require('../')
    , req   = ladder.request('coap','coap://localhost/Matteo')

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()
