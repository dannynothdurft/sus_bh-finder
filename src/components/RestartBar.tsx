import { FC } from "react";
import Config from "../lang/configDE";

interface RestartBarProps {
  resetFinder: () => void;
}

const RestartBar: FC<RestartBarProps> = ({ resetFinder }) => {
  const onClickEvent = () => {
    resetFinder();
  };
  return (
    <div className="bh-finder__restartBar">
      <button
        className="bh-finder__next button button--primary"
        onClick={onClickEvent}
      >
        {Config.restart}
      </button>
    </div>
  );
};

export default RestartBar;
