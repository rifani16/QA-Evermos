import http from "k6/http";
import { check, sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
const baseURL = "https://reqres.in";
const defaultHeader = { "Content-Type": "application/json" };

export const options = {
  vus: 1000,
  iterations: 3500,
  duration: "30s",
  thresholds: {
    http_req_duration: ["max < 2000"], // Response API Max 2s
    http_req_failed: ["rate < 0.01"], // 1% error rate
  },
};

export default function (postRes, putRes) {
  group("createScenario", function () {
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
      "Response is 201": (postRes) => postRes.status === 201,
    });
  });

  sleep(2);

  group("updateScenario", function () {
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
      "Response is 200": (putRes) => putRes.status === 200,
    });
  });
}

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}