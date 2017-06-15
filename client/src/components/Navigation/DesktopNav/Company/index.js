import React, {PropTypes} from 'react';
import {Link} from 'react-isomorphic-render';

import Tile from 'components/Navigation/Tile';
import styles from './styles.module.css';

const Company = ({navData, companyNavTiles, toggleNav}) => (
    <div className={styles.container}>
        <ul className={styles.tiles}>
            {companyNavTiles.map((navTile) => (
                <Tile key={navTile.sys.id}>
                    <p>{navTile.fields.headline}</p>
                    <Link to={`/${navTile.fields.linkUrl}`} onClick={toggleNav.hide}>
                        <h2>{navTile.fields.title}</h2>
                    </Link>
                </Tile>
            ))}
        </ul>
        <ul className={styles.companyLinks}>
            {navData.primary.companyLinks.map((link) => {
                let child = <Link to={link.slug} onClick={toggleNav.hide}>{link.name}</Link>;

                if(link.external)
                    child = <a href={link.slug} target="_blank">{link.name}</a>;

                return (
                    <li className={styles.companyLink} key={link.slug}>
                        {child}
                    </li>
                );
            })}
        </ul>
    </div>
);

Company.propTypes = {
    navData: PropTypes.object.isRequired,
    companyNavTiles: PropTypes.array.isRequired,
    toggleNav: PropTypes.object.isRequired
};

export default Company;