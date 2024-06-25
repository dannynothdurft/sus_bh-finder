import React, { useState } from "react";
import Config from "../lang/configDE";

function Tile({ product, position, currencySign }) {
  const isSale = product.fields.oxtprice > product.fields.oxprice;
  const [imgSrc, setImgSrc] = useState(
    `${Config.productImgBasePath(1)}${product.fields.oxpic1}`
  );

  return (
    <div className="productData productData col-xxs col-xs-4 col-sm-3 col-md-3 productBox">
      <div
        className="picture text-center"
        onMouseOver={() =>
          setImgSrc(`${Config.productImgBasePath(2)}${product.fields.oxpic2}`)
        }
        onMouseOut={() =>
          setImgSrc(`${Config.productImgBasePath(1)}${product.fields.oxpic1}`)
        }
      >
        <a
          href={`/${product.fields["makaira-product"].url}?selecttype=bhf3`}
          className="productData__link"
          title={product.fields.title}
          target="_blank"
          rel="noreferrer noopener"
        >
          <div className="picture-wrapper">
            {isSale && <div className="isSale">SALE</div>}
            <img
              alt={product.fields.title}
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
            href={`/${product.fields["makaira-product"].url}?selecttype=bhf3`}
            className="title"
            title={product.fields.title}
          >
            <span className="product" product={product.fields.title}>
              {product.fields.title}
            </span>
          </a>
        </div>

        <div className="SusTyp">{product.fields.marmsustyp}</div>
        <div className="price text-center bh-finder-price">
          <div className="content">
            {isSale && (
              <span className="oldPrice sb_pink">
                <del>
                  {String(product.fields.oxtprice.toFixed(2)).replace(
                    /\./g,
                    ","
                  )}{" "}
                  {currencySign}
                </del>{" "}
              </span>
            )}
            <span className="lead text-nowrap">
              {String(product.fields.oxprice.toFixed(2)).replace(/\./g, ",")}{" "}
              {currencySign}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tile;
