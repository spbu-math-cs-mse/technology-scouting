import { useAuth } from "./AuthProvider";
import {
  getApplicationDataTable,
  getResourcesDataTable,
  postAddNewAdmin,
  postAssignResources,
  postCreateApplication,
  postCreateResource,
  postDeleteApplication,
  postDeleteResource,
  postEditApplication,
  postEditResource,
} from "./request";
import {
  Application,
  ApplicationWithId,
  Resource,
  ResourceWithId,
} from "./types";

export default function usePrivateAPI() {
  const { token } = useAuth();
  if (!token)
    throw Error(
      "'usePrivateAPI' only should be used in authenticated components"
    );

  return {
    getApplicationDataTable: () => getApplicationDataTable(token),
    getResourcesDataTable: () => getResourcesDataTable(token),
    postDeleteApplication: (id: string) => postDeleteApplication(token, id),
    postDeleteResource: (id: string) => postDeleteResource(token, id),
    postCreateApplication: (createdApplication: Application) =>
      postCreateApplication(token, createdApplication),
    postCreateResource: (createdResource: Resource) =>
      postCreateResource(token, createdResource),
    postEditApplication: (editedAplication: ApplicationWithId) =>
      postEditApplication(token, editedAplication),
    postEditResource: (editedResource: ResourceWithId) =>
      postEditResource(token, editedResource),
    postAddNewAdmin: (login: string, password: string) =>
      postAddNewAdmin(token, login, password),
    postAssignResources: (
      applicationId: string,
      resourceIds: string[],
      message: string
    ) => postAssignResources(token, applicationId, resourceIds, message),
  };
}
