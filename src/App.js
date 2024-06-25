import "./App.css";
import store from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Teacher from "./Components/Teacher";
import SelectUSer from "./Components/SelectUser";
import Student from "./Components/Student";
import { Provider } from "react-redux";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/teacher" Component={Teacher} />
          <Route path="/student" Component={Student} />
          <Route path="/" Component={SelectUSer} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
