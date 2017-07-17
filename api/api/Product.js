import axios from 'axios';

export default (api, {contentful}) => {
    const getProduct = (apiParams, slug) =>
        axios.get(
            `${apiParams.base}/spaces/${contentful.spaceId}/entries?` +
            `fields.slug=${slug}&` +
            `access_token=${apiParams.token}&content_type=product`
        )
        .then((response) => response.data);

    const getSmartLabel = (smartLabelId) =>
        axios.get(`https://smartlabel-api.labelinsight.com/api/v3/${smartLabelId}`)
        .then((response) => response.data)
        .catch((err) => {
            console.trace(err);
            return 'No Smart Label data found';
        });

    api.get('/product/:slug', async (req, res) => {
        try {
            const product = await getProduct(req.apiParams, req.params.slug);

            if(product.items.length) {
                const smartLabelId = product.items[0].fields.smartLabel;
                const smartLabel = await getSmartLabel(smartLabelId);
                const amend = typeof smartLabel === 'string'
                    ? {error: smartLabel}
                    : smartLabel;

                product.items[0].fields.smartLabel = {id: smartLabelId, ...amend};

                res.cache(true).send(product);
            } else {
                res.status(404).send({ok: false, error: 'not found'});
            }
        } catch (err) {
            console.trace(err);
            res.status(500).send(err.message);
        }
    });
};
