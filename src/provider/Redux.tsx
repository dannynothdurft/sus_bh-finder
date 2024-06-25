import React, { ReactNode, FC } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

interface ReduxProps {
  children: ReactNode;
}

export const Redux: FC<ReduxProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
