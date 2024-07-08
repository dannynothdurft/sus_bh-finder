import React from "react";
import Selection from "./Selection";
import SizeReview from "./SizeReview";
import Config from "../lang/configDE";

function QuestionReview(props) {
  const { updateSelectedOption, isOneSelected, selectedOptions } = props;

  // TODO add validation for lastSelectedSecondSize
  if (!isOneSelected) return null;
  return (
    <div className="p-2 sm:p-4 bg-[#f7f7f7] border-t border-opacity-30">
      <p className="mb-0 font-bold">{Config.selectionTitle}</p>

      <SizeReview {...props} />

      {Config.questions.map((question) => (
        <Selection
          key={question.id}
          id={question.id}
          question={question}
          selectedOptions={
            selectedOptions.find((item) => item.id === question.id)?.options
          }
          toggleOption={(key, wildcard) =>
            updateSelectedOption(question.id, key, wildcard)
          }
        />
      ))}
    </div>
  );
}

export default QuestionReview;
