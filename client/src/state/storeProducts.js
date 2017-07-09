import {action, createHandler, stateConnector} from 'react-isomorphic-render';
import env from 'tools/env';
import settings from '../react-isomorphic-render-async';

const handler = createHandler(settings);

export const getStoreProducts = action({
    namespace: 'STORE',
    event: 'GET_PRODUCTS',
    action: (http) =>
        http.get(`/api/store/products${env.development ? `?${Date.now()}` : ''}`)
        .then((result) => result)
        .catch((err) => console.log(err)),
    result: (state, result) => ({
        ...state,
        products: result
    })
}, handler);

handler.addStateProperties('products');

export const connector = stateConnector(handler);

export default handler.reducer({products: {}});
