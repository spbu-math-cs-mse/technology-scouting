export type id = {
  _id: string;
};
export type Application = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: string;
  requestText: string;
  status: string;
};

export type ApplicationWithId = id & Application;

export type ResourceMessage = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: string;
  competenceField: string;
  description: string;
  tags: string[];
  status: string;
};

export type ResourceMessageWithId = id & ResourceMessage;

export type ApplicationDataTableResponse = {
  requests: ApplicationWithId[];
};

export type ResourceDataTableResponse = {
  resources: ResourceMessageWithId[];
};
