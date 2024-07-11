import React from "react";
import Selection from "./Selection";
import SizeReview from "./SizeReview";
import Config from "../lang/configDE";
import { useSelector } from "react-redux";

function QuestionReview(props) {
  const { updateSelectedOption, selectedOptions } = props;
  const { filterSize } = useSelector((state) => state.filter);

  if (!filterSize) return null;

  return (
    <div className="bh-finder__deselectFilterWrapper">
      <p className="bh-finder__deselectFilterTitle">{Config.selectionTitle}</p>
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
