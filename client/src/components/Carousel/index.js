import React, {Component, PropTypes} from 'react';
import {ViewPager, Frame, Track, View} from 'react-view-pager';
import ReactAnimationFrame from 'react-animation-frame';
import classnames from 'classnames';

import ArrowLeft from 'images/icons/arrow-left.svg';
import ArrowRight from 'images/icons/arrow-right.svg';
import styles from './styles.module.css';

class Carousel extends Component {
    static propTypes = {
        cards: PropTypes.array.isRequired,
        settings: PropTypes.object,
        id: PropTypes.string,
        classNames: PropTypes.object,
        containerClass: PropTypes.string,
        cardClasses: PropTypes.object,
        showOverlay: PropTypes.bool,
        showArrow: PropTypes.bool,
        showTabs: PropTypes.bool,
        tabColor: PropTypes.string,
        onViewChange: PropTypes.func,
        name: PropTypes.string,
        autoplay: PropTypes.bool,
        autoplayInterval: PropTypes.number,
        videoPlaying: PropTypes.bool
    }

    static defaultProps = {
        settings: {
            viewsToShow: 1,
            infinite: true
        },
        classNames: {},
        showOverlay: false,
        showArrows: false,
        showTabs: false,
        tabColor: 'dark',
        autoplay: false,
        autoplayInterval: 6000
    }

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: props.activeIndex || 0,
            playing: props.autoplay && false
        };
    }

    onAnimationFrame() {
        if(this.carouselTrack && this.props.autoplay)
            this.carouselTrack.next();
    }

    handleSwipe = (currentIndices) => {
        this.setState(() => ({
            activeIndex: currentIndices[0]
        }), () => {
            if(this.props.onViewChange)
                this.props.onViewChange(currentIndices[0]);
        });

        if(this.props.name && window && window.dataLayer) {
            window.dataLayer.push({
                event: 'interaction',
                action: 'swipe',
                label: this.props.name
            });
        }
    }

    prev = () => {
        const {autoplay} = this.props;

        if(autoplay)
            this.props.endAnimation();

        this.carouselTrack.prev();

        if(this.props.name && window && window.dataLayer) {
            window.dataLayer.push({
                event: 'interaction',
                action: 'click',
                label: this.props.name
            });
        }

        if(autoplay)
            this.props.startAnimation();
    }

    next = () => {
        const {autoplay} = this.props;

        if(autoplay)
            this.props.endAnimation();

        this.carouselTrack.next();

        if(this.props.name && window && window.dataLayer) {
            window.dataLayer.push({
                event: 'interaction',
                action: 'click',
                label: this.props.name
            });
        }

        if(autoplay)
            this.props.startAnimation();
    }

    getOverlayStyle = () => {
        const {activeIndex} = this.state;
        const {classNames} = this.props;

        if(!classNames.overlay) {
            if(activeIndex === 0) {
                return {
                    backgroundImage:
                        `linear-gradient(
                            to left,
                            rgba(255, 255, 255, 1) 0%,
                            rgba(255, 255, 255, 0) 10%
                        )`
                };
            }

            return {
                backgroundImage:
                    `linear-gradient(
                        to right,
                        rgba(255, 255, 255, 1) 0%,
                        rgba(255, 255, 255, 0) 10%
                    )`
            };
        }
    }

    renderArrow = () => {
        const {activeIndex} = this.state;
        const {cards, settings} = this.props;
        const arrows = [];
        const tabs = cards.map((card, idx) => idx)
            .filter((card, idx) => idx % settings.viewsToShow === 0);

        if(activeIndex > tabs[0] || settings.infinite) {
            arrows.push(
                <ArrowLeft
                    key="arrowLeft"
                    className={styles.prev}
                    onClick={this.prev}
                />
            );
        }

        if(activeIndex < tabs[tabs.length - 1] || settings.infinite) {
            arrows.push(
                <ArrowRight
                    key="arrowRight"
                    className={styles.next}
                    onClick={this.next}
                />
            );
        }

        return arrows;
    }

    renderTabs = () => {
        const {activeIndex} = this.state;
        const {cards, settings, tabColor} = this.props;
        const tabs = cards.map((card, idx) => idx)
            .filter((card, idx) => idx % settings.viewsToShow === 0);

        if(tabs.length === 1)
            return null;

        return (
            <div className={`${styles.tabs} ${styles[tabColor]}`}>
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        className={classnames(styles.tab, {
                            [styles.tabActive]: activeIndex === tab
                        })}
                    />
                ))}
            </div>
        );
    }

    startAutoplay = () => {
        const {autoplay} = this.props;

        if(autoplay && !this.props.videoPlaying) {
            this.props.startAnimation();
            this.setState({
                playing: true
            });
        }
    }

    stopAutoplay = () => {
        const {playing} = this.state;

        if(playing || this.props.videoPlaying) {
            this.props.endAnimation();
            this.setState({
                playing: false
            });
        }
    }

    toggleAutoplay = () => {
        const {playing} = this.state;

        if(playing || this.props.videoPlaying)
            return this.stopAutoplay();

        return this.startAutoplay();
    }

    componentDidMount() {
        this.startAutoplay();
    }

    componentWillUnmount() {
        this.stopAutoplay();
    }

    render() {
        const {cards, settings, classNames, showOverlay, showArrows, showTabs, id} = this.props;

        const pages = cards.map((card, idx) => idx)
            .filter((card, idx) => idx % settings.viewsToShow === 0);

        return (
            <div id={id}>
                <ViewPager
                    className={classNames.container}
                >
                    <Frame>
                        <Track
                            className={classNames.track}
                            onViewChange={this.handleSwipe}
                            style={{display: 'flex'}}
                            ref={(track) => {
                                this.carouselTrack = track;
                            }}
                            {...settings}
                        >
                            {cards.map((card, idx) => (
                                <View
                                    className={classNames.view}
                                    style={{flex: '1'}}
                                    key={`card-${idx}`}
                                    onClick={this.stopAutoplay}
                                    onMouseEnter={this.toggleAutoplay}
                                    onMouseOut={this.toggleAutoplay}
                                >
                                    {card}
                                </View>
                            ))}
                        </Track>
                    </Frame>
                    {showOverlay && pages.length > 1 ? (
                        <div
                            className={classnames(styles.overlay, classNames.overlay)}
                            style={this.getOverlayStyle()}
                        />
                    ) : null}
                    {showArrows && this.renderArrow()}
                    {showTabs && this.renderTabs()}
                </ViewPager>
            </div>
        );
    }
}

export default ReactAnimationFrame(Carousel, 6000);
