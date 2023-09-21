import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { database } from "./firebaseConfig";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const value = collection(database, "picture");

  const handleLogin = async () => {
    try {
      if (!password) {
        toast.warn("please enter password");
        return;
      }
      const q = query(value, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        toast.error("user not recognized");
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.password !== password) {
        toast.error("incorrect password, please try again");
        return;
      }

      //   console.log("User ID: ", querySnapshot.docs[0].id);
      localStorage.setItem("userId", querySnapshot.docs[0].id);
      //   console.log("User Email: ", email);

      navigate("/");
    } catch (error) {
      toast.error("Error logging in: ", error);
    }
  };

  const handleCreateAccount = async () => {
    const q = query(value, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      console.log("Email already exists.");
      toast.info("user with this mail already exist")
    } else {
      if (!password) {
        toast.warn("password field can't be empty");
        return;
      }
      try {
        const docRef = await addDoc(value, {
          email: email,
          password: password,
        });
        // console.log("Document written with ID: ", docRef.id);
        // console.log("User email: ", email);
        toast.success(
          "Your Account is created successfully, enjoy drag and drop features"
        );
        localStorage.setItem("userId", docRef.id);
        navigate("/");
      } catch (error) {
        toast.error("Error creating your account, it seems you have bad internet, check your router");
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <LoginContainer>
        <LoginForm>
          <h2>Login</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoginButton onClick={handleLogin}>Login</LoginButton>
          <CreateAccountButton onClick={handleCreateAccount}>
            Create Account
          </CreateAccountButton>
        </LoginForm>
      </LoginContainer>
    </>
  );
};

export default Login;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginForm = styled.div`
  background-color: #0000005f;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  display: flex;
  width: 30%;
  flex-direction: column;
  color: black;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 728px) {
    width: 80%;
  }
`;

const Input = styled.input`
  width: auto;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const LoginButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
`;

const CreateAccountButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
`;
