import { useCallback } from "react";
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
    getApplicationDataTable: useCallback(
      () => getApplicationDataTable(token),
      [token]
    ),
    getResourcesDataTable: useCallback(
      () => getResourcesDataTable(token),
      [token]
    ),
    postDeleteApplication: useCallback(
      (id: string) => postDeleteApplication(token, id),
      [token]
    ),
    postDeleteResource: useCallback(
      (id: string) => postDeleteResource(token, id),
      [token]
    ),
    postCreateApplication: useCallback(
      (createdApplication: Application) =>
        postCreateApplication(token, createdApplication),
      [token]
    ),
    postCreateResource: useCallback(
      (createdResource: Resource) => postCreateResource(token, createdResource),
      [token]
    ),
    postEditApplication: useCallback(
      (editedAplication: ApplicationWithId) =>
        postEditApplication(token, editedAplication),
      [token]
    ),
    postEditResource: useCallback(
      (editedResource: ResourceWithId) =>
        postEditResource(token, editedResource),
      [token]
    ),
    postAddNewAdmin: useCallback(
      (login: string, password: string) =>
        postAddNewAdmin(token, login, password),
      [token]
    ),
    postAssignResources: useCallback(
      (applicationId: string, resourceIds: string[], message: string) =>
        postAssignResources(token, applicationId, resourceIds, message),
      [token]
    ),
  };
}
