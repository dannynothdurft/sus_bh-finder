import React, { useState, useEffect } from "react";
import Option from "./Option";
import AnimateHeight from "react-animate-height";
import SizeSelector from "./SizeSelector";
import sortQuestionFilters from "../utils/sortQuestionFilters";
import addCountsToOptions from "../utils/addCountsToOptions";

function Question(props) {
  const {
    question,
    selectedOptions,
    toggleOption,
    step,
    totalSteps,
    isVisible,
    results,
    isAnswered = false,
    changeConfiguration,
  } = props;

  const [options, setOptions] = useState(question.options);

  useEffect(() => {
    if (!isAnswered) {
      const sortedOptions = sortQuestionFilters(
        question,
        results?.aggregations
      );
      setOptions(addCountsToOptions(sortedOptions, results?.aggregations));
    }
  }, [question, results, isVisible, isAnswered]);

  if (!isVisible) return null;

  const isWildCartActive = selectedOptions.some(
    (option) => option.wildcard && "active" === option.status
  );

  return (
    <AnimateHeight
      duration={0}
      height={"auto"}
    >
      <div id={question.id} className={`bh-finder__questionWrapper`}>
        {step !== 1 && (
          <div className="trenner trenner_cms bh-finder__trenner">
            <span>
              <i className="fa fa-heart" />
            </span>
          </div>
        )}

        {step <= totalSteps && (
          <span className="bh-finder__indicator">{`${step} von ${totalSteps}`}</span>
        )}
        {question.preText && (
          <div
            className="bh-finder__questionText"
            dangerouslySetInnerHTML={{ __html: question.preText }}
          />
        )}
        <p
          className="bh-finder__questionText bh-finder__questionText--bold"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        {question.infoText && (
          <div
            className="bh-finder__questionText mb-2"
            dangerouslySetInnerHTML={{ __html: question.infoText }}
          />
        )}
        {question.optionsType === "size" ? (
          <SizeSelector
          //startSizes={sizes} 
          {...props} isAnswered={isAnswered} />
        ) : (
          <ul
            className={`bh-finder__question ${
              isAnswered ? "bh-finder__question--disabled" : ""
            }`}
          >
            {options.map((option) => {
              const optionStatus = selectedOptions.find(
                (item) => item.title === option.title
              )?.status;

              return (
                <Option
                  key={option.title}
                  question={question.id}
                  option={option}
                  toggleOption={() =>
                    toggleOption(option.title, option.wildcard)
                  }
                  isSelected={optionStatus === "active"}
                  optionStatus={optionStatus}
                  isWildCartActive={isWildCartActive}
                  small={option.small}
                />
              );
            })}
          </ul>
        )}
        {isAnswered && (
          <div className="bh-finder__question-edit">
            <button
              className="btn btn-primary-dark"
              onClick={() => changeConfiguration(question.id)}
            >
              Auswahl ändern
            </button>
          </div>
        )}
      </div>
    </AnimateHeight>
  );
}
export default Question;
