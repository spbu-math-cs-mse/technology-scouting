type id = {
  _id: string;
};

export const APPLICATION_STATUSES =
  ["Incoming",
    "Resources search",
    "Resources attached",
    "In work",
    "Ended",
    "Declined by scout",
    "Declined by client"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Application = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: string;
  requestText: string;
  status: ApplicationStatus;
};

export type ApplicationWithId = id & Application;

export function toApplication(applicationWithId: ApplicationWithId) {
  const { _id, ...application } = applicationWithId;
  return application;
}

export const RESOURCE_STATUSES = ["In work", "Available"] as const;

export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export type Resource = {
  date: string;
  organization: string;
  contactName: string;
  telegramId: string;
  competenceField: string;
  description: string;
  tags: string[];
  status: ResourceStatus;
};

export type ResourceWithId = id & Resource

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
