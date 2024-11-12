function storeToken(token: string): void {
  localStorage.setItem("authToken", token);
}

function getToken(): string | null {
  return localStorage.getItem("authToken");
}
