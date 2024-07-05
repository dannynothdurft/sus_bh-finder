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
    <div className="px-4 py-2 bg-[#f9e7eb] flex items-stretch md:justify-end">
      <button
        className="w-full md:w-auto py-2 px-4 rounded shadow bg-[#333] border-[#333] hover:bg-[#999] text-white font-semibold border hover:border-[#999]"
        onClick={onClickEvent}
      >
        {Config.restart}
      </button>
    </div>
  );
};

export default RestartBar;
