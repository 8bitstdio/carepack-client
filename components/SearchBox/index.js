import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import throttle from "lodash/throttle";
import { getLocalURL } from "utils/urls";

import styles from "./search.module.scss";

const SearchBox = () => {
  const [searchResultVisible, setSearchResultVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchResultVisible(false);
    performSearch("");
  }, []);

  const performSearch = async (query) => {
    const response = await fetch(
      `${getLocalURL()}/api/account/typeahead?query=${query}`
    );
    const { data } = await response.json();
    setSearchResult(data);
    setLoading(false);
  };

  const showResults = () => {
    return searchResult.map((item, index) => (
      <li key={index} className={styles.item}>
        <Link
          href={`/${item.username}`}
          className={styles.link}
          passHref
        >
          <div className={styles.image}>
            <Image
              src={item.cover}
              className={styles.photo}
              fill
              objectFit="cover"
              alt="profile"
            />
          </div>
          <div className={styles.details}>
            <div className={styles.photo_wrap}>
              <Image
                src={item.photo}
                className={styles.photo}
                fill
                alt="profile"
              />
            </div>
            <div className={styles.name}>{item.name}</div>
            {item.isVerified && (
              <div className={styles.verified}>
                <Image
                  src="/images/verify.png"
                  height="16"
                  width="16"
                  className={styles.photo}
                  layout="fixed"
                  alt="profile"
                />
              </div>
            )}
          </div>
        </Link>
      </li>
    ));
  };

  const handleSearch = throttle(
    async (e) => {
      const value = e.target.value;
      if (value.length > 0) {
        setSearchResultVisible(true);

        if (searchResult.length === 0) {
          setLoading(true);
        }
        // perform search.
        performSearch(value);
      } else {
        setSearchResultVisible(false);
      }
    },
    500,
    { leading: false }
  );

  const handleSearchFocus = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setSearchResultVisible(true);
    }
  };

  return (
    <div ref={searchRef} className={styles.searchBox}>
      <input
        type="text"
        name="q"
        className={styles.input}
        placeholder="Search Movies, Shows and more"
        autoComplete="off"
        onChange={handleSearch}
        onFocus={handleSearchFocus}
        ref={inputRef}
      />
      <ul className={styles.result}>
        {showResults()}
        {loading && (
          <li className={styles.loading}>
            <i className={`${styles.icon} material-symbols-outlined`}>sync</i>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SearchBox;
