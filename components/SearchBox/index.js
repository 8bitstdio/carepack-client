import { useState, useEffect } from "react";
import styles from "./search.module.scss";

const SearchBox = ({ wrapperRef, inputRef, placeholder }) => {
  const [searchResultVisible, setSearchResultVisible] = useState(false);
  const handleSearch = () => {};
  const handleSearchFocus = () => {};
  const showResults = () => {};

  useEffect(() => {
    setSearchResultVisible(false);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.main}>
      <input
        type="text"
        name="q"
        className={styles.input}
        placeholder={placeholder}
        autoComplete="off"
        onChange={handleSearch}
        onFocus={handleSearchFocus}
        ref={inputRef}
      />
      {searchResultVisible && (
        <ul className={styles.result}>
          {showResults()}
          {loading && (
            <li className={styles.loading}>
              <i className={`${styles.icon} material-symbols-outlined`}>sync</i>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
