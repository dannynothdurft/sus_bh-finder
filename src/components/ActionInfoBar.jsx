import React from "react";
import Config from "../lang/configDE";

function ActionInfoBar({
  total = 0,
  updateVisibleQuestions,
  visibleQuestions = [],
  hasSelectedSize,
}) {
  if (visibleQuestions.length < 1) return null;

  // check what question to show next
  const nextQuestion = (next, hasSelectedSize) => {
    // if there is no next, show result text on button
    if (!next) return [false, Config.resultsButtonText];

    // if the next question should not be shown, show result button
    if (next?.display && !next.display(hasSelectedSize))
      return [false, Config.resultsButtonText];

    // special case for size button text
    // Todo: move to config file
    let nextText = Config.nextButtonText;
    if (!hasSelectedSize && visibleQuestions.every((item) => item === "size")) {
      nextText = Config.nextButtonTextNoSize;
    }
    return [next.id, nextText];
  };

  const [next, nextText] = nextQuestion(
    Config.questions.find((item) => !visibleQuestions.includes(item.id)),
    hasSelectedSize
  );

  const buttonClasses = `py-2 px-4 rounded shadow bg-[#333] border-[#333] hover:bg-[#999] text-white font-semibold border hover:border-[#999] ${
    !next || visibleQuestions.length === 1 ? "bh-finder__next--right" : ""
  }`;

  return (
    hasSelectedSize ? 
    <div className="p-2 sm:p-4 bg-[#f9e7eb] sticky bottom-0 flex gap-1 flex-wrap justify-end items-center">
      {visibleQuestions.length > 1 && (
        <div className="p-0 sm:p-4 flex items-center justify-start flex-0 flex-none sm:flex-auto sm:border-0 sm:pr-0">
          <span className="inline-block text-4xl">{total}</span>
          <span
            className="inline-block leading-none ml-1"
            dangerouslySetInnerHTML={{ __html: Config.resultsLabel }}
          />
        </div>
      )}
      {next && visibleQuestions.length > 1 && (
        <div className="flex-none flex-grow-0 flex-shrink-0 w-29 mr-5">
          <button
            step={next}
            className="pl-0 leading-none text-base underline text-gray-800 font-semibold"
            onClick={() => updateVisibleQuestions()}
            dangerouslySetInnerHTML={{
              __html: Config.quickResultsButtonText,
            }}
          />
        </div>
      )}
      <button
        className={buttonClasses}
        onClick={() => updateVisibleQuestions(next)}
        dangerouslySetInnerHTML={{
          __html: nextText,
        }}
      />
    </div> : null
  );
}

export default ActionInfoBar;
