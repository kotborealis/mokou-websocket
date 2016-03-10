# Mokou WebSocket
Reconnecting web socket

## Example:
```javascript
var MokouWebsocket = require("mokou-websocket");
var ws = new MokouWebsocket("ws://127.0.0.1:8001");
ws.onopen=function(e){
	//onopen
}
ws.onclose=function(e){
	//onclose
}
ws.onconnecting=function(e){
	//onconnecting
}
ws.onerror=function(e){
	//onerror
}
ws.onmessage=function(e){
	//onmessage
}
```
<a name="MokouWebsocket"></a>
## MokouWebsocket
**Kind**: global class

* [MokouWebsocket](#MokouWebsocket)
    * [new MokouWebsocket(url, [protocols])](#new_MokouWebsocket_new)
    * _instance_
        * [.readyState](#MokouWebsocket+readyState) : <code>number</code>
        * [.onopen(e)](#MokouWebsocket+onopen)
        * [.send(data)](#MokouWebsocket+send)
        * [.close()](#MokouWebsocket+close)
        * [.refresh()](#MokouWebsocket+refresh)
    * _inner_
        * [~connect([reconnectAttempt])](#MokouWebsocket..connect)

<a name="new_MokouWebsocket_new"></a>
### new MokouWebsocket(url, [protocols])
MokouWebsocket - simple reconnecting websocket for nodejs


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | WebSocket url |
| [protocols] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | WebSocket protocols |

<a name="MokouWebsocket+readyState"></a>
### mokouWebsocket.readyState : <code>number</code>
Websocket state

**Kind**: instance property of <code>[MokouWebsocket](#MokouWebsocket)</code>
<a name="MokouWebsocket+onopen"></a>
### mokouWebsocket.onopen(e)
WebSocket events callbacks

**Kind**: instance method of <code>[MokouWebsocket](#MokouWebsocket)</code>

| Param | Description |
| --- | --- |
| e | WebSocket event |

<a name="MokouWebsocket+send"></a>
### mokouWebsocket.send(data)
Sends given string to the other side

**Kind**: instance method of <code>[MokouWebsocket](#MokouWebsocket)</code>

| Param | Type |
| --- | --- |
| data | <code>string</code> |

<a name="MokouWebsocket+close"></a>
### mokouWebsocket.close()
Close WebSocket connection

**Kind**: instance method of <code>[MokouWebsocket](#MokouWebsocket)</code>
<a name="MokouWebsocket+refresh"></a>
### mokouWebsocket.refresh()
Refresh WebSocket connection

**Kind**: instance method of <code>[MokouWebsocket](#MokouWebsocket)</code>
<a name="MokouWebsocket..connect"></a>
### MokouWebsocket~connect([reconnectAttempt])
**Kind**: inner method of <code>[MokouWebsocket](#MokouWebsocket)</code>

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [reconnectAttempt] | <code>bool</code> | <code>false</code> | indicates if MokouWebSocket trying to reconnect to server |

