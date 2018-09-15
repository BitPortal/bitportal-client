const messageHandler = `
if (WebViewBridge) {
  const parseMessageId = function(text) {
    const re = /BITPORAL_BRIDGE_MESSAGE@(\\d|\\w)+@/g;
    const found = text.match(re);
    return found && found[0];
  };

  const uuid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return 'BITPORAL_BRIDGE_MESSAGE@' + s4() + "_" + s4() + "_" + s4() + "_" + s4() + "_" + s4() + "_" + new Date().getTime() + "@";
  };

  let callbacks = {};

  const sendRequest = function(type, payload, onSuccess, onError) {
    onSuccess = onSuccess || function(){};
    onError = onError || function(){};
    const messageId = uuid();
    callbacks[messageId] = { onSuccess, onError };
    WebViewBridge.send(JSON.stringify({ messageId, type, payload }));
  };

  WebViewBridge.onMessage = function(message) {
    let action;

    try {
      action = JSON.parse(message);
    } catch (error) {
      const messageId = parseMessageId(message);
      if (messageId) {
        callbacks[messageId].onError({ message: error.message});
        delete callbacks[messageId];
      }
      return;
    }

    const messageId = action.messageId;
    const payload = action.payload;

    switch(action.type) {
      case 'actionSucceeded':
        callbacks[messageId].onSuccess(payload.data);
        delete callbacks[messageId];
        break;
      case 'actionFailed':
        callbacks[messageId].onError(payload.error);
        delete callbacks[messageId];
        break;
    }
  };

  window.bitportal = {
    getEOSAccountInfo: function(params) {
      if (!params.account) {
        throw new Error('"account" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('getEOSAccountInfo', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    getEOSCurrencyBalance: function(params) {
      if (!params.account) {
        throw new Error('"account" is required');
      } else if (!params.contract) {
        throw new Error('"contract" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('getEOSCurrencyBalance', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    getEOSActions: function(params) {
      if (!params.offset) {
        throw new Error('"offset" is required');
      } else if (!params.account) {
        throw new Error('"account" is required');
      } else if (!params.position) {
        throw new Error('"position" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('getEOSActions', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    getEOSTransaction: function(params) {
      if (!params.id) {
        throw new Error('"offset" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('getEOSTransaction', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    transferEOSAsset: function(params) {
      if (!params.amount) {
        throw new Error('"amount" is required');
      } else if (!params.precision) {
        throw new Error('"precision" is required');
      } else if (!params.symbol) {
        throw new Error('"symbol" is required');
      } else if (!params.contract) {
        throw new Error('"contract" is required');
      } else if (!params.from) {
        throw new Error('"from" is required');
      } else if (!params.to) {
        throw new Error('"to" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('transferEOSAsset', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        })
      });
    },
    voteEOSProducers: function(params) {
      if (!params.voter) {
        throw new Error('"voter" is required');
      } else if (!params.producers) {
        throw new Error('"producers" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('voteEOSProducers', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    pushEOSAction: function(params) {
      if (!params.actions) {
        throw new Error('"actions" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('pushEOSAction', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    eosAuthSign: function(params) {
      if (!params.account) {
        throw new Error('"account" is required');
      } else if (!params.publicKey) {
        throw new Error('"publicKey" is required');
      } else if (!params.signData) {
        throw new Error('"signData" is required');
      }

      return new Promise(function(resolve, reject) {
        sendRequest('eosAuthSign', params, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    getCurrentWallet: function() {
      return new Promise(function(resolve, reject) {
        sendRequest('getCurrentWallet', {}, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    },
    getAppInfo: function() {
      return new Promise(function(resolve, reject) {
        sendRequest('getAppInfo', {}, function(data) {
          resolve(data);
        }, function(error) {
          reject(error);
        });
      });
    }
  };

  document.dispatchEvent(new Event('bitportalapi'));
}
`

export default messageHandler
