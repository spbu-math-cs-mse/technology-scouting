import { UserDataTableResponse, UserMessage} from "./types";
import {RequestDataTableResponse, RequestMessage } from "./types";
import {ResourceDataTableResponse, ResourceMessage } from "./types";

export function getUserDataTable(): Promise<UserMessage[]> {
  return fetch("/api/user-list", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      console.log("Get response from server: ", response);
      return (response as UserDataTableResponse).messages;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function getRequestDataTable(): Promise<RequestMessage[]> {
  return fetch("http://0.0.0.0:8080/api/requests", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      console.log("Get response from server: ", response);
      return (response as RequestDataTableResponse).messages;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function getResourcesDataTable(): Promise<ResourceMessage[]> {
  return fetch("http://0.0.0.0:8080/api/resources", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      console.log("Get response from server: ", response);
      return (response as ResourceDataTableResponse).messages;
    })
    .catch((error) => {
      console.error("Get error from server: ", error);
      return [];
    });
}

export function getUserDataTableMock(): Promise<UserMessage[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      { telegramId: "1", message: "hi" },
      { telegramId: "2", message: "ih" },
      { telegramId: "3", message: "oh" },
      {
        telegramId: "4",
        message:
          "Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong message",
      },
      { telegramId: "1", message: "Same id nnumber 1" },
      {
        telegramId: "Loooooooooooooooooooooooooooooooooong id",
        message: "hello",
      },
    ])
  );
}


export function getRequestDataTableMock(): Promise<RequestMessage[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      { _id: "1", tg_id: "1", request_date: "21.01.2024", request_type: "get sth", request_desciption: "a lot of", status_id: "in process" },
      { _id: "2", tg_id: "2", request_date: "11.01.2024", request_type: "get sth", request_desciption: "a lot of", status_id: "in process" },
      
    ])
  );
}

export function getResourcesDataTableMock(): Promise<ResourceMessage[]> {
  return new Promise((resolve, _reject) =>
    resolve([
      { _id: "1", tg_id: "1", resource_name: "kids", resource_description: "get sth", resourse_type: "a lot of", available_quantity: "4" },
      { _id: "2", tg_id: "1", resource_name: "parents", resource_description: "teach", resourse_type: "a lot of", available_quantity: "3" },
      
    ])
  );
}
