import React from "react";
import Tile from "./Tile";
import AnimateHeight from "react-animate-height";
import Config from "../lang/configDE";

function ProductList({ products, paginate, currentPage, total }) {
  const pageCount = Math.ceil(total / Config.pageSize);

  return products ? (
    <AnimateHeight duration={200} height={"auto"}>
      <ul className="ml--15 mr--15 p-0 boxwrapper clearfix">
        <div className="list-none">
          <div className="my-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {products.map((item, index) => (
              <Tile key={item.node.id} product={item} position={index + 1} />
            ))}
          </div>
        </div>
      </ul>
      {pageCount > currentPage && (
        <div className="flex text-center items-center justify-center">
          <button
            className="flex text-center text-2xl mt-[-6px] bg-[#4d4b50] p-4 w-[2em] h-[2em] rounded-full text-white border-none transition-colors duration-300 hover:bg-[#e08699]"
            onClick={() => paginate(currentPage + 1)}
          >
            <i className="fa fa-plus flex items-center justify-center w-full h-full" />
          </button>
        </div>
      )}
    </AnimateHeight>
  ) : null;
}

export default ProductList;
