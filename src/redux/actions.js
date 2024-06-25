export const setUser = (name, role) => ({
  type: "SET_USER",
  payload: { name, role },
});

export const setPoll = (poll) => ({
  type: "SET_POLL",
  payload: poll,
});

export const setResults = (results) => ({
  type: "SET_RESULTS",
  payload: results,
});
