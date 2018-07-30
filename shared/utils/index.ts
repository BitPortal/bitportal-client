import Colors from 'resources/colors';

const multiple = (position: number): number => (!position ? 1 : 10 * multiple(position - 1));

export const roundDown = (value: number, decimal: number) => value && Math.floor(value * multiple(decimal)) / multiple(decimal);

export const roundUp = (value: number, decimal: number) => value && Math.ceil(value * multiple(decimal)) / multiple(decimal);

export const errorLoading = (err: string) => console.error('Dynamic page loading failed: ', err);

export const typeOf = (value: any) => Object.prototype.toString.call(value).slice(8, -1);

const loadedScripts: string[] = [];

export const loadScript = (src: string) => new Promise((resolve, reject) => {
  if (~loadedScripts.indexOf(src)) {
    resolve();
  } else {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => {
      loadedScripts.push(src);
      resolve();
    });
    script.addEventListener('error', (e) => {
      reject(e);
    });
    document.head.appendChild(script);
  }
});

export const getErrorMessage = (error: any) => {
  if (
    (typeOf(error) === 'Error' && error.message.indexOf('.cpp') !== -1)
    || (typeOf(error) === 'Object'
      && typeof error.message === 'string'
      && error.message.indexOf('.cpp') !== -1)
  ) {
    const errorObject = JSON.parse(error.message);

    if (
      errorObject.error
      && errorObject.error.details
      && errorObject.error.details.length
      && errorObject.error.details[0].message
    ) {
      return errorObject.error.details[0].message;
    }

    if (errorObject.error && errorObject.error.what) {
      return errorObject.error.what;
    }
  }

  if (typeof error === 'string') {
    const errorObject = JSON.parse(error);

    if (
      errorObject.error
      && errorObject.error.details
      && errorObject.error.details.length
      && errorObject.error.details[0].message
    ) {
      return errorObject.error.details[0].message;
    }

    if (errorObject.error && errorObject.error.what) {
      return errorObject.error.what;
    }
  }

  return error.message || 'unknown error';
};

export const encodeKey = (...elements: any[]) => {
  const key = JSON.stringify([...elements]);
  const keyTrim = key.substring(1, key.length - 1);
  return Buffer.from(keyTrim).toString('hex');
};

export const decodeKey = (key: string) => JSON.parse(`[${Buffer.from(key, 'hex').toString('utf8')}]`);

export const getPasswordStrength = (password: any) => {
  let passwordStrength = 0;

  const hasUppercase = (value: string) => /[A-Z]/.test(value);
  const hasLowercase = (value: string) => /[a-z]/.test(value);
  const hasNumber = (value: string) => /[0-9]/.test(value);
  const hasSymbol = (value: string) => /[$&+,:;=?@#|'<>.^*()%!-]/.test(value);

  if (password && typeof password === 'string' && password.length >= 6) {
    if (hasLowercase(password)) passwordStrength += 1;
    if (hasUppercase(password)) passwordStrength += 1;
    if (hasNumber(password)) passwordStrength += 1;
    if (hasSymbol(password)) passwordStrength += 1;
  }

  return passwordStrength;
};

export const noop = () => {};

export const eosQrString = (
  account_name: string,
  amount: number,
  token: string
) => `eos:${account_name}?amount=${amount || 0}&token=${token || 'EOS'}`;

export const filterBgColor = (data: string) => {
  if (data && parseFloat(data) > 0) {
    return Colors.bgColor_104_189_57;
  } else if (data && parseFloat(data) < 0) {
    return Colors.bgColor_255_50_50;
  }
};
