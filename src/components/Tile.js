import React, { useState } from "react";

function Tile({ product, position }) {
  const isSale = false;
  const [imgSrc, setImgSrc] = useState(product.node.images.nodes[0].url);
  console.log(imgSrc);

  return (
    <div className="productData productData col-xxs col-xs-4 col-sm-3 col-md-3 productBox">
      <div
        className="picture text-center"
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
