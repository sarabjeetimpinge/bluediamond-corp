import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {preload, redirect, pushLocation} from 'react-isomorphic-render';
import {withRouter} from 'react-router';

import {connector as brandConnector, getBrand} from 'state/brand';
import {
    connector as navConnector,
    setNavigationStyle
} from 'state/navigation';

import Title from 'components/Title';
import Meta from 'components/Meta';
import CardPanel from 'components/CardPanel';
import Hero from './Hero';
import ProductSection from './ProductSection';
import MoreFlavorsDesktop from './MoreFlavorsDesktop';
import MoreFlavorsMobile from './MoreFlavorsMobile';
import MoreProducts from './MoreProducts';
import sortByPriority from 'tools/sortByPriority';
import styles from './styles.module.css';

@preload(async ({dispatch, parameters}) => {
    const brand = await dispatch(getBrand(parameters.brandSlug));
    await dispatch(setNavigationStyle({
        className: `brand--${brand.fields.themeColor}`
    }));
})
@connect(
    (state) => ({
        responsive: state.responsive,
        ...brandConnector(state.brand),
        ...navConnector(state.navigation)
    }),
    {
        getBrand,
        setNavigationStyle,
        redirect
    }
)
@withRouter
export default class BrandCategory extends Component {
    static propTypes = {
        brand: PropTypes.shape({
            fields: PropTypes.shape({
                name: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
                themeColor: PropTypes.string,
                logo: PropTypes.shape({
                    file: PropTypes.shape({
                        url: PropTypes.string.isRequired
                    })
                }),
                heroImage: PropTypes.shape({
                    file: PropTypes.shape({
                        url: PropTypes.string.isRequired
                    })
                }),
                heroTagline: PropTypes.string.isRequired,
                stories: PropTypes.array,
                categories: PropTypes.array,
                recipePanel: PropTypes.object,
                products: PropTypes.array
            })
        })
    }

    constructor(props) {
        super(props);

        const {categories, products} = this.props.brand.fields;
        let activeProduct = [];
        let categoryProducts = [];

        const category = categories.filter((cat) =>
            cat.fields.slug === this.props.params.categorySlug
        )[0];

        if(category) {
            categoryProducts = products.filter((product) =>
                product.fields.brandCategory === category.fields.name
            ).sort(sortByPriority);
        }

        if(categoryProducts) {
            const {productSlug} = this.props.params;
            activeProduct = this.getActiveProduct(productSlug, categoryProducts);
        }

        this.state = {
            activeProduct,
            category,
            categoryProducts
        };
    }

    componentWillMount() {
        const {brand} = this.props;

        this.props.setNavigationStyle({
            className: `brand--${brand.fields.themeColor}`
        });
    }

    getActiveProduct = (productSlug, categoryProducts) => {
        let activeProduct = categoryProducts[0];

        if(productSlug) {
            activeProduct = categoryProducts.filter((product) =>
                product.fields.slug === productSlug
            )[0];
        }

        return activeProduct;
    }

    setActiveProduct = (activeProduct) => {
        this.setState(() => ({activeProduct}), () => {
            const pathname =
                '/brand' +
                `/${activeProduct.fields.brand.split(' ').join('-').toLowerCase()}` +
                `/${activeProduct.fields.brandCategory.split(' ').join('-').toLowerCase()}` +
                `/${activeProduct.fields.slug}`;

            pushLocation({pathname}, this.props.router);
        });
    }

    componentWillUpdate(nextProps) {
        const {brand, params} = this.props;

        if(!nextProps.navigation.style.className) {
            this.props.setNavigationStyle({
                className: `brand--${brand.fields.themeColor}`
            });
        }

        if(nextProps.params.productSlug !== params.productSlug) {
            this.setActiveProduct(
                this.getActiveProduct(nextProps.params.productSlug, this.state.categoryProducts)
            );
        }
    }

    componentWillUnmount() {
        this.props.setNavigationStyle({});
    }

    render() {
        const {activeProduct, category, categoryProducts} = this.state;
        const {brand, responsive, redirect} = this.props; // eslint-disable-line no-shadow

        if(!activeProduct && category && categoryProducts || !category) {
            redirect('/404');
            return (<div />);
        }

        let otherBrandCategories = [];
        if(category) {
            otherBrandCategories = brand.fields.categories.filter((cat) =>
                cat.fields.name !== category.fields.name
            ).slice(0, 3);
        }

        let moreProducts = [];
        if(activeProduct) {
            moreProducts = brand.fields.moreProducts.filter((product) =>
                activeProduct.fields.name !== product.fields.name
            ).slice(0, 6);
        }

        const shopLinks = [
            {
                slug: activeProduct.fields.shopifyLink || '/store',
                name: 'Blue Diamond Store'
            }
        ];

        if(activeProduct.fields.otherStoreLinks) {
            activeProduct.fields.otherStoreLinks.forEach((link) => {
                const name = link.match(/https?:\/\/(?:www\.)?([^\/]+)\//i)[1];

                shopLinks.push({
                    slug: link,
                    name: `${name[0].toUpperCase()}${name.slice(1)}`,
                    external: true
                });
            });
        }

        return (
            <section className={styles.content}>
                <Title>{
                    `${activeProduct.fields.name} | ${category.fields.name} | ${brand.fields.name}`
                }</Title>
                <Meta>{[
                    {
                        property: 'og:title',
                        content:
                            `${activeProduct.fields.name} - ` +
                            `${category.fields.name} - ${brand.fields.name}`
                    },
                    {
                        property: 'og:description',
                        content: activeProduct.fields.description
                    },
                    {
                        property: 'og:image',
                        content: activeProduct.fields.productPhotos[0].fields.file.url
                    }
                ]}</Meta>
                <Hero
                    brand={brand}
                    category={category}
                    product={activeProduct}
                    shopLinks={shopLinks}
                />
                <div
                    className={styles.background}
                    style={{
                        backgroundImage: `url(${brand.fields.backgroundTexture.fields.file.url})`
                    }}
                >
                    <div className={styles.accents}>
                        <div className={`${styles.accent} ${styles.accentLeft}`}>
                            <img
                                src={category.fields.appetizerImages[0].fields.file.url}
                                alt="Accent Image"
                            />
                        </div>
                        <div className={`${styles.accent} ${styles.accentRight}`}>
                            <img
                                src={category.fields.appetizerImages[1].fields.file.url}
                                alt="Accent Image"
                            />
                        </div>
                    </div>
                    <ProductSection
                        brand={brand}
                        category={category}
                        products={categoryProducts}
                        activeProduct={activeProduct}
                        setActiveProduct={this.setActiveProduct}
                        shopLinks={shopLinks}
                    />
                    {!responsive.small && <MoreFlavorsDesktop
                        brand={brand}
                        otherCategories={otherBrandCategories}
                    />}
                    {responsive.small && <MoreFlavorsMobile
                        brand={brand}
                        otherCategories={otherBrandCategories}
                    />}
                    <MoreProducts products={moreProducts} />
                </div>
                {brand.fields.waysToUse && (
                    <CardPanel
                        type="instagram"
                        title={`Ways to use ${brand.fields.name}`}
                        cards={brand.fields.waysToUse}
                    />
                )}
                {brand.fields.recipes && (
                    <CardPanel
                        type="recipes"
                        title="Try out these delicious recipes:"
                        theme={brand.fields.themeColor}
                        cards={brand.fields.recipes}
                    />
                )}
            </section>
        );
    }
}
