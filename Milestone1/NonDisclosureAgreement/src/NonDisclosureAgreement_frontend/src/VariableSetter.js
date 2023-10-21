// src/VariableSetter.js
import React, { useState } from "react";

function VariableSetter() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set the JavaScript variable with the user input
    setOutputValue(inputValue);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a value:
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Set Variable</button>
      </form>
      <p>Variable Value: {outputValue}</p>
    </div>
  );
}

export default VariableSetter;

