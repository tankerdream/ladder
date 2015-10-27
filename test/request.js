var  liangyi = require('../')
    ,assert = require('assert');

describe('liangyi',function(done){

     it('should return a CoAP request',function(){
            request = liangyi.request('coap')
            assert.equal(require('coap').request,request)
     })

})