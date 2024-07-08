import React from "react";
import { useSelector } from "react-redux";

function SizeReview({
  isSusSizeType = false,
  hasSelectedSizes,
}) {
  const { filterSize } = useSelector((state) => state.filter);
  
  if (!hasSelectedSizes) return null;


  return (
    <div className="w-full tablet:w-[100%]">
      <p className="bh-finder__selectionText">
        {isSusSizeType ? `SugarShape Größe:` : `Standardgröße:`}
      </p>
      <ul className="px-0 sm:px-4">
              
                <li
                  className="bh-finder__option max-h-12 inline-flex items-center justify-center gap-1"
                >
                  <i className="fa fa-times" />{" "}
                  {filterSize}
                </li>
      </ul>
    </div>
  );
}

export default SizeReview
