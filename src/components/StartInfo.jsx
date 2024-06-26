import React, { useState } from "react";
import Config from "../lang/configDE";


const StartInfo = ({
  visibleQuestions,
  updateVisibleQuestions,
  QuestionToShow,
  imageMobile,
  imageDesktop,
}) => {
  const [finderIsEnabled, setFinderIsEnabled] = useState(false);

  return (
    <div className="bh-finder__startInfo">
      <div className="bh-finder__startInfo-image-wrapper">
        <picture>
          <source media="(min-width: 720PX)" srcSet={`/img/${imageDesktop}`} />
          <source srcSet={`/img/${imageMobile}`} />
          <img src={`/img/${imageMobile}`} alt="hier muss noch was hin" />
        </picture>
        <h1>{Config.title}</h1>
      </div>

      <div className="startInfo__content">
        <h1>{Config.title}</h1>
        <p className="bh-finder__welcomeText">{Config.welcomeText}</p>
        <button
          bhf-ga4-tid="start_button"
          className="bh-finder__start bh-finder__next btn btn-primary-dark"
          onClick={() => {
            if (!visibleQuestions.length) {
              updateVisibleQuestions(QuestionToShow);
              setFinderIsEnabled(true);
            }
          }}
          disabled={finderIsEnabled}
        >
          {Config.startButtonText}
        </button>
      </div>
    </div>
  );
};

export default StartInfo;
