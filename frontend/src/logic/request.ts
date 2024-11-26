import { getToken, storeToken } from "./authToken";
import {
  ApplicationDataTableResponse,
  ApplicationMessage,
  ApplicationMessageWithId,
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

export function getApplicationDataTable(): Promise<ApplicationMessageWithId[]> {
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
/*export function getRequestDataTableMock(): Promise<ApplicationMessageWithId[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      {
        _id: "1",
        tg_id: "1",
        request_type: "get sth",
        request_desciption: "a lot of",
        status_id: "in process",
      },
      {
        _id: "2",
        tg_id: "2",
        request_type: "get sth",
        request_desciption: "a lot of",
        status_id: "in process",
      },
    ])
  );
}

export function getResourcesDataTableMock(): Promise<ResourceMessage[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      {
        _id: "1",
        tg_id: "1",
        resource_name: "kids",
        resource_description: "get sth",
        resource_type: "a lot of",
        available_quantity: "4",
      },
      {
        _id: "2",
        tg_id: "1",
        resource_name: "parents",
        resource_description: "teach",
        resource_type: "a lot of",
        available_quantity: "3",
      },
    ])
  );
}*/
