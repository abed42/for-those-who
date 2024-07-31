import { ActionType } from "@/constants/ActionType";
import { createContext } from "react";

type AssistantArticleContextType = {
  article: any;
  setArticle: (article: any) => void;
  threadId: string;
  setThreadId: (threadId: string) => void;
  actionType?: ActionType;
  setActionType: (action: ActionType) => void;
};

export const AssistantArticleContext =
  createContext<AssistantArticleContextType>({
    article: {},
    setArticle: () => {},
    threadId: "",
    setThreadId: () => {},
    setActionType: () => {},
  });
