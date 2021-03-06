import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {preload} from 'react-isomorphic-render';
import Helmet from 'react-helmet';

import {connector as brandConnector, getBrand} from 'state/brand';
import {
    connector as navConnector,
    setNavigationStyle
} from 'state/navigation';

import Title from 'components/Title';
import Meta from 'components/Meta';
import Button from 'components/Button';
import BrandCategory from 'components/BrandCategory';
import CardPanel from 'components/CardPanel';
import Carousel from 'components/Carousel';
import Hero from './Hero';
import Story from './Story';
import sortByPriority from 'tools/sortByPriority';
import styles from './styles.module.css';

@preload(async ({dispatch, parameters, location}) => {
    const brand = await dispatch(getBrand(parameters.slug, location.search));
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
        setNavigationStyle
    }
)
export default class Brand extends Component {
    static propTypes = {
        brand: PropTypes.shape({
            fields: PropTypes.shape({
                name: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
                metaKeywords: PropTypes.array,
                metaDescription: PropTypes.string,
                themeColor: PropTypes.string,
                themeType: PropTypes.string,
                logo: PropTypes.shape({
                    sys: PropTypes.shape({
                        id: PropTypes.string
                    })
                }),
                heroImage: PropTypes.shape({
                    sys: PropTypes.shape({
                        id: PropTypes.string.isRequired
                    })
                }),
                mobileHeroImage: PropTypes.shape({
                    sys: PropTypes.shape({
                        id: PropTypes.string.isRequired
                    })
                }),
                heroTagline: PropTypes.string,
                video: PropTypes.string,
                videoAutoplay: PropTypes.bool,
                videoShowControls: PropTypes.bool,
                videoMute: PropTypes.bool,
                videoLoop: PropTypes.bool,
                stories: PropTypes.arrayOf(PropTypes.shape({
                    sys: PropTypes.shape({
                        id: PropTypes.string.isRequired
                    })
                })),
                categories: PropTypes.arrayOf(PropTypes.shape({
                    sys: PropTypes.shape({
                        id: PropTypes.string.isRequired
                    })
                })),
                recipePanel: PropTypes.shape({
                    sys: PropTypes.shape({
                        id: PropTypes.string.isRequired
                    })
                })
            })
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            videoPlaying: false
        };
    }

    componentWillMount() {
        const {brand} = this.props;

        this.props.setNavigationStyle({
            className: `brand--${brand.fields.themeColor}`
        });
    }

    componentDidMount() {
        if(location.hash) {
            setTimeout(() => {
                const posTop = document.querySelector(
                    `#${location.hash.replace(/^#/, '')}`
                ).offsetTop;
                window.scrollTo(0, posTop);
            }, 500);
        }
    }

    componentWillUpdate(nextProps) {
        const {brand} = this.props;

        if(!nextProps.navigation.style.className) {
            this.props.setNavigationStyle({
                className: `brand--${brand.fields.themeColor}`
            });
        }
    }

    componentWillUnmount() {
        this.props.setNavigationStyle({});
    }

    videoStarted = () => {
        this.setState({
            videoPlaying: true
        });
    }

    videoStopped = () => {
        this.setState({
            videoPlaying: false
        });
    }

    render() {
        const {brand, responsive} = this.props;

        const heroImage = (responsive.small && brand.fields.mobileHeroImage)
                            ? brand.fields.mobileHeroImage
                            : brand.fields.heroImage;

        const textureBg = brand.fields.backgroundTexture ? {
            backgroundImage: `url(${brand.fields.backgroundTexture.fields.file.url})`,
            backgroundSize: `${
                brand.fields.backgroundTexture.fields.file.details.image.width / 2
            }px`
        } : null;

        return (
            <section className="content">
                <Title>{brand.fields.name}</Title>
                <Meta>{[
                    {
                        property: 'og:title',
                        content: brand.fields.name
                    },
                    {
                        property: 'og:description',
                        content: brand.fields.metaDescription
                    },
                    {
                        property: 'og:image',
                        content: heroImage.fields.file.url
                    },
                    {
                        name: 'description',
                        content: brand.fields.metaDescription
                    },
                    {
                        name: 'keywords',
                        content: brand.fields.metaKeywords && brand.fields.metaKeywords.join(',')
                    }
                ]}</Meta>
                <Helmet>
                    <link rel="canonical" href={`https://www.bluediamond.com${this.props.location.pathname}`} />
                </Helmet>
                <Hero
                    image={heroImage.fields.file.url}
                    title={brand.fields.heroTitle}
                    textColor={brand.fields.heroTextColor}
                    logo={brand.fields.logo ? brand.fields.logo.fields.file.url : null}
                    mobileLogo={
                        brand.fields.mobileLogo
                        ? brand.fields.mobileLogo.fields.file.url
                        : null
                    }
                    logoPosition={brand.fields.logoPosition}
                    tagline={brand.fields.heroTagline}
                    flavorLine={brand.fields.heroFlavorLine}
                    brand={brand.fields.slug}
                    video={brand.fields.video}
                    videoAutoplay={brand.fields.videoAutoplay || false}
                    videoShowControls={brand.fields.videoShowControls || false}
                    videoMute={brand.fields.videoMute || false}
                    videoLoop={brand.fields.videoLoop || false}
                />
                {brand.fields.stories && (
                    <Carousel
                        id="stories"
                        classNames={{container: styles.carousel}}
                        showArrows
                        showTabs
                        autoplay={responsive.large || responsive.xlarge}
                        videoPlaying={this.state.videoPlaying}
                        arrowColor={
                            brand.fields.themeType === 'dark'
                                ? brand.fields.themeColor
                                : 'light'
                            }
                        tabColor={
                            brand.fields.themeType === 'dark'
                                ? brand.fields.themeColor
                                : 'light'
                            }
                        settings={{
                            viewsToShow: 1,
                            infinite: true
                        }}
                        cards={brand.fields.stories.map((story) => (
                            <Story
                                link={story.fields.link}
                                desktopImage={story.fields.backgroundImage.fields.file.url}
                                smallDesktopImage={
                                    story.fields.smallDesktopBackgroundImage.fields.file.url
                                }
                                tabletImage={story.fields.tabletBackgroundImage.fields.file.url}
                                mobileImage={story.fields.mobileBackgroundImage.fields.file.url}
                                video={story.fields.video}
                                videoAutoplay={story.fields.videoAutoplay}
                                videoShowControls={story.fields.videoShowControls}
                                videoMute={story.fields.videoMute}
                                videoStarted={this.videoStarted}
                                videoStopped={this.videoStopped}
                            />
                        ))}
                        name={`${brand.fields.name} - Stories Carousel`}
                    />
                )}
                <div style={textureBg} className={styles[brand.fields.themeType]}>
                    {brand.fields.categories
                        .filter((category) => !category.fields.hidden)
                        .map((category) => (
                            <BrandCategory
                                key={category.sys.id}
                                theme={brand.fields.themeType}
                                products={
                                    brand.fields.products.filter((product) =>
                                        product.fields.brandCategory === category.fields.name
                                    ).sort(sortByPriority)
                                }
                                {...category.fields}
                            />
                        ))
                    }
                </div>
                {brand.fields.flavors && (
                    <CardPanel
                        type="brandFlavor"
                        title={brand.fields.waysToUseTitle || `Ways to use ${brand.fields.name}`}
                        cards={brand.fields.flavors}
                        theme={`${brand.fields.themeType}Category`}
                        color={brand.fields.themeColor}
                    />
                )}
                {brand.fields.waysToUse && (
                    <CardPanel
                        type="instagram"
                        title={brand.fields.waysToUseTitle || `Ways to use ${brand.fields.name}`}
                        cards={brand.fields.waysToUse}
                    />
                )}
                {brand.fields.brandRecipesImage && (
                    <div className={styles.hero} style={{
                        backgroundImage: `url(${brand.fields.brandRecipesImage.fields.file.url})`
                    }}>
                        <div>
                            <h2>Try Our Delicious Recipes</h2>
                            <Button href="/recipes" theme="blueLight">
                                Click Here
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        );
    }
}
