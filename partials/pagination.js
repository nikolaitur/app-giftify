import React, { useState } from 'react';

const Pagination = (props) => {

  const limit = props.limit ? props.limit : 11;
  const [ page, $_page ] = useState(1);
  const page_change = (next = true) => {
    let val = page + (next ? 1 : -1);
    $_page(val);
    props.onPageChange(val);
  };

  return (
    <>
      { (page != 1 || props.items.length == limit) && (
        <div className="pagination">
          <div className="grid vcenter-xs hcenter-xs">
            <a className={ `prev ${ page == 1 ? 'disabled' : '' }` } onClick={ () => {  page_change(false) } }>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.707 17.293L8.414 13 18 13 18 11 8.414 11 12.707 6.707 11.293 5.293 4.586 12 11.293 18.707z"/></svg>
            </a>
            <a className={ `next ${ props.items.length < limit ? 'disabled' : '' }` } onClick={ () => { page_change() } }>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.293 17.293L12.707 18.707 19.414 12 12.707 5.293 11.293 6.707 15.586 11 6 11 6 13 15.586 13z"/></svg>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default Pagination;