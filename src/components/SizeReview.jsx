import React from "react";
import { useSelector } from "react-redux";

function SizeReview({
  isSusSizeType = false,
  hasSelectedSizes,
}) {
  const { filterSize } = useSelector((state) => state.filter);
  
  if (!hasSelectedSizes) return null;


  return (
    <div className="bh-finder__selectionWrapper bh-finder__selectionWrapper--size">
      <p className="bh-finder__selectionText">
        {isSusSizeType ? `SugarShape Größe:` : `Standardgröße:`}
      </p>
      <ul className="bh-finder__selection">
              
                <li
                  className="bh-finder__option bh-finder__option--small"
                >
                  <i className="fa fa-times" />{" "}
                  {filterSize}
                </li>
      </ul>
    </div>
  );
}

export default SizeReview

// {/* <div className="bh-finder__selectionWrapper bh-finder__selectionWrapper--size">
//       <p className="bh-finder__selectionText">
//         {isSusSizeType ? `SugarShape Größe:` : `Standardgröße:`}
//       </p>
//       <ul className="bh-finder__selection">
//         {sizeConfigurations.map((configuration, configurationIndex) => {
//           const { baseSize, secondSizes } = configuration;

//           return secondSizes.map((size) => {
//             return (
//               <span key={`${baseSize}-${size}`}>
//                 <li
//                   onClick={() => {
//                     resetSizeConfig(configurationIndex, size);
//                   }}
//                   className="bh-finder__option bh-finder__option--small"
//                 >
//                   <i className="fa fa-times" />{" "}
//                   {isSusSizeType ? `${baseSize}/${size}` : `${baseSize}${size}`}
//                 </li>
//               </span>
//             );
//           });
//         })}
//       </ul>
//     </div> */}