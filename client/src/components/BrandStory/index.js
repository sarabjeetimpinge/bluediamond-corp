import React, {PropTypes} from 'react';
import styles from './styles.module.css';

const flexAlign = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end'
};

const BrandStory = ({image, tagline, content, align}) => (
    <div
        className={styles.container}
        style={{
            backgroundImage: `url(${image})`,
            alignItems: flexAlign[align.toLowerCase()]
        }}
    >
        <div className={styles.innerContainer}>
            <h2>{tagline}</h2>
            <p className="t--type-prose">{content}</p>
        </div>
    </div>
);

BrandStory.propTypes = {
    image: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    align: PropTypes.string.isRequired
};

export default BrandStory;