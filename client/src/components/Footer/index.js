import React, {Component, PropTypes} from 'react';
import {Link} from 'react-isomorphic-render';
import {connect} from 'react-redux';

import slugify from 'tools/slugify';
import styles from './styles.module.css';

import Facebook from 'images/icons/facebook.svg';
import Youtube from 'images/icons/youtube.svg';
import Instagram from 'images/icons/instagram.svg';
import Pinterest from 'images/icons/pinterest.svg';
import Twitter from 'images/icons/twitter.svg';
import Phone from 'images/icons/phone.svg';
import Mail from 'images/icons/mail.svg';
import FooterBG from 'images/backgrounds/wood-footer.jpg';

import {connector as navConnector} from 'state/navigation';

@connect(
    (state) => ({
        ...navConnector(state.navigation)
    })
)
export default class Footer extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            categories: PropTypes.arrayOf(PropTypes.string).isRequired
        })),
        params: PropTypes.object,
        path: PropTypes.string,
        isStorePage: PropTypes.bool
    }

    render() {
        const {data, params, isStorePage, navigation} = this.props;

        const social = {
            facebook: 'https://www.facebook.com/BlueDiamondAlmonds/',
            youtube: 'https://www.youtube.com/user/BlueDiamondGrowers',
            instagram: 'https://www.instagram.com/bluediamond/',
            pinterest: 'https://www.pinterest.com/bluediamond/',
            twitter: 'https://twitter.com/bluediamond'
        };

        if(params && (params.slug === 'almond-breeze' || params.brandSlug === 'almond-breeze')) {
            social.facebook = 'https://www.facebook.com/almondbreeze/';
            social.instagram = 'https://www.instagram.com/almondbreeze/';
            social.pinterest = 'https://www.pinterest.com/almondbreeze/';
            social.twitter = 'https://twitter.com/AlmondBreeze';
        }

        const contact = {
            phone: '(800) 987-2329',
            email: 'support@bdgrowers.com'
        };

        if(isStorePage) {
            contact.phone = '(916) 446-8643';
            contact.email = 'orders@bdgrowers.com';
        }

        return (
            <footer className={`${styles.container}
                    ${navigation && navigation.style && styles[navigation.style.className]}`}>
                <div className={styles.innerContainer}>
                    {isStorePage && (
                        <div className={styles.returnPolicy}>
                            <strong>Our Return Policy: </strong>
                            Return items for up to 30 days after purchase.
                        </div>
                    )}
                    <div className={styles.header}>
                        <div className={styles.social}>
                            <a
                                className={styles.socialLink}
                                href={social.facebook}
                                target="_blank"
                            >
                                <Facebook />
                                <span>Facebook</span>
                            </a>
                            <a
                                className={styles.socialLink}
                                href={social.youtube}
                                target="_blank"
                            >
                                <Youtube />
                                <span>YouTube</span>
                            </a>
                            <a
                                className={styles.socialLink}
                                href={social.instagram}
                                target="_blank"
                            >
                                <Instagram />
                                <span>Instagram</span>
                            </a>
                            <a
                                className={styles.socialLink}
                                href={social.pinterest}
                                target="_blank"
                            >
                                <Pinterest />
                                <span>Pinterest</span>
                            </a>
                            <a
                                className={styles.socialLink}
                                href={social.twitter}
                                target="_blank"
                            >
                                <Twitter />
                                <span>Twitter</span>
                            </a>
                        </div>
                        <div className={styles.contact}>
                            <span><Phone />{contact.phone}</span>
                            <span>
                                <Mail />
                                <a href={`mailto:${contact.email}`}>
                                    {contact.email}
                                </a>
                            </span>
                        </div>
                    </div>
                    <nav className={styles.nav}>
                        <div className={styles.navSection}>
                            {data.sort((a, b) => {
                                if(a.categories.length > b.categories.length) return -1;
                                if(a.categories.length < b.categories.length) return 1;
                                return 0;
                            }).map((brand) => (
                                <div className={styles.navListWrap} key={brand.name}>
                                    <Link to={`/brand/${brand.slug}`}>{brand.name}</Link>
                                    <ul className={styles.navList}>
                                        {brand.categories.map((category) => (
                                            <li key={category}>
                                                <Link to={`/brand/${brand.slug}#category-${
                                                    slugify(category)
                                                }`}>
                                                    {category}
                                                </Link>
                                            </li>
                                        ))}
                                        {brand.name === 'Almond Breeze' && (
                                          <li>
                                            <Link to="/recipes">
                                              Recipes
                                            </Link>
                                          </li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className={styles.navSection}>
                            <div className={styles.navListWrap}>
                                <p className={styles.sectionHeader}>Information</p>
                                <ul className={styles.navList}>
                                    <li>
                                        <Link to="/terms">
                                            Terms of Use
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/privacy">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/press">
                                            Press
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/foodservice">
                                            Foodservice
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/faqs">
                                            FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contact">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.navListWrap}>
                                <p className={styles.sectionHeader}>Company</p>
                                <ul className={styles.navList}>
                                    <li>
                                        <Link to="/craft">
                                            Our Craft
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/history">
                                            Our History
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/manifesto">
                                            Our Story
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="http://bluediamondgrowers.com" target="_blank">
                                            Our Growers
                                        </a>
                                    </li>
                                    <li>
                                        <a href="http://almondinsights.com/" target="_blank">
                                            Almond Insights Blog
                                        </a>
                                    </li>
                                    <li>
                                        <Link to="/product-locator">
                                            Product Locator
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="/store" target="_blank">
                                            Store
                                        </a>
                                    </li>
                                    <li>
                                        <a href="http://careers.bluediamond.com" target="_blank">
                                            Careers
                                        </a>
                                    </li>
                                    <li>
                                        <Link to="/community-giving">
                                            Community Giving
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <div
                    className={styles.copyright}
                    style={{backgroundImage: `url(${FooterBG})`}}
                >
                    <div className="l--container">
                        © {new Date().getFullYear()} Blue Diamond Growers
                    </div>
                </div>
            </footer>
        );
    }
}
