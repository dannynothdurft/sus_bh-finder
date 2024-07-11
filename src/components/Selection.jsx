import React from "react";
import Option from "./Option";

function Selection({ question, selectedOptions, toggleOption }) {
  const show = selectedOptions.some((item) => item.status === "active");
  let first = false;

  const getOrText = () => {
    if (first) {
      return <span>oder</span>;
    }
    first = true;
  };

  return (
    show && (
      <div id={question.id} className="bh-finder__selectionWrapper bh-finder__selectionWrapper--selection">
        <p className="bh-finder__selectionText">{question.aText}</p>
        <ul className="bh-finder__selection">
          {question.options.map(
            (option) =>
              selectedOptions.find((item) => item.title === option.title)
                ?.status === "active" && (
                <span key={option.title}>
                  {getOrText()}
                  <Option
                    type={question.id}
                    option={option}
                    showImage={false}
                    showText={false}
                    toggleOption={() =>
                      toggleOption(option.title, option.wildcard)
                    }
                    small={true}
                  />
                </span>
              )
          )}
        </ul>
      </div>
    )
  );
}
export default Selection;
