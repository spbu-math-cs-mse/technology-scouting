import { UserDataTableResponse, UserMessage } from "./types";

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

// export function getUserDataTableMock(): Promise<UserMessage[]> {
//   return new Promise((resolve, _reject) =>
//     resolve([
//       { telegramId: "1", message: "hi" },
//       { telegramId: "2", message: "ih" },
//       { telegramId: "3", message: "oh" },
//       {
//         telegramId: "4",
//         message:
//           "Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong message",
//       },
//       { telegramId: "1", message: "Same id nnumber 1" },
//       {
//         telegramId: "Loooooooooooooooooooooooooooooooooong id",
//         message: "hello",
//       },
//     ])
//   );
// }
