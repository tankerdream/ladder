ladder
=====

[![Build
Status](https://travis-ci.org/mcollina/node-coap.png)](https://travis-ci.org/mcollina/node-coap)
[![gitter](https://badges.gitter.im/mcollina/node-coap.png)](https://gitter.im/mcollina/node-coap)

__ladder__ is the Internet of Things software that lets almost anything connect to the Internet.

  * <a href="#intro">Introduction</a>
  * <a href="#install">Installation</a>
  * <a href="#api">API</a>
  * <a href="#licence">Licence &amp; copyright</a>

[![NPM](https://nodei.co/npm/coap.png)](https://nodei.co/npm/coap/)

[![NPM](https://nodei.co/npm-dl/coap.png)](https://nodei.co/npm/coap/)

<a name="intro"></a>
## Introduction

What is Ladder?
> The Internet of Things software that lets almost anything connect to the Internet.

**ladder** is an **OPEN Open Source Project**, see the <a href="#contributing">Contributing</a> section to find out what this means.

<a name="install"></a>
## Installation

```
$ npm install ladder --save
```
<a name="api"></a>
## API

  * <a href="#request"><code>coap.<b>request()</b></code></a>
  * <a href="#createServer"><code>iot_server().<b>createServer()</b></code></a>
  * <a href="#setValue"><code>stream.<b>setValue()</b></code></a>
  * <a href="#getValue"><code>stream.<b>getValue()</b></code></a>
  * <a href="#pushTimeline"><code>stream.<b>pushTimeline()</b></code></a>
  * <a href="#pollTimeline"><code>stream.<b>pollTimeline()</b></code></a>

-------------------------------------------------------
<a name="request"></a>
### request(serverType,url)

Execute a CoAP request. `serverType` can only be **coap** now.`url` can be a string or an object.
If it is a string, it is parsed using `require('url').parse(url)`.If it is an object:
- `host`: A domain name or IP address of the server to issue the request
  to.
  Defaults to `'localhost'`.
- `hostname`: To support `url.parse()` `hostname` is preferred over
  `host`
- `port`: Port of remote server. Defaults to 5683.
- `method`: A string specifying the CoAP request method. Defaults to
  `'GET'`.
- `confirmable`: send a CoAP confirmable message (CON), defaults to
  `true`.
- `observe`: send a CoAP observe message, allowing the streaming of
  updates from the server.
- `pathname`: Request path. Defaults to `'/'`. Should not include query string
- `query`: Query string. Defaults to `''`. Should not include the path,
  e.g. 'a=b&c=d'
- `options`: object that includes the CoAP options, for each key-value
  pair the [setOption()](#setOption) will be called.
- `headers`: alias for `options`, but it works only if `options` is
  missing.
- `agent`: Controls [`Agent`](#agent) behavior. Possible values:
  * `undefined` (default): use [`globalAgent`](#globalAgent), a single socket for all
    concurrent requests.
  * [`Agent`](#agent) object: explicitly use the passed in [`Agent`](#agent).
  * `false`: opts out of socket reuse with an [`Agent`](#agent), each request uses a
    new UDP socket.
- `proxyUri`: adds the Proxy-Uri option to the request, so if the request is sent to a
  proxy (or a server with proxy features) the request will be forwarded to the selected URI.
  The expected value is the URI of the target. E.g.: 'coap://192.168.5.13:6793'

`ladder.request()` returns an instance of <a
href='#incoming'><code>OutgoingMessage</code></a>.
If you need
to add a payload, just `pipe` into it.
Otherwise, you __must__ call `end` to submit the request.

If `hostname` is a IPv6 address then the payload is sent through a
IPv6 UDP socket, dubbed in node.js as `'udp6'`.

#### Event: 'response'

`function (response) { }`

Emitted when a response is received.
`response` is
an instance of <a
href='#incoming'><code>IncomingMessage</code></a>.

If the `observe` flag is specified, the `'response'` event
will return an instance of
 <a href='#observeread'><code>ObserveReadStream</code></a>.
Which represent the updates coming from the server, according to the
[observe spec](http://tools.ietf.org/html/draft-ietf-core-observe-11).

-------------------------------------------------------
<a name="createServer"></a>
### createServer([options], [requestListener])

Returns a new Server object.

The `requestListener` is a function which is automatically
added to the `'request'` event.

The constructor can be given an optional options object, containing one of the following options:
* `type`: indicates if the server should create IPv4 connections (`udp4`) or IPv6 connections (`udp6`). Defaults
  to `udp4`.
* `proxy`: indicates that the server should behave like a proxy for incoming requests containing the `Proxy-Uri` header.
  An example of how the proxy feature works, refer to the example in the `/examples` folder. Defaults to `false`.


#### Event: 'request'

`function (request, response) { }`

Emitted each time there is a request. 
`request` is an instance of <a
href='#incoming'><code>IncomingMessage</code></a> and `response` is
an instance of <a
href='#outgoing'><code>OutgoingMessage</code></a>.

If the `observe` flag is specified, the `response` variable
will return an instance of <a href='#observewrite'><code>ObserveWriteStream</code></a>.
Each `write(data)` to the stream will cause a new observe message sent
to the client.

#### server.listen(port, [address], [callback])

Begin accepting connections on the specified port and hostname.  If the
hostname is omitted, the server will accept connections directed to any
IPv4 or IPv6 address by passing `null` as the address to the underlining socket.

To listen to a unix socket, supply a filename instead of port and hostname.

This function is asynchronous.

#### server.close([callback])

Closes the server.

This function is synchronous, but it provides an asynchronous callback
for convenience.

-------------------------------------------------------
<a name="outgoing"></a>
### OutgoingMessage

An `OutgoingMessage` object is returned by `coap.request` or
emitted by the `coap.createServer` `'response'` event.
It may be used to access response status, headers and data.

It implements the [Writable
Stream](http://nodejs.org/api/stream.html#stream_class_stream_writable) interface, as well as the
following additional methods and properties.

#### message.code

The CoAP code ot the message.
It is HTTP-compatible, as it can be passed `404`.

#### message.statusCode

(same as message.code)

<a name="setOption"></a>
#### message.setOption(name, value)

Sets a single option value.
All the options are in binary format, except for
`'Content-Format'`, `'Accept'` and `'ETag'`.
See <a href='#registerOption'><code>registerOption</code></a>
 to know how to register more.

Use an array of buffers
if you need to send multiple options with the same name.

If you need to pass a custom option, pass a string containing a
a number as key and a `Buffer` as value.

Example:

    message.setOption("Content-Format", "application/json");

or

    message.setOption("555", [new Buffer('abcde'),new Buffer('ghi')]);

`setOption` is also aliased as `setHeader` for HTTP API
compatibility.

Also, `'Content-Type'` is aliased to `'Content-Format'` for HTTP
compatibility.gg

Since v0.7.0, this library supports blockwise transfers, you can trigger
them by adding a `req.setOption('Block2', new Buffer([0x2]))` to the
output of [request](#request).

See the
[spec](http://tools.ietf.org/html/draft-ietf-core-coap-18#section-5.4)
for all the possible options.

#### message.reset()
Returns a Reset COAP Message to the sender. The RST message will appear as an empty message with code `0.00` and the
reset flag set to `true` to the caller. This action ends the interaction with the caller.

#### message.writeHead(code, headers)
Functions somewhat like `http`'s `writeHead()` function.  If `code` is does not match the CoAP code mask of `#.##`, it is coerced into this mask.  `headers` is an object with keys being the header names, and values being the header values.

-------------------------------------------------------
<a name="incoming"></a>
### IncomingMessage

An `IncomingMessage` object is created by `coap.createServer` or
`coap.request`
and passed as the first argument to the `'request'` and `'response'` event
respectively. It may be used to access response status, headers and data.

It implements the [Readable
Stream](http://nodejs.org/api/stream.html#stream_class_stream_readable) interface, as well as the
following additional methods and properties.

#### message.payload

The full payload of the message, as a Buffer.

#### message.options

All the CoAP options, as parsed by
[CoAP-packet](http://github.com/mcollina/coap-packet).

All the options are in binary format, except for
`'Content-Format'`, `'Accept'` and `'ETag'`.
See <a href='#registerOption'><code>registerOption()</code></a> to know how to register more.

See the
[spec](http://tools.ietf.org/html/draft-ietf-core-coap-18#section-5.4)
for all the possible options.

#### message.headers

All the CoAP options that can be represented in a human-readable format.
Currently they are only `'Content-Format'`, `'Accept'` and
`'ETag'`.
See <a href='#registerOption'> to know how to register more.

Also, `'Content-Type'` is aliased to `'Content-Format'` for HTTP
compatibility.

#### message.code

The CoAP code of the message.

#### message.method

The method of the message, it might be
`'GET'`, `'POST'`, `'PUT'`, `'DELETE'` or `null`.
It is null if the CoAP code cannot be parsed into a method, i.e. it is
not in the '0.' range.

#### message.url

The URL of the request, e.g.
`'coap://localhost:12345/hello/world?a=b&b=c'`.

#### message.rsinfo

The sender informations, as emitted by the socket.
See [the `dgram` docs](http://nodejs.org/api/dgram.html#dgram_event_message) for details

#### message.outSocket

Information about the socket used for the communication (address and port).


-------------------------------------------------------
<a name="observeread"></a>
### ObserveReadStream

An `ObserveReadStream` object is created by `coap.request` to handle
_observe_ requests.
It is passed as the first argument to the `'response'` event.
It may be used to access response status, headers and data as they are
sent by the server.
__Each new observe message from the server is a new `'data'` event__.

It implements the [Readable
Stream](http://nodejs.org/api/stream.html#stream_class_stream_readable)
and [IncomingMessage](#incoming) interfaces, as well as the
following additional methods, events and properties.

#### close()

Closes the stream.

#### message.rsinfo

The sender informations, as emitted by the socket.
See [the `dgram` docs](http://nodejs.org/api/dgram.html#dgram_event_message) for details

#### message.outSocket

Information about the socket used for the communication (address and port).

-------------------------------------------------------
<a name="observewrite"></a>
### ObserveWriteStream

An `ObserveWriteStream` object is 
emitted by the `coap.createServer` `'response'` event as a response
object.
It may be used to set response status, headers and stream changing data
to the client.

Each new `write()` call is a __new message__ being sent to the client.

It implements the [Writable
Stream](http://nodejs.org/api/stream.html#stream_class_stream_writable)
and [OutgoingMessage](#outgoing) interfaces, as well as the
following additional methods and properties.






## Contributors

__ladder__ is only possible due to the excellent work of the following contributors:

<table><tbody>
<tr><th align="left">Tankerdream</th><td><a href="https://github.com/mcollina">GitHub/mcollina</a></td><td><a href="https://twitter.com/matteocollina">Twitter/@matteocollina</a></td></tr>
</tbody></table>

## LICENSE

MIT, see LICENSE.md file.
