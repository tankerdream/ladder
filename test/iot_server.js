var  ladder = require('../')
    ,assert = require('assert');

describe('ladder',function(done){

    it('should return a CoAPServer',function(){
        server = ladder.iot_server('coap')
        assert.equal(require('coap'),server)
    })

})