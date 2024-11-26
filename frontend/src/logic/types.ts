export type id = {
  _id: string;
};
export type ApplicationMessage = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: string;
  requestText: string;
  status: string;
};

export type ApplicationMessageWithId = id & ApplicationMessage;

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
  requests: ApplicationMessageWithId[];
};

export type ResourceDataTableResponse = {
  resources: ResourceMessageWithId[];
};
