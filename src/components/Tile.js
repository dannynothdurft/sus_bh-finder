import React, { useState } from "react";

function Tile({ product, position }) {
  const isSale = false;
  const [imgSrc, setImgSrc] = useState(product.node.images.nodes[0].url);

  return (
    <div className="mb-2.5 px-2 productBox min-w-[140px]">
      <div
        className="block w-full mb-1.25"
        onMouseOver={() => setImgSrc(product.node.images.nodes[1].url)}
        onMouseOut={() => setImgSrc(product.node.images.nodes[0].url)}
      >
        <a
          href={`https://stage-sugarshape.myshopify.com/products/${product.node.handle}`}
          className="productData__link"
          title={product.node.title}
          target="_blank"
          rel="noreferrer noopener"
        >
          <div className="block w-full h-auto max-h-full m-0 p-0 overflow-hidden">
            {isSale && <div className="isSale">SALE</div>}
            <img
              alt={product.node.title}
              className="m-auto top-0 left-0 min-w-full min-h-full border-0 object-cover object-center"
              src={imgSrc}
              position={position}
            />
          </div>
        </a>
      </div>

      <div className="listDetails text-center">
        <div className="title">
          <a
            href={`https://stage-sugarshape.myshopify.com/products/${product.node.handle}`}
            className="title"
            title={product.node.title}
          >
            <span className="product" product={product.node.title}>
              {product.node.title}
            </span>
          </a>
        </div>

        <div className="SusTyp">{product.node.type}</div>
        <div className="price text-center bh-finder-price">
          <div className="content">
            {isSale && (
              <span className="oldPrice sb_pink">
                <del>
                  {String(product.node.priceRange.minVariantPrice.amount)}
                  {product.node.priceRange.minVariantPrice.currencyCode}
                </del>{" "}
              </span>
            )}
            <span className="lead text-nowrap">
              {String(product.node.priceRange.minVariantPrice.amount)}
              {product.node.priceRange.minVariantPrice.currencyCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tile;
