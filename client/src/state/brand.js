import {action, createHandler, stateConnector} from 'react-isomorphic-render';
import settings from '../react-isomorphic-render-async';

const handler = createHandler(settings);

export const getBrand = action({
    namespace: 'BRAND',
    event: 'GET_BRAND',
    action: (slug, search, http) =>
        http.get(`/api/brands/${slug}?${search.replace(/^\?/, '')}`),
    result: (state, result) => ({
        ...state,
        brand: result
    })
}, handler);

handler.addStateProperties('brand');

export const connector = stateConnector(handler);

export default handler.reducer({brand: {}});
