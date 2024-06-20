import http from "k6/http";
import { check } from "k6";

const baseURL = "https://reqres.in";
const defaultHeader = { "Content-Type": "application/json" };

export const options = {
  scenarios: {
    create: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "createScenario",
    },
    update: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
      exec: "updateScenario",
    },
  },
};


export function createScenario() {
  const createURL = "/api/users";
  const createPayload = JSON.stringify({
    name: "morpheus",
    job: "leader",
  });

  const postRes = http.post(`${baseURL}${createURL}`, createPayload, {
    headers: defaultHeader,
  });

  // Assertion
  check(postRes, {
    "Response is 201": (postRes) => postRes.status === 201
  });
}

export function updateScenario() {
  const updateURL = "/api/users/2";
  const updatePayload = JSON.stringify({
    name: "morpheus",
    job: "zion resident",
  });

  const putRes = http.put(`${baseURL}${updateURL}`, updatePayload, {
    headers: defaultHeader,
  });

  // Assertion
  check(putRes, {
    "Response is 200": (putRes) => putRes.status === 200
  });
}
