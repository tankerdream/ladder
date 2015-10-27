var  Stream = require('../').stream
    ,stream = new Stream()

stream.setValue('test_key',new Date().toISOString())
stream.getValue('test_key',function(value){
    console.log(value)
    process.exit()
})