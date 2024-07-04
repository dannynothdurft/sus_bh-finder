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

  const buttonClasses = `bh-finder__next  bh-finder__next--stretch bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ${
    !next || visibleQuestions.length === 1 ? "bh-finder__next--right" : ""
  }`;

  return (
    hasSelectedSize ? 
    <div className="bh-finder__actionBar">
      {visibleQuestions.length > 1 && (
        <div className="bh-finder__actionBar--total">
          <span className="bh-finder__resultsCount">{total}</span>
          <span
            className="bh-finder__resultsLabel"
            dangerouslySetInnerHTML={{ __html: Config.resultsLabel }}
          />
        </div>
      )}
      {next && visibleQuestions.length > 1 && (
        <div className="bh-finder__resultLinkWrapper">
          <button
            step={next}
            className="bh-finder__resultLink text-gray-800 font-semibold"
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
