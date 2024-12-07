import { getToken, storeToken } from "./authToken";
import {
  ApplicationDataTableResponse,
  ApplicationWithId,
} from "./types";
import {
  ResourceDataTableResponse,
  ResourceWithId,
} from "./types";

// Function to perform login and store token
export async function postLogin(username: string, password: string): Promise<boolean> {
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
      storeToken(response.token);
      return true;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return false;
    });
}

export function getApplicationDataTable(): Promise<ApplicationWithId[]> {
  return fetch("/api/applications", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      console.log("Get response from server: ", response);
      return (response as ApplicationDataTableResponse).applications;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function getResourcesDataTable(): Promise<ResourceWithId[]> {
  return fetch("/api/resources", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      console.log("Get response from server: ", response);
      return (response as ResourceDataTableResponse).resources;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function postDeleteApplication(id: string) {
  fetch("/api/delete_application", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ "_id": id }),
  })
    .then(async (response) => {
      if (response.ok)
        console.log(`Application with ID ${id} deleted successfully.`);
      else
        return console.error(
          "Failed to delete application",
          response.statusText
        );
    })
    .catch((error) => {
      console.error(error);
      return {
        error: error,
      };
    });
}

export function postDeleteResource(id: string) {
  fetch("/api/delete_resource", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ "_id": id }),
  })
    .then(async (response) => {
      if (response.ok)
        console.log(`Resource with ID ${id} deleted successfully.`);
      else
        return console.error("Failed to delete resource", response.statusText);
    })
    .catch((error) => {
      console.error(error);
      return {
        error: error,
      };
    });
}

export function postEditApplication(editedAplication: ApplicationWithId) {
  fetch("/api/update_application", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(editedAplication),
  })
    .then(async (response) => {
      if (response.ok)
        console.log(`Applicataion with ID ${editedAplication._id} edited successfully.`);
      else return console.error("Failed to edit request", response.statusText);
    })
    .catch((error) => {
      console.error(error);
      return {
        error: error,
      };
    });
}

export function postEditResource(editedResource: ResourceWithId) {
  fetch("/api/update_resource", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(editedResource),
  })
    .then(async (response) => {
      if (response.ok)
        console.log(`Resource with ID ${editedResource._id} editted successfully.`);
      else return console.error("Failed to edit request", response.statusText);
    })
    .catch((error) => {
      console.error(error);
      return {
        error: error,
      };
    });
}

export function postAddNewAdmin(login: string, password: string) {
  fetch("/api/add_new_admin", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ login: login, password: password }),
  })
    .then(async (response) => {
      await response.json();
      if (response.ok)
        console.log(`Admin ${login} added successfully.`);
      else return console.error("Failed to edit request", response.statusText);
    })
    .catch((error) => {
      console.error(error);
      return {
        error: error,
      };
    });
}

export function postAssignResources(applicationId: string, resourceIds: string[], message: string) {
  // TODO
}

export function getApplicationDataTableMock(): Promise<ApplicationWithId[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      {
        _id: "1",
        date: "20.12.2020",
        organization: "a",
        contactName: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        telegramId: "@abs",
        requestText: "qweadsfgseh",
        status: "Incoming",
      },
      {
        _id: "2",
        date: "08.04.2024",
        organization: "13e41",
        contactName: "wkjhlkb",
        telegramId: "@gui",
        requestText: "asbw",
        status: "Resources search",
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
        telegramId: "1",
        competenceField: "1",
        description: "1",
        tags: ["1", "2"],
        status: "In work",
      },
      {
        _id: "2",
        date: "1",
        organization: "1",
        contactName: "1",
        telegramId: "1",
        competenceField: "1",
        description: "1",
        tags: ["1", "2"],
        status: "In work",
      },
    ])
  );
}
