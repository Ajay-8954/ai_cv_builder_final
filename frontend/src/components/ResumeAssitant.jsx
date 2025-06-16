import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";

export default function ResumeAssistant() {
  const [resumeText, setResumeText] = useState("");
  const [manualForm, setManualForm] = useState({});
  const [jdText, setJdText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [resumeFile, setResumeFile] = useState("");
  const [loading, setLoading] = useState(false); // <-- loader state

  const fileInputRef = useRef(null);
  const [experienceLevel, setExperienceLevel] = useState("fresher");

  const handleExperienceChange = (e) => {
    setExperienceLevel(e.target.value);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleGenerateFeedback = () => {
    if (!resumeText && Object.keys(manualForm).length === 0) {
      alert("Please upload resume or fill form");
      return;
    }
    if (!jdText) {
      alert("Please enter job description");
      return;
    }

    setFeedback(
      "📊 Sample feedback based on resume and JD comparison. Add real logic here."
    );
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setResumeFile(file);
    setLoading(true); // start loader

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://127.0.0.1:5000//extract", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        try {
          const parsed = JSON.parse(data.result);
          setManualForm(parsed);
        } catch {
          alert(data.result);
        }
      } else {
        alert("Error parsing resume: " + data.error);
      }
    } catch (err) {
      alert("Failed to upload file: " + err.message);
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Resume Form & Live Preview Side by Side or Stacked on Mobile */}
      <main className="flex flex-col md:flex-row flex-1 container mx-auto px-4 py-6 gap-6">
        {/* Resume Form */}
        <section className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 max-h-[75vh] overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Upload Resume / Fill Details
          </h2>

          {/* Show loader when loading */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : (
            <ResumeForm
              resumeText={resumeText}
              setResumeText={setResumeText}
              manualForm={manualForm}
              setManualForm={setManualForm}
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
              resumeFile={resumeFile}
              experienceLevel={experienceLevel}
              handleExperienceChange={handleExperienceChange}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
            />
          )}
        </section>

        {/* Live Preview - Bigger on mobile */}
        <section className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Live Preview</h2>
          <div className="h-full">
            <ResumePreview resumeText={resumeText} manualForm={manualForm} />
          </div>
        </section>
      </main>

      {/* JD Input and Feedback Section */}
      <section className="container mx-auto px-4 pb-10">
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Job Description</h2>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste or type Job Description here..."
            className="w-full h-28 border rounded-md p-3 mb-4 resize-none"
          />

          <button
            onClick={handleGenerateFeedback}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Generate Feedback
          </button>

          {feedback && (
            <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-300 whitespace-pre-wrap text-gray-800">
              <h3 className="font-semibold mb-2">Analysis / Feedback</h3>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}



// ye kaam k nhi hai syd