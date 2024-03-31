import React, { useState } from "react";

const IndexPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null); // State to store the result

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Send the file to the backend
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to upload file: ${response.status} ${response.statusText}`
        );
      }

      // Get the result from the response
      const resultData = await response.json();
      setResult(resultData);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`); // Display error message to the user
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          flex: "1",
          marginRight: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ marginTop: "0" }}>Upload a log file (.txt)</h1>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: "2px dashed",
            padding: "20px",
            borderColor: dragging ? "blue" : "inherit",
            flex: "1",
          }}
        >
          <p>Drag & drop your file here or click to select</p>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        {selectedFile && (
          <div style={{ marginTop: "20px" }}>
            <p>Selected file: {selectedFile.name}</p>
            <button type="button" onClick={handleSubmit}>
              Upload
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          flex: "1",
          marginLeft: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ marginTop: "0" }}>Results: </h1>
        {result && (
          <div style={{ border: "1px solid", padding: "20px", flex: "1" }}>
            <p>Chattiest User: {result.username}</p>
            <p>Message Count: {result.count}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
