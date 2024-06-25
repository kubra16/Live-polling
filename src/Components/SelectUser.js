import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/actions";
const SelectUser = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const handleSelectUSer = (selectedRole) => {
    if (selectedRole === "teacher") {
      dispatch(setUser("Teacher", selectedRole));
      navigation(`/${selectedRole}`);
    } else {
      setRole(selectedRole);
    }
  };

  const handleSubmit = () => {
    if (name) {
      dispatch(setUser(name, role));
      navigation(`/${role}`);
    } else {
      alert("Please enter your name");
    }
  };
  return (
    <div>
      <h1>Select USer type</h1>
      <button onClick={() => handleSelectUSer("teacher")}>Teacher</button>
      <button onClick={() => handleSelectUSer("student")}>Student</button>
      {role === "student" && (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default SelectUser;
