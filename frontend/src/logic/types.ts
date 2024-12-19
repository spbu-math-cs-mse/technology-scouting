type id = {
  _id: string;
};

export const APPLICATION_STATUSES = [
  "incoming",
  "resources search",
  "resources attached",
  "in work",
  "ended",
  "declined by scout",
  "declined by client",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Application = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: number;
  requestText: string;
  status: ApplicationStatus;
  associatedResources: string[];
};

export type ApplicationWithId = id & Application;

export function toApplication(applicationWithId: ApplicationWithId) {
  const { _id, ...application } = applicationWithId;
  return application;
}

export const DEFAULT_APPLICATION: Application = {
  date: "",
  organization: "",
  contactName: "",
  telegramId: 0,
  requestText: "",
  status: "incoming",
  associatedResources: [],
};

export const RESOURCE_STATUSES = ["in work", "available"] as const;

export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export type Resource = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: number;
  competenceField: string;
  description: string;
  tags: string[];
  status: ResourceStatus;
  associatedApplications: string[];
};

export const DEFAULT_RESOURCE: Resource = {
  date: "",
  organization: "",
  contactName: "",
  telegramId: 0,
  competenceField: "",
  description: "",
  tags: [],
  status: "in work",
  associatedApplications: [],
};

export type ResourceWithId = id & Resource;

export function toResource(resourceWithId: ResourceWithId) {
  const { _id, ...resource } = resourceWithId;
  return resource;
}

export type ApplicationDataTableResponse = {
  applications: ApplicationWithId[];
};

export type ResourceDataTableResponse = {
  resources: ResourceWithId[];
};

export type TokenInfo = {
  value: string;
  expiration: number;
};