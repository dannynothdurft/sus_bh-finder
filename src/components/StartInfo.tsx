import { FC, useState, useEffect } from "react";
import Config from "../lang/configDE";
import { useSelector } from "react-redux";

interface StartInfoProps {
  visibleQuestions: string[];
  updateVisibleQuestions: (questions: string) => void;
  QuestionToShow: string;
  imageMobile: string;
  imageDesktop: string;
}

const StartInfo: FC<StartInfoProps> = ({
  visibleQuestions,
  updateVisibleQuestions,
  QuestionToShow,
  imageMobile,
  imageDesktop,
}) => {
  const { sizes } = useSelector((state: any) => state.sizes);

  const [finderIsEnabled, setFinderIsEnabled] = useState(true);

  useEffect(() => {
    if (sizes) {
      setFinderIsEnabled(false);
    }
  }, [sizes]);

  return (
    <div className="bh-finder__startInfo">
      <div className="bh-finder__startInfo-image-wrapper">
        <picture>
          <source media="(min-width: 720PX)" srcSet={imageDesktop} />
          <source srcSet={imageMobile} />
          <img src={imageMobile} alt="BH-Finder Start Bild" />
        </picture>
        <h1>{Config.title}</h1>
      </div>

      <div className="startInfo__content">
        <h1>{Config.title}</h1>
        <p className="bh-finder__welcomeText">{Config.welcomeText}</p>
        <button
          bhf-ga4-tid="start_button"
          className={`bh-finder__next rounded shadow ${
            finderIsEnabled
              ? "button button--secondary"
              : "button button--primary"
          }`}
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
