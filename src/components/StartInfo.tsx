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
    <div className="flex flex-wrap bg-[#F7F7F7] md:flex-nowrap">
      <div className="relative w-full md:w-[65%]">
        <picture>
          <source media="(min-width: 720PX)" srcSet={imageDesktop} />
          <source srcSet={imageMobile} />
          <img
            src={imageMobile}
            alt="hier muss noch was hin"
            className="w-full"
          />
        </picture>
        <h1 className="absolute left-0 bottom-0 m-0 w-full text-white text-[39px] bg-[rgba(77,75,80,0.5)] text-center p-2 md:hidden">
          {Config.title}
        </h1>
      </div>

      <div className="w-full p-5 md:w-[35%] md:flex md:flex-col md:justify-center">
        <h1 className="hidden md:inline-block md:text-center mb-4 text-[30px] lg:text-[39px]">
          {Config.title}
        </h1>
        <p className="mb-5 lg:mb-12">{Config.welcomeText}</p>
        <button
          bhf-ga4-tid="start_button"
          className={`rounded shadow ${
            finderIsEnabled
              ? "bg-gray-300 cursor-not-allowed text-gray-600 border-gray-300"
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
