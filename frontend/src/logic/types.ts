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

export type Resource = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: string;
  competenceField: string;
  description: string;
  tags: string[];
  status: string;
};

export type ResourceWithId = id & Resource;

export type ApplicationDataTableResponse = {
  requests: ApplicationWithId[];
};

export type ResourceDataTableResponse = {
  resources: ResourceWithId[];
};
