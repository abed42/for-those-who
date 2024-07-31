import { createContext } from "react";

type AssistantModalContextType = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
};

export const AssistantModalContext = createContext<AssistantModalContextType>({
  isModalVisible: false,
  setIsModalVisible: () => {},
});
