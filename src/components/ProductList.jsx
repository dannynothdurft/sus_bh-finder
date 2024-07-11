import Tile from "./Tile";
import AnimateHeight from "react-animate-height";

function ProductList({ products }) {
  return products ? (
    <AnimateHeight duration={200} height={"auto"}>
      <ul className="boxwrapper bh-finder__productListBoxWrapper clearfix">
        <div className="list-container">
          <div className="gridView">
            {products.map((item, index) => (
              <Tile key={item.node.id} product={item} position={index + 1} />
            ))}
          </div>
        </div>
      </ul>
    </AnimateHeight>
  ) : null;
}

export default ProductList;
