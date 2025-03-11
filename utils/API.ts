export default class API {
  private _devApiUrl: string = "http://192.168.0.41:3000";

  public get apiUrl() {
    return this._devApiUrl;
  }

  private async request(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    token?: string | null,
    isMultipart?: boolean
  ) {
    try {
      const headers: HeadersInit = isMultipart
        ? { Authorization: token ? `Bearer ${token}` : "" }
        : {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          };

      const options: RequestInit = method == "GET" ?  {
        method,
        headers,
      } : {
        method,
        headers,
        body: isMultipart ? (body as BodyInit) : JSON.stringify(body),
      };

      console.log(`Making ${method} request to ${url}`);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log(`Response from ${url}:`, responseJson);
      return responseJson;
    } catch (error) {
      console.error(`Erreur dans la requête ${method} à ${url}:`, error);
      throw error;
    }
  }

  public getData(url: string, token?: string | null) {
    return this.request(url, "GET", null, token);
  }

  public postData(
    url: string,
    body?: any,
    token?: string | null,
    isMultipart?: boolean
  ) {
    return this.request(url, "POST", body, token, isMultipart);
  }

  public putData(
    url: string,
    body?: any,
    token?: string | null,
    isMultipart?: boolean
  ) {
    return this.request(url, "PUT", body, token, isMultipart);
  }

  public deleteData(url: string, token?: string | null, body?: any) {
    return this.request(url, "DELETE", body, token);
  }
}
