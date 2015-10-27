var  Redis = require('ioredis')
var  redis;

function Stream(){
    redis = new Redis(6379,'127.0.0.1')
}

Stream.prototype.setValue = function(key,value){
    redis.set(key,value)
}

function returnValue(key){
    redis.get(key,function(error,value){
        return value
    })
}

Stream.prototype.getValue = function(key,callback){
    redis.get(key,function(error,value){
        return callback(value)
    })
}

Stream.prototype.pushTimeline = function(key,value){

    var unixTime = new Date().getTime()
    redis.zadd(key,unixTime,value)

}

Stream.prototype.pollTimeline = function(key,init_time,end_time,callback){
    redis.zrangebyscore(key,init_time,end_time,function(error,value){
        return callback(value)
    })
}

module.exports = Stream