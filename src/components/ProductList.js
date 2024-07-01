import React from "react";
import Tile from "./Tile";
import AnimateHeight from "react-animate-height";
import Config from "../lang/configDE";

function ProductList({ products, paginate, currentPage, total, currencySign }) {
  const pageCount = Math.ceil(total / Config.pageSize);

  return products ? (
    <AnimateHeight duration={200} height={"auto"}>
      <ul className="boxwrapper bh-finder__productListBoxWrapper clearfix">
        <div className="list-container ">
          <div className="gridView">
            {products.map((item, index) => (
              <Tile key={item.node.id} product={item} position={index + 1} />
            ))}
          </div>
        </div>
      </ul>
      {pageCount > currentPage && (
        <div className="bh-finder__moreButtonWrapper">
          <button
            className="bh-finder__moreButton"
            onClick={() => paginate(currentPage + 1)}
          >
            <i className="fa fa-plus" />
          </button>
        </div>
      )}
    </AnimateHeight>
  ) : null;
}

export default ProductList;
