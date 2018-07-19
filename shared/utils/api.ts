import {
  BITPORTAL_API_REST_URL,
  BITPORTAL_API_CMS_URL,
  CURRENCY_RATE_URL
} from 'constants/env';
import storage from 'utils/storage';
import { isMobile } from 'utils/platform';

if (!isMobile) require('isomorphic-fetch');

export const fetchBase = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = options.baseUrl || BITPORTAL_API_REST_URL;
  const headers = options.headers || {};
  const auth = options.auth;

  let url = baseUrl + endPoint;

  if (!headers.Accept) headers.Accept = 'application/json';
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = await storage.getItem('bitportal_t');
    const authorization = token && `Bearer ${token}`;
    headers.Authorization = authorization || null;
  }

  const fetchOptions: any = { method, headers };

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params)
      .map(k => [k, params[k]].map(encodeURIComponent).join('='))
      .join('&')}`;
    if (queryString) url += `?${queryString}`;
  } else if (method === 'POST' || method === 'PUT') {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      fetchOptions.body = `${Object.keys(params)
        .map(k => [k, params[k]].join('='))
        .join('&')}`;
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type'];
      const formData = new FormData();
      Object.keys(params).forEach(key => formData.append(key, params[key]));
      fetchOptions.body = formData;
    } else {
      fetchOptions.body = JSON.stringify(params);
    }
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      return res
        .json()
        .then((e: any) => Promise.reject({ message: e.error_msg }));
    }

    const contentType = res.headers.get('content-type');

    if (/json/.test(contentType)) {
      return res.json();
    }

    return null;
  });
};

const cmsFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) => fetchBase(method, endPoint, params, {
  ...options,
  baseUrl: BITPORTAL_API_CMS_URL
});

export const sendSMS = (params: SendSMSParams) => fetchBase('POST', '/auth/sms', params);
export const sendEmail = (params: SendEmailParams) => fetchBase('POST', '/auth/email', params);
export const smsLogin = (params: SMSLoginParams) => fetchBase('POST', '/auth/smslogin', params);
export const login = () => fetchBase('POST', '/auth/login');
export const emailCallback = (params: EmailCallbackParams) => fetchBase('GET', `/auth/email/callback/${params.id}`);
export const generateTwoFactor = () => fetchBase('GET', '/auth/two-factor');
export const getUserById = (params: UserIdParams) => fetchBase('GET', `/user/${params.id}`);
export const getUserByToken = () => fetchBase('GET', '/user/getUserByToken');
export const createUser = (params: CreateUserParams) => fetchBase('POST', '/user', params);
export const updateUser = (params: UserIdParams) => fetchBase('PUT', `/user/${params.id}`, params);
export const deleteUser = (params: UserIdParams) => fetchBase('DELETE', `/user/${params.id}`, params);
export const bindUserTwoFactor = (params: BindUserTwoFactorParams) => fetchBase('DELETE', `/user/two-factor/${params.id}`, params);
export const getTickers = (params?: TickerParams) => fetchBase('GET', '/tickers', params);
export const getChart = (params?: ChartParams) => fetchBase('GET', '/chart', params);

export const getCurrencyRate = () => fetchBase('GET', '', {}, { baseUrl: CURRENCY_RATE_URL });

export const getNewsList = (params: any) => cmsFetchBase('GET', '/article', params);
export const getNewsBanner = () => cmsFetchBase('GET', '/banner');
export const getVersionInfo = () => cmsFetchBase('GET', '/system');
export const getProducersInfo = (params: any) => cmsFetchBase('GET', '/eosbp', params);
