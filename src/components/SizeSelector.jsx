import React, { useState, useEffect, useMemo } from "react";
import SizeCalculator from "./SizeCalculator";
import { scroller } from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import { incrementFilterSize } from "../redux/reducers/filter";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons'


function SizeSelector({
  question,
  isSusSizeType,
  setIsSusSizeType,
  isAnswered,
}) {
  const scrollOptions = {
    duration: 400,
    isDynamic: true,
    smooth: true,
  };
  const dispatch = useDispatch()
  const [showInfo, setShowInfo] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [baseSize, setBaseSize] = useState()
  const [fullsizeList, setFullsizeList] = useState();
  const [sortFull, setSortFull] = useState()

  useEffect(() => {
    if(fullsizeList) {
      fullsizeList.sort((a, b) => {
    // Extrahiere die Zahlenwerte aus sus und vergleiche sie
    let susA = parseInt(a.sus.split(' | ')[1]);
    let susB = parseInt(b.sus.split(' | ')[1]);
    return susA - susB;
  });
  
  setSortFull(fullsizeList)
    }
  }, [fullsizeList])
  
  
  const { sizes } = useSelector((state) => state.sizes);

const groupedData = useMemo(() => {
  const grouped = {};
  for (const [key, value] of Object.entries(sizes)) {
    const firstValue = key.split(' | ')[0];
    if (!grouped[firstValue]) {
      grouped[firstValue] = [];
    }
    grouped[firstValue].push({ key, value });
  }
  return grouped;
}, [sizes]);

  //! baseSize
  const initialFirstValuesList = Object.keys(groupedData).map((firstValue) => {
    return {
        sus: firstValue,
        std: firstValue - 5,
        isSelected: false,
        isActive: false
    };
  });

  const [firstValuesList, setFirstValuesList] = useState(initialFirstValuesList);

  const updateBaseSize = (value) => {
    setFirstValuesList(prevList =>
        prevList.map(item =>
          item.sus === value ? { ...item, isSelected: true, isActive: true } : { ...item, isSelected: false, isActive: false }
        )
    );
    setBaseSize(value)
};

  //! Fullsize
  useEffect(() => {
    if(baseSize) {
         const initialFullsizeList = groupedData[baseSize].map((item) => {
        return {
            sus: item.key,
            std: item.value,
            isSelected: false,
            isActive: false
        };
      });
      setFullsizeList(initialFullsizeList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSize])


      const updateSecondSize = (value) => {
        setFullsizeList(prevList =>
            prevList.map(item =>
              item.sus === value ? { ...item, isSelected: true, isActive: true } : { ...item, isSelected: false, isActive: false }
            )
        );
       dispatch(incrementFilterSize(value))
      };

  return (
    <>
      {showInfo && (
        <div className="bh-finder__sizeInfoTextWrapper">
          <button
            onClick={() => setShowInfo(false)}
            className="bh-finder__closeIcon"
          >
            <FontAwesomeIcon icon={faCircleXmark}/>

          </button>
          <p className="bh-finder__sizeInfoText">
            {question.sizeInfoText(() => {
              setShowCalculator(true);
              scroller.scrollTo(`sizeCalculator-${question.id}`, scrollOptions);
            })}
          </p>
        </div>
      )}
      <div className={`${isAnswered ? 'bh-finder__question--disabled' : ''}`}>
        <p>
          {question.sizeStepText(isSusSizeType)[0]}{" "}
            <FontAwesomeIcon icon={faCircleInfo} className="cursor-pointer"
            onClick={() => setShowInfo(!showInfo)}/>
        </p>
        <ul className="bh-finder__sizeOptionList">
            {firstValuesList.map((item) => {
                const classes = `bh-finder__sizeOption ${
                  item.isSelected ? ' bh-finder__sizeOption--selected' : ''
                } ${item.isActive ? ' bh-finder__sizeOption--active' : ''}`

                return (
                    <li key={item.sus} className={classes} onClick={() => updateBaseSize(item.sus)}
                type={isSusSizeType ? "SUS_SIZE" : "STD_SIZE"}
                bhf-ga4-tid="size"
                bhf-ga4-tse={item.sus}>
                        {isSusSizeType ? item.sus : item.std}
                    </li>
                );
            })}
        </ul>
        {sortFull && (
          <>
            <p className="py-2">
              {question.sizeStepText(isSusSizeType)[1]}{" "}
              <FontAwesomeIcon icon={faCircleInfo} className="cursor-pointer"
            onClick={() => setShowInfo(!showInfo)}/>
            </p>
            <ul className="bh-finder__sizeOptionList">
              {sortFull.map((item) => {
                    const classes = `bh-finder__sizeOption ${
                      item.isSelected ? ' bh-finder__sizeOption--selected' : ''
                    } ${item.isActive ? ' bh-finder__sizeOption--active' : ''} ${
                      item.isSelected && !item.isActive
                        ? ' bh-finder__sizeOption--disabled'
                        : ''
                    }`

                  return (
                    <li
                    key={item.sus}
                    onClick={() => updateSecondSize(item.sus)}
                    className={classes}
                    type={isSusSizeType ? "SUS_SIZE" : "STD_SIZE"}
                    bhf-ga4-tid="size"
                    bhf-ga4-tse={item.sus}
                    >
                        {isSusSizeType ? item.sus : item.std}
                    </li>
                  );
                })}
            </ul>
          </>
        )}
        <button
          className="bh-finder__sizeLink"
          bhf-ga4-tid="size_change"
          type={
            question.sizeTypeButtonText(isSusSizeType) !==
            "Standardgröße wählen"
              ? "sus_size to std_size"
              : "std_size to sus_size"
          }
          onClick={() => setIsSusSizeType(!isSusSizeType)}
        >
          {question.sizeTypeButtonText(isSusSizeType)}
        </button>
        <div id={`sizeCalculator-${question.id}`}>
          <p className="bh-finder__sizeLinkText">
            Du kennst Deine Größe noch nicht?
          </p>
          <button
            className="bh-finder__sizeLink bh-finder__sizeLink--bold"
            bhf-ga4-tid="size_calculator"
            type={
              question.sizeCalculatorText(showCalculator) !==
              "Zum Größenrechner"
                ? "open"
                : "close"
            }
            onClick={() => setShowCalculator(!showCalculator)}
          >
            {question.sizeCalculatorText(showCalculator)}
          </button>
        </div>
        <SizeCalculator
          show={showCalculator}
          setSize={() => {
            setIsSusSizeType(true);
          }}
        />
      </div>
    </>
  );
}

export default SizeSelector;
