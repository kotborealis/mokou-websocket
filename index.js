'use strict';

const WebSocket = require('ws');
const Events = require('events');
const util = require('util');

/**
 * MokouWebsocket - simple reconnecting websocket for nodejs
 * @param {string} url - WebSocket url
 * @param {Object[]} [protocols=[]] - WebSocket protocols
 * @param {Object} - WebSocket options
 * @constructor
 */
function MokouWebsocket(url, protocols= [], options = {}) {
  this.protocols = protocols;
  this.url = url;
  this.options = options;
  /**
   * Websocket state
   * @type {number}
   */
  this.readyState = WebSocket.CONNECTING;

  this.reconnectInterval = 1000;
  this.timeoutInterval = 2000;

  let ws;
  let forcedClose = false;

  const self = this;

  /**
   * Websocket on open event
   * @param {{}} e - WebSocket event
   */
  this.onopen = function (e) {
    return e;
  };
  /**
   * Websocket on close event
   * @param {{}} e - WebSocket event
   */
  this.onclose = function (e) {
    return e;
  };
  /**
   * Websocket on connectiong event
   * @param {{}} e - WebSocket event
   */
  this.onconnecting = function (e) {
    return e;
  };
  /**
   * Websocket on error event
   * @param {{}} e - WebSocket event
   */
  this.onerror = function (e) {
    return e;
  };
  /**
   * Websocket on message event
   * @param {{}} e - WebSocket event
   */
  this.onmessage = function (e) {
    return e;
  };

  /**
   * Attempt to connect (reconnect) to websocket server
   * @param {boolean} [reconnectAttempt=false] - indicates if MokouWebSocket trying to reconnect to server
   */
  function connect(reconnectAttempt) {
    reconnectAttempt = reconnectAttempt || false;

    ws = new WebSocket(self.url, self.protocols, self.options);
    self.emit('connecting');
    self.onconnecting();

    const timeout = setTimeout(() => {
      ws.close();
    }, self.timeoutInterval);

    ws.onopen = function (e) {
      clearTimeout(timeout);
      self.readyState = WebSocket.OPEN;
      reconnectAttempt = false;
      self.emit('open', e);
      self.onopen(e);
    };

    ws.onclose = function (e) {
      clearTimeout(timeout);
      ws = null;
      if (forcedClose) {
        self.readyState = WebSocket.CLOSED;
        self.emit('close', e);
        self.onclose(e);
      }
      else {
        self.readyState = WebSocket.CONNECTING;
        self.emit('connecting');
        self.onconnecting();
        if (!reconnectAttempt) {
          self.emit('close', e);
          self.onclose(e);
        }
        setTimeout(() => {
          connect(true);
        }, self.reconnectInterval);
      }
    };

    ws.on('message', (e) => {
      self.emit('message', e);
      self.onmessage(e);
    });

    ws.onerror = function (e) {
      clearTimeout(timeout);
      ws = null;
      if (forcedClose) {
        self.readyState = WebSocket.CLOSED;
        self.emit('close', e);
        self.onclose(e);
      }
      else {
        self.readyState = WebSocket.CONNECTING;
        self.emit('connecting');
        self.onconnecting();
        if (!reconnectAttempt) {
          self.emit('close', e);
          self.onclose(e);
        }
        setTimeout(() => {
          connect(true);
        }, self.reconnectInterval);
      }
      self.emit('error', e);
      self.onerror(e);
    };
  }

  connect(false);

  /**
   * Sends given string to the other side
   * @param {string} data
   */
  this.send = function (data) {
    if (ws) {
      ws.send(data);
    }
    else {
      throw new Error('Mokou-websocket: WebSocket closed.');
    }
  };

  /**
   * Close WebSocket connection
   */
  this.close = function () {
    if (ws) {
      forcedClose = true;
      ws.close();
      ws = null;
    }
  };

  /**
   * Refresh WebSocket connection
   */
  this.refresh = function () {
    if (ws) {
      ws.close();
    }
  };
}
util.inherits(MokouWebsocket, Events);

module.exports = MokouWebsocket;
