import { useState } from "react";
import axios from "axios";
import mammoth from "mammoth";

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpLoad = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await axios.post("http://localhost:8080/api/upload", formData, {
        responseType: "blob",
      });


      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result;

        const { value: htmlContent } = await mammoth.convertToHtml({ arrayBuffer });
        setFileContent(htmlContent);
      };
      fileReader.readAsArrayBuffer(response.data);

    } catch (e) {
      console.error("Error uploading file", e);
      alert("An error occurred while uploading the file");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <div style={{backgroundColor:"orange", height:"100vh"}}>
      <div style={{padding: "20px", textAlign: "center",}}>
        <h2>Image to Word Converter</h2>
        <input type="file" accept="image/*" onChange={handleChange}/>
        <button onClick={handleUpLoad} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Convert..."}
        </button>
        <div
            style={{
              width: "70%",
              height: "600px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              textAlign: "left",
              backgroundColor: "#f9f9f9",
                marginLeft: "auto",
                marginRight: "auto",

            }}
            dangerouslySetInnerHTML={{__html: fileContent}}
        />
      </div>
      </div>
  );
}

export default App;
