export type UserModel = {
  id: string;
  name: string;
  email: string;
  status: string;
  userName: string;
  password: string;
  isActive: boolean;
  configuration: null;
  updateInProgress: boolean;
  createdAt: string;
  updatedAt: string;
  Descriptors: UserDescriptorModel[];
};

export type UserDescriptorModel = {
  id: string;
  isFirstScoring: boolean;
  isFirstMatching: boolean;
  profile: string;
  rating: null;
  status: null;
  clue: string;
  clueAlt: null;
  createdAt: string;
  updatedAt: string;
  DescriptorsUsers: {
    createdAt: string;
    updatedAt: string;
    DescriptorId: string;
    UserId: string;
  };
};
