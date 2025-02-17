import React from "react";
import classes from './SearchBox.module.css';

const SearchBox = ({children}) => {
  return (
    <div className={classes['search-box']}>
      {children}
    </div>
  );
};

export default SearchBox;
