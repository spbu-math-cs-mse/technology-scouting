import {
  ApplicationDataTableResponse,
  ApplicationWithId,
  Application,
} from "./types";
import { ResourceDataTableResponse, ResourceWithId, Resource } from "./types";

/** Function to perform login on server.
 * @return created in backend auth token
 */
export async function postLogin(
  username: string,
  password: string
): Promise<string | undefined> {
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login: username, password: password }),
  })
    .then((response) => response.json())
    .then(async (response) => {
      console.log("Get response from server: ", response);
      return response.token;
    })
    .catch((error) => {
      console.error("Got error from server: ", error);
      return undefined;
    });
}

/**
 * Function to retrieve the whole application table from server.
 */
export function getApplicationDataTable(
  authToken: string
): Promise<ApplicationWithId[]> {
  return fetch("/api/applications", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((response: ApplicationDataTableResponse) => {
      console.log("Get response from server: ", response);
      return response.applications;
    })
    .catch((error) => {
      console.error("Got error from server: ", error);
      return [];
    });
}

export function getResourcesDataTable(
  authToken: string
): Promise<ResourceWithId[]> {
  return fetch("/api/resources", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((response: ResourceDataTableResponse) => {
      console.log("Get response from server: ", response);
      return response.resources;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postDeleteApplication(
  authToken: string,
  id: string
): Promise<ApplicationWithId[]> {
  return fetch("/api/delete_application", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ _id: id }),
  })
    .then((response) => response.json())
    .then((response: ApplicationDataTableResponse) => {
      console.log(`Application with ID ${id} deleted successfully.`);
      return response.applications;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postDeleteResource(
  authToken: string,
  id: string
): Promise<ResourceWithId[]> {
  return fetch("/api/delete_resource", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ _id: id }),
  })
    .then((response) => response.json())
    .then((response: ResourceDataTableResponse) => {
      console.log(`Resource with ID ${id} deleted successfully.`);
      return response.resources;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postCreateApplication(
  authToken: string,
  createdApplication: Application
): Promise<ApplicationWithId[]> {
  return fetch("/api/create_application", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(createdApplication),
  })
    .then((response) => response.json())
    .then((response: ApplicationDataTableResponse) => {
      console.log(`New applicataion created successfully.`);
      return response.applications;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postCreateResource(
  authToken: string,
  createdResource: Resource
): Promise<ResourceWithId[]> {
  return fetch("/api/create_resource", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(createdResource),
  })
    .then((response) => response.json())
    .then((response: ResourceDataTableResponse) => {
      console.log(`New resource created successfully.`);
      return response.resources;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postEditApplication(
  authToken: string,
  editedAplication: ApplicationWithId
) {
  return fetch("/api/update_application", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(editedAplication),
  })
    .then((response) => response.json())
    .then((response: ApplicationDataTableResponse) => {
      console.log(
        `Applicataion with ID ${editedAplication._id} edited successfully.`
      );
      return response.applications;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postEditResource(
  authToken: string,
  editedResource: ResourceWithId
) {
  return fetch("/api/update_resource", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(editedResource),
  })
    .then((response) => response.json())
    .then((response: ResourceDataTableResponse) => {
      console.log(
        `Resource with ID ${editedResource._id} editted successfully.`
      );
      return response.resources;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postAddNewAdmin(
  authToken: string,
  login: string,
  password: string
) {
  fetch("/api/add_new_admin", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ login: login, password: password }),
  })
    .then(async (response) => {
      if (response.ok) console.log(`Admin ${login} added successfully.`);
      else return console.error("Failed to add admin: ", response.statusText);
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
    });
}

export function postAssignResources(
  authToken: string,
  applicationId: string,
  resourceIds: string[],
  message: string
): Promise<ApplicationWithId[]> {
  const requestBody = {
    applicationId: applicationId,
    resourceIds: resourceIds,
    message: message,
  };
  return fetch("/api/assign_resources", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((response: ApplicationDataTableResponse) => {
      console.log(
        `Resources added to application with ID ${requestBody.applicationId} successfully.`
      );
      return response.applications;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function getApplicationDataTableMock(): Promise<ApplicationWithId[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      {
        _id: "1",
        date: "20.12.2020",
        organization: "a",
        contactName: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        telegramId: 123,
        requestText: "qweadsfgseh",
        status: "incoming",
        associatedResources: [],
      },
      {
        _id: "2",
        date: "08.04.2024",
        organization: "13e41",
        contactName: "wkjhlti",
        telegramId: 456,
        requestText: "asbw",
        status: "resources search",
        associatedResources: [],
      },
    ])
  );
}

export function getResourcesDataTableMock(): Promise<ResourceWithId[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      {
        _id: "1",
        date: "1",
        organization: "1",
        contactName: "1",
        telegramId: 1,
        competenceField: "1",
        description: "1",
        tags: ["1", "2"],
        status: "in work",
        associatedApplications: [],
      },
      {
        _id: "2",
        date: "1",
        organization: "1",
        contactName: "1",
        telegramId: 2,
        competenceField: "1",
        description: "1",
        tags: ["1", "2"],
        status: "in work",
        associatedApplications: [],
      },
    ])
  );
}
