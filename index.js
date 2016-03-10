var WebSocket = require('ws');

/**
 * MokouWebsocket - simple reconnecting websocket for nodejs
 * @param {string} url - WebSocket url
 * @param {Object[]} [protocols=[]] - WebSocket protocols
 * @constructor
 */
function MokouWebsocket(url, protocols){
    this.protocols = protocols || [];
    this.url = url;
    /**
     * Websocket state
     * @type {number}
     */
    this.readyState = WebSocket.CONNECTING;

    this.reconnectInterval = 1000;
    this.timeoutInterval = 2000;

    var ws;
    var forcedClose=false;

    var self=this;

    /**
     * WebSocket events callbacks
     * @param e - WebSocket event
     */
    this.onopen = function(e){};
    this.onclose = function(e){};
    this.onconnecting = function(e){};
    this.onerror = function(e){};
    this.onmessage = function(e){};

    /**
     *
     * @param {bool} [reconnectAttempt=false] - indicates if MokouWebSocket trying to reconnect to server
     */
    function connect(reconnectAttempt){
        reconnectAttempt = reconnectAttempt || false;

        ws = new WebSocket(self.url, self.protocols);
        self.onconnecting();

        var timeout = setTimeout(function(){
            ws.close();
        },self.timeoutInterval);


        ws.onopen = function(e) {
            clearTimeout(timeout);
            self.readyState=WebSocket.OPEN;
            reconnectAttempt=false;
            self.onopen(e);
        };

        ws.onclose = function(e){
            clearTimeout(timeout);
            ws=null;
            if (forcedClose) {
                self.readyState = WebSocket.CLOSED;
                self.onclose(e);
            }
            else{
                self.readyState = WebSocket.CONNECTING;
                self.onconnecting();
                if (!reconnectAttempt) {
                    self.onclose(e);
                }
                setTimeout(function() {
                    connect(true);
                }, self.reconnectInterval);
            }
        };

        ws.onmessage = function(e){
            self.onmessage(e);
        };

        ws.onerror = function(e) {
            clearTimeout(timeout);
            ws = null;
            if (forcedClose) {
                self.readyState = WebSocket.CLOSED;
                self.onclose(e);
            }
            else {
                self.readyState = WebSocket.CONNECTING;
                self.onconnecting();
                if (!reconnectAttempt) {
                    self.onclose(e);
                }
                setTimeout(function() {
                    connect(true);
                }, self.reconnectInterval);
            }
            self.onerror(e);
        };
    }

    connect(false);

    /**
     * Sends given string to the other side
     * @param {string} data
     */
    this.send = function(data){
        if(ws){
            ws.send(data);
        }
        else{
            throw 'Mokou-websocket: WebSocket closed.';
        }
    };

    /**
     * Close WebSocket connection
     */
    this.close = function(){
        if(ws){
            forcedClose=true;
            ws.close();
            ws=null;
        }
    };

    /**
     * Refresh WebSocket connection
     */
    this.refresh = function() {
        if (ws) {
            ws.close();
        }
    };
}

module.exports = MokouWebsocket;