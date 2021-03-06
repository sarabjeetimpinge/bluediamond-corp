import {action, createHandler, stateConnector} from 'react-isomorphic-render';
import settings from '../react-isomorphic-render-async';

const handler = createHandler(settings);

export const registerCustomer = action({
    namespace: 'AUTH',
    event: 'REGISTER_CUSTOMER',
    action: (creds, http) =>
      http.post('/api/store/customer/register', creds)
      .then((result) => result)
      .catch((err) => err),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const signinCustomer = action({
    namespace: 'AUTH',
    event: 'SIGNIN_CUSTOMER',
    action: (creds, http) =>
      http.post('/api/store/customer/signin', creds)
      .then((result) => result)
      .catch((err) => err),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const resetCustomer = action({
    namespace: 'AUTH',
    event: 'RESET_CUSTOMER',
    action: (data, http) =>
      http.post('/api/store/customer/reset', data)
      .then((result) => result)
      .catch((err) => err),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const recoverCustomerPass = action({
    namespace: 'AUTH',
    event: 'RECOVER_CUSTOMER',
    action: (data, http) =>
      http.post('/api/store/customer/recover', data)
      .then((result) => result)
      .catch((err) => err),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const signoutCustomer = action({
    namespace: 'AUTH',
    event: 'SIGNOUT_CUSTOMER',
    action: (http) => http.get('/api/store/customer/signout'),
    result: (state) => ({
        ...state,
        auth: {}
    })
}, handler);

export const getCustomer = action({
    namespace: 'AUTH',
    event: 'GET_CUSTOMER',
    action: (http) =>
        http.get('/api/store/customer')
        .then((result) => result)
        .catch(() => ({authenticated: false})),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const updateCustomer = action({
    namespace: 'AUTH',
    event: 'UPDATE_CUSTOMER',
    action: (data, http) => http.post('/api/store/customer/update', data),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const createAddress = action({
    namespace: 'AUTH',
    event: 'CREATE_CUSTOMER_ADDRESS',
    action: (data, http) => http.post('/api/store/customer/createAddress', data),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const updateAddress = action({
    namespace: 'AUTH',
    event: 'UPDATE_CUSTOMER_ADDRESS',
    action: (data, http) => http.post(`/api/store/customer/updateAddress/${data.id}`, data),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

export const deleteAddress = action({
    namespace: 'AUTH',
    event: 'DELETE_CUSTOMER_ADDRESS',
    action: (data, http) => http.post(`/api/store/customer/deleteAddress/${data.id}`, data),
    result: (state, result) => ({
        ...state,
        auth: result
    })
}, handler);

handler.addStateProperties('auth');

export const connector = stateConnector(handler);

export default handler.reducer({auth: {}});
