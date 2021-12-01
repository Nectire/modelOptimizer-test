
const URL = 'http://localhost:3000';

export function makeRequest(method = "GET", params, body, headers) {
  const query = params.searchParam ? `?${params.searchParam.toString()}` : '';

  return fetch(`${URL}/${params.path + query}`, {
    method,
    body,
  }).then((res) => res.json());
}