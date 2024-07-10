import { useState, useEffect } from "react";
import Option from "./Option";
import AnimateHeight from "react-animate-height";
import SizeSelector from "./SizeSelector";
import sortQuestionFilters from "../utils/sortQuestionFilters";
import addCountsToOptions from "../utils/addCountsToOptions";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons'

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
      <div id={question.id} className="mx-auto p-2.5 bg-[#f7f7f7] pb-10">
        {step !== 1 && (
          <div className="relative border-t border-solid border-black border-opacity-30 mb-5">
            <span className="absolute top-[-10px] bg-[#F7F7F7] px-2" style={{ right: 'calc(50% - 6px)' }}>
              <FontAwesomeIcon icon={faHeart} style={{ color: '#CFCFCF', fontSize: "1.3rem" }}/>
            </span>
          </div>
        )}

        {step <= totalSteps && (
          <span className="text-white bg-[#4d4b50] rounded-[2px] py-1 px-2 text-[0.8em]">{`${step} von ${totalSteps}`}</span>
        )}
        {question.preText && (
          <div
            className="text-[1em] mt-2"
            dangerouslySetInnerHTML={{ __html: question.preText }}
          />
        )}
        <p
          className="text-[1em] mt-2 font-bold"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        {question.infoText && (
          <div
            className="text-[1em] mt-2"
            dangerouslySetInnerHTML={{ __html: question.infoText }}
          />
        )}
        {question.optionsType === "size" ? (
          <SizeSelector
          {...props} isAnswered={isAnswered} />
        ) : (
          <ul
          className="mt-3 grid grid-cols-1 mm-sm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
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
          <div className="text-right">
            <button
              className="button button--primary"
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
