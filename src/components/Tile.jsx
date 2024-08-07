import React, { useState } from "react";

function Tile({product, position }) {
  const isSale = false;
  const [imgSrc, setImgSrc] = useState(product.node.images.nodes[0].url);


  const findValueByKey = (array, searchKey, searchValue, returnKey) => {
    for (const obj of array) {
      if (obj && obj[searchKey] === searchValue) {
        return obj[returnKey];
      }
    }
    return null;
  };
  
  const SUSTYPE = findValueByKey(product.node.metafields, 'key', 'sugarshapetype', 'value');


  return (
    <div>
      <div
        className="text-center"
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
          <div className="picture-wrapper">
            {isSale && <div className="isSale">SALE</div>}
            <img
              alt={product.node.title}
              className="img-responsive img-lazy"
              src={imgSrc}
              position={position}
            />
          </div>
        </a>
      </div>

      <div className="listDetails">
        <div>
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

        <div className="SusTyp">{SUSTYPE}</div>

        <div className="price text-center bh-finder-price">
          <div className="content">
            {isSale && (
              <span className="oldPrice sb_pink">
                <del>
                  {String(product.node.priceRange.minVariantPrice.amount)}{" "}
                  { product.node.priceRange.minVariantPrice.currencyCode === "EUR" ? "€" : product.node.priceRange.minVariantPrice.currencyCode }
                </del>
              </span>
            )}
            <span className="lead text-nowrap">
              {String(product.node.priceRange.minVariantPrice.amount)}{" "}
              { product.node.priceRange.minVariantPrice.currencyCode === "EUR" ? "€" : product.node.priceRange.minVariantPrice.currencyCode }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tile;
