var  Stream = require('../').stream
    ,assert = require('assert')
    ,redis = require('ioredis')(6379,'127.0.0.1')
    ,stream = new Stream()

describe('ladder',function(){


    it('should put the value in the Stream',function(){

        var time = new Date().toISOString()
        stream.setValue('test_key',time)

        redis.get('test_key',function(error,value){
            assert.equal(time,value)
            done()
        })

    })

    it('should get the value from the Stream',function(){

        var time = new Date().toISOString()
        stream.setValue('get_key',time)

        stream.getValue('get_key',function(value){
            assert.equal(time,value)
            done()
        })

    })

    it('should push the value in the Timeline',function(){

        var test_value = Math.random()
        stream.pushTimeline('test_timeline',test_value)

        redis.lrange('test_timeline',0,-1,function(error,value){
            assert.equal(test_value,value)
            done()
        })
    })

    it('should get the value from the Timeline',function(){

        var test_value = Math.random()
        var init_time = new Date().getTime()
        stream.pushTimeline('test_timeline',test_value)
        var end_time = new Date().getTime()
        stream.pollTimeline('test_timeline',init_time,end_time,function(value){
            assert.equal(test_value,value)
        })

    })

})