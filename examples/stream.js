var  Stream = require('../').stream
    ,stream = new Stream()

stream.setValue('demo_key',new Date().toISOString())
stream.getValue('demo_key',function(value){
    console.log('[Demo:getValue] get <' + value +'>\n')
})

var value = Math.random()
var init_time = new Date().getTime()
stream.pushTimeline('demo_timeline',value)
var end_time = new Date().getTime()

console.log('[Demo:pushTimeline] push <' + value + '> to the demo_timeline\n')

stream.pollTimeline('demo_timeline',init_time,end_time,function(value){
    console.log('[Demo:pollTimeline] poll <' + value + '> from the demo_timeline\n')
    process.exit()
})
