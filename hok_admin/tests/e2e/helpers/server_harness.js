/**
 * Server Harness for checking server liveness
 */

export const checkServerLiveness = async (baseUrl = "http://localhost:5000/api") => {
  const url = `${baseUrl.replace(/\/+$/, "")}/auth/status`;
  try {
    const res = await fetch(url, { method: "GET", headers: { "Accept": "application/json" } });
    return {
      alive: true,
      status: res.status,
      url,
    };
  } catch (err) {
    return {
      alive: false,
      error: err.message,
      url,
    };
  }
};
