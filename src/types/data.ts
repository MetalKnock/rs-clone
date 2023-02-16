interface IComment {
  userId: number;
  postId: number;
  id: number;
  description: string;
  createdAt: string;
  likes: number;
  likedUserIds?: number[];
}

interface IPost {
  userId: number;
  id: number;
  description: string;
  createdAt: string;
  likes: number;
  likedUserIds?: number[];
  commentsIds?: number[];
}

interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  hidden: boolean;
  country: string;
  birthDate: string;
  createdAt: string;
  alias?: string;
  avatarURL?: string;
  postsIds?: number[];
  friendsIds?: number[];
  pendingFriendsIds?: number[];
}

interface ILogin {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

interface IMessage {
  id: string;
  userId: number;
  description: string;
  createdAt: string;
}

interface IChat {
  id: string;
  userIds: number[];
  createdAt: string;
  messages: IMessage[];
}

export type { IComment, IPost, IUser, ILogin, IMessage, IChat };
