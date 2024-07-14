type ArticleExtendedModel = {
  id: string;
  isDisplayed: boolean;
  displayedTM: null;
  isOpened: boolean;
  openedTM: null;
  isLiked: boolean;
  likedTM: null;
  comments: null;
  createdAt: string;
  updatedAt: string;
  UserId: string;
  ArticleId: string;
  Article: ArticleModel;
};

type ArticleModel = {
  id: string;
  content: string;
  isSample: null;
  link: string;
  providerId: null;
  publishedOn: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceId: string;
  Source: SourceModel;
};

type SourceModel = {
  id: string;
  name: string;
  sourceId: string;
  isFirstScoring: boolean;
  isFirstMatching: boolean;
  createdAt: string;
  updatedAt: string;
};
