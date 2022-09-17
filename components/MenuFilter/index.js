import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import styles from './MenuFilter.module.scss';

/**
 * 
 * @param {items, url} props
 * items = [{url, text, icon}]
 * @returns 
 */
const MenuFilter = ({items}) => {
    const router = useRouter();

    const getUrl = () => {
        const url = router.asPath.split('/');
        return url.length > 1 ? `/${url[1]}` : '/';
    }

    const getSelectedClass = ({url}) => url === getUrl() ? ` ${styles.selected} ` : '';

    const renderIcon = item => (
        isEmpty(item.image) ? (
            <i className={`${styles.icon} material-symbols-outlined`}>
                {item.icon}
            </i>
        ) : (
            <Image
                src={item.image.url}
                alt={item.image.name}
                width={28}
                height={28}
                className={`${styles.icon} ${styles.photo}`}
            />
        )
    );
    const renderItems = () => items.map((item, index) => {
        return (
            <li key={index} className={`${styles.item}`}>
                <Link href={item.url}>
                    <a onClick={item?.action} className={`${styles.link}${getSelectedClass(item)}`}>
                        {renderIcon(item)}
                        <span className={styles.text}>{item.text}</span>
                    </a>
                </Link>
            </li>
        );
    });

    return (
        <ul className={styles.menu}>
            {renderItems()}
        </ul>
    );
}

export default MenuFilter;
