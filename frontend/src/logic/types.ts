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

export function toApplication (applicationWithId: ApplicationWithId) {
  const {_id, ...application} = applicationWithId;
  return application;
}

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

export type ResourceWithId = id & Resource

export function toResource (resourceWithId: ResourceWithId) {
  const {_id, ...resource} = resourceWithId;
  return resource;
}

export type ApplicationDataTableResponse = {
  applications: ApplicationWithId[];
};

export type ResourceDataTableResponse = {
  resources: ResourceWithId[];
};
