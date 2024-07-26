import { createContext } from "react";

type AssistantArticleContextType = {
  article: any;
  setArticle: (article: any) => void;
  threadId: string;
  setThreadId: (threadId: string) => void;
};

export const AssistantArticleContext =
  createContext<AssistantArticleContextType>({
    article: {},
    setArticle: () => {},
    threadId: "",
    setThreadId: () => {},
  });
