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
      <div id={question.id} className="w-[50%] tablet:w-[50%]">
        <p className="m-0">{question.aText}</p>
        <ul className="px-0 sm:px-4">
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
