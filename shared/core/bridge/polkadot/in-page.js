export const BG_DAPP_RESPONSE = 'DAPP/CONTENT_SCRIPT_RESPONSE';


export function resolveRequest(requestType, opts, metadata) {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    try {
      const data = { requestType, opts, metadata };
      window.postMessage(data, location.href);
      window.addEventListener('message', event => {
        // We only accept messages from ourselves
        if (event.source !== window) return;
        if (event.data && event.data.type && event.data.type === BG_DAPP_RESPONSE) {
          const {
            data: { result, status, message },
          } = event;
          if (status === 500) {
            reject(message);
          }
          resolve(result);
        }
      });
    } catch (e) {
      const error = {
        message: e.message,
        stack: e.stack || {},
      };
      reject(error);
    }
  });
}
