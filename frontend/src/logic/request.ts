import { getToken, storeToken } from "./authToken";
import {
  ApplicationDataTableResponse,
  Application,
  ApplicationWithId,
} from "./types";
import {
  ResourceDataTableResponse,
  ResourceMessage,
  ResourceMessageWithId,
} from "./types";

// Function to perform login and store token
async function login(username: string, password: string): Promise<boolean> {
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  if (result.success && result.token) {
    storeToken(result.token); // Store token instead of password
    return true;
  } else {
    console.error(result.message || "Login failed");
    return false;
  }
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
      return (response as ApplicationDataTableResponse).requests;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function getResourcesDataTable(): Promise<ResourceMessageWithId[]> {
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
    },
    body: JSON.stringify({ id }),
  })
    .then(async (response) => {
      await response.json();
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
    },
    body: JSON.stringify({ id }),
  })
    .then(async (response) => {
      await response.json();
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

export function postEditApplication(id: string, new_status: string) {
  fetch("/api/update_application", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id, new_status }),
  })
    .then(async (response) => {
      await response.json();
      if (response.ok)
        console.log(`Request with ID ${id} editted successfully.`);
      else return console.error("Failed to edit request", response.statusText);
    })
    .catch((error) => {
      console.error(error);
      return {
        error: error,
      };
    });
}
//лень переисывать
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
        status: "123",
      },
      {
        _id: "2",
        date: "08.04.2024",
        organization: "13e41",
        contactName: "wkjhlkb",
        telegramId: "@gui",
        requestText: "asbw",
        status: "98706123",
      },
    ])
  );
}

export function getResourcesDataTableMock(): Promise<ResourceMessageWithId[]> {
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
        status: "in progress",
      },
      {
        _id: "1",
        date: "1",
        organization: "1",
        contactName: "1",
        telegramId: "1",
        competenceField: "1",
        description: "1",
        tags: ["1", "2"],
        status: "in progress",
      },
    ])
  );
}
