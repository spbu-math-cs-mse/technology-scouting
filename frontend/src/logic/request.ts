import { UserDataTableResponse, UserMessage } from "./types";

export function getUserDataTable(): Promise<UserMessage[]> {
  return fetch("http://127.0.0.1:8080/api/user-list", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  }).then(
    async (response) =>
      ((await response.json()) as UserDataTableResponse).messages
  );
}

export function getUserDataTableMock(): Promise<UserMessage[]> {
  return new Promise((resolve, _reject) => resolve([
    {telegramId : "1", message: "hi"},
    {telegramId : "2", message: "ih"},
    {telegramId : "3", message: "oh"},
    {telegramId : "4", message: "Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong message"},
    {telegramId : "1", message: "Same id nnumber 1"},
    {telegramId : "Loooooooooooooooooooooooooooooooooong id", message: "hello"},
  ]))
}