const initialState = {
  currentPoll: null,
  pollResults: {},
  userName: null,
  userRole: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        userName: action.payload.name,
        userRole: action.payload.role,
      };
    case "SET_POLL":
      return { ...state, currentPoll: action.payload };
    case "SET_RESULTS":
      return { ...state, pollResults: action.payload };
    default:
      return state;
  }
}

export default reducer;
