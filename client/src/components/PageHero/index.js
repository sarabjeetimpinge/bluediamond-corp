import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import marked from 'marked';
import classnames from 'classnames';

import Button from '../Button';

import PlayIcon from 'images/icons/play.svg';

import styles from './styles.module.css';

@connect(
    (state) => ({
        responsive: state.responsive
    })
)
export default class PageHero extends Component {
    state = {
        videoOpen: false
    };

    static propTypes = {
        headline: PropTypes.string.isRequired,
        showHeadline: PropTypes.bool.isRequired,
        content: PropTypes.string,
        buttonText: PropTypes.string,
        buttonLink: PropTypes.string,
        backgroundImage: PropTypes.string,
        video: PropTypes.string,
        backgroundVideo: PropTypes.bool,
        playVideo: PropTypes.bool,
        classNames: PropTypes.object
    }

    // Toggler video player visabiity,
    // auto play video when open, pause when closed.
    toggleVideoPlayer = (e) => {
        e.preventDefault();

        this.setState({
            videoOpen: !this.state.videoOpen
        });

        return this.state.videoOpen ? this.video.pause() : this.video.play();
    }

    // Render video player
    renderVideoPlayer() {
        const file = this.props.video;

        return (
            <div className={styles.videoWrap}>
                <video
                    ref={(video) => {
                        this.video = video;
                    }}
                    onClick={this.toggleVideoPlayer}
                    className={styles.videoPlayer}
                    controls
                >
                    <source src={file} />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    // Parse markdown content
    renderMarkup(field) {
        return {__html: marked(field)};
    }

    // If background image, render it as the background image,
    // or load background video object.
    renderBackground() {
        const {
            video,
            backgroundImage,
            backgroundImageTablet,
            backgroundImageMobile,
            backgroundVideo,
            content,
            showHeadline,
            playVideo,
            responsive
        } = this.props;

        let image = backgroundImage;
        if(responsive.xsmall && backgroundImageMobile)
            image = backgroundImageMobile;
        else if(responsive.small && backgroundImageTablet)
            image = backgroundImageTablet;

        const style = {
            backgroundImage: `url(${!backgroundVideo && image})`
        };

        return (
            <div className={classnames(styles.background,
                (!content && !showHeadline && !video && !playVideo) ? styles.onlyImage : ''
            )} style={style}>
                {backgroundVideo &&
                    <video autoPlay loop muted>
                        <source src={video} />
                        Your browser does not support the video tag.
                    </video>
                }
            </div>
        );
    }

    render() {
        const {
            headline,
            showHeadline,
            content,
            buttonLink,
            buttonText,
            video,
            playVideo,
            classNames
        } = this.props;

        const {videoOpen} = this.state;

        let action;

        if(video && playVideo) {
            action = (
                <div className={styles.playIcon}>
                    <a href="#" onClick={this.toggleVideoPlayer}>
                        <PlayIcon /> {buttonText}
                    </a>
                </div>
            );
        } else if(buttonLink) {
            action = (
                <Button href={buttonLink}>{buttonText}</Button>
            );
        }

        return (
            <div className={classnames(
                styles.container,
                videoOpen ? styles.videoOpen : '',
                video ? styles.hasVideo : '',
                classNames ? classNames.container : ''
            )}>
                <div className={classnames(
                    styles.innerContainer,
                    video ? styles.hasVideo : '',
                    classNames ? classNames.innerContainer : ''
                )}>
                    {showHeadline && <h1>{headline}</h1>}
                    {content &&
                        <div
                            className={classnames(
                                styles.content,
                                classNames ? classNames.content : ''
                            )}
                            dangerouslySetInnerHTML={this.renderMarkup(content)}
                        />
                    }
                    {action}
                </div>
                {this.renderBackground()}
                {(video && playVideo) && this.renderVideoPlayer()}
            </div>
        );
    }
}
