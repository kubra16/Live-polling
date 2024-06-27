import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/actions";
import style from "./SelectUSer.module.css";

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

  const handleBack = () => {
    setRole("");
    setName("");
  };

  return (
    <div className={style.userContainer}>
      {role === "" ? (
        <div>
          <div className={style.header}>Select User type to join the poll</div>
          <div className={style.buttonRow}>
            <button
              className={style.button}
              onClick={() => handleSelectUSer("teacher")}
            >
              Teacher
            </button>
            <button
              className={style.button}
              onClick={() => handleSelectUSer("student")}
            >
              Student
            </button>
          </div>
        </div>
      ) : (
        <div className={style.formContainer}>
          <div className={style.header}>Hello, Please enter your name</div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={style.inputField}
          />
          <button onClick={handleSubmit} className={style.submitButton}>
            Submit
          </button>
          <button onClick={handleBack} className={style.backButton}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectUser;
