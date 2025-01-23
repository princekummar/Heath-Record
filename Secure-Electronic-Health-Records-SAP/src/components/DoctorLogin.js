import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorLoginPage.css";
import NavBar from "./NavBar";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [idNumberError, setidNumberError] = useState("");
  const [idNumber, setidNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  const handleidNumberChange = (e) => {
    const inputidNumber = e.target.value;
    const phoneRegex = /^\d{6}$/;
    if (phoneRegex.test(inputidNumber)) {
      setidNumber(inputidNumber);
      setidNumberError("");
    } else {
      setidNumber(inputidNumber);
      setidNumberError("Please enter a 6-digit ID Number.");
    }
  };

  const handleCheckRegistration = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorRegistration.networks[networkId];
      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        deployedNetwork && deployedNetwork.address
      );

      const isRegisteredResult = await contract.methods
        .isRegisteredDoctor(idNumber)
        .call();
      setIsRegistered(isRegisteredResult);

      if (isRegisteredResult) {
        const isValidPassword = await contract.methods
          .validatePassword(idNumber, password)
          .call();

        if (isValidPassword) {
          const doctor = await contract.methods
            .getDoctorDetails(idNumber)
            .call();
          setDoctorDetails(doctor);
          navigate("/doctor/" + idNumber);
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("Doctor not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div>
      <NavBar />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
        <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Login</h2>
          <div className="mb-4">
            <label className="block font-bold text-white" htmlFor="idNumber">
              ID Number
            </label>
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              required
              className={`mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover-bg-gray-800 transition duration-200 ${idNumberError && "border-red-500"}`}
              placeholder="ID Number"
              value={idNumber}
              onChange={handleidNumberChange}
            />
            {idNumberError && (
              <p className="text-red-500 text-sm mt-1">{idNumberError}</p>
            )}
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="mb-2 font-bold">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 transition duration-200"
              required
            />
          </div>
          <div className="space-x-4 text-center mt-6">

          <button
            onClick={handleCheckRegistration}
            className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
          >
            Login
          </button>
          <button
              onClick={cancelOperation}
              className="px-6 py-3 bg-teal-500 text-white font-bold text-lg rounded-lg cursor-pointer transition-transform transition-colors duration-300 ease-in hover:bg-teal-600 active:bg-teal-700"
              >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
