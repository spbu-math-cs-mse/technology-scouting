export type UserMessage = {
  telegramId: string;
  message: string;
};

export type UserDataTableResponse = {
  messages: UserMessage[];
};
