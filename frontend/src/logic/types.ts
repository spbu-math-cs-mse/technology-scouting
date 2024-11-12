export type UserMessage = {
  telegramId: string;
  message: string;
};

export type RequestMessage = {
  _id: string;
  tg_id: string;
  request_date: string;
  request_type: string;
  request_desciption: string;
  status_id: string;
};

export type ResourceMessage = {
  _id: string;
  tg_id: string;
  resource_name: string;
  resource_description: string;
  resourse_type: string;
  available_quantity: string;
};

export type UserDataTableResponse = {
  messages: UserMessage[];
};

export type RequestDataTableResponse = {
  messages: RequestMessage[];
};

export type ResourceDataTableResponse = {
  messages: ResourceMessage[];
};
