import React, { useState, useRef } from "react";
import ResumeForm from "./ResumeForm";
import Google from "./templates/Google";
import Meta from "./templates/Meta";
import Microsoft from "./templates/Microsoft";
import jsPDF from "jspdf";
import JDFeedback from "./JDFeedback";
import html2canvas from "html2canvas-pro";
import FixedResumeEditor from "./FixedResumeEditor";


export default function TemplateBuilder({ selectedTemplate }) {
  const [manualForm, setManualForm] = useState({});
  const [jdText, setJdText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [jdAnalysis, setJdAnalysis] = useState({});
  const [experienceLevel, setExperienceLevel] = useState("fresher");

  const [fixedResumeText, setFixedResumeText] = useState(null);

  const fileInputRef = useRef(null);
  const previewRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/extract", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        const parsed = JSON.parse(data.result);
        setManualForm(parsed);
      } else {
        alert("Error parsing resume: " + data.error);
      }
    } catch (err) {
      alert("Failed to upload file: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // fix resume -> 12/06
const handleFixResume = async ({ jdText, answers, manualForm }) => {
  try {
     console.log("Fixing resume with:", jdText, answers, manualForm);
    const response = await fetch("http://127.0.0.1:5000/api/fix-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jd: jdText,
        answers,
        resume: manualForm,
      }),
    });

    const data = await response.json();
    console.log( "your fixed resume is...", data)

    if (response.ok) {
      const fixedResume = data.fixed_resume; // adjust field name if backend uses a different key
      console.log(fixedResume)

      setFixedResumeText(fixedResume); // render FixedResumeEditor
    } else {
      console.error("Backend error:", data.error || data);
      alert("Failed to fix resume. Server error.");
    }
  } catch (error) {
    console.error("Error fixing resume:", error);
    alert("Failed to fix resume. Try again.");
  }
};


  const handleGenerateFeedback = async () => {
    if (!jdText || !manualForm) return alert("JD or resume is missing");
    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:5000/generate_feedback_from_jd",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jd: jdText,
            resume_text: manualForm,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setFeedback(data.feedback || "");
        setQuestions(data.questions || []);
        setJdAnalysis({
          ats_score: data.ats_score || 0,
          strengths: data.strengths || [],
          weaknesses: data.weaknesses || [],
          matching_skills: data.matching_skills || [],
          missing_skills: data.missing_skills || [],
          improvement_tips: data.improvement_tips || [],
        });
      } else {
        setFeedback("Something went wrong!");
      }
    } catch {
      setFeedback("Error generating feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2, // higher quality
        backgroundColor: "#ffffff", // fix transparency issues
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pdfHeight) {
        let position = 0;
        while (position < imgHeight) {
          pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
          position += pdfHeight;
          if (position < imgHeight) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      const filename = `${(manualForm.Name || "resume").replace(
        /[^a-z0-9]/gi,
        "_"
      )}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDF generation failed. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  const renderPreview = () => {
    const props = { data: manualForm };
    if (selectedTemplate === "google") return <Google {...props} />;
    if (selectedTemplate === "meta") return <Meta {...props} />;
    if (selectedTemplate === "microsoft") return <Microsoft {...props} />;
    return null;
  };


  if (fixedResumeText) {
  return (
    <FixedResumeEditor
      resumeText={fixedResumeText}
      setResumeText={setFixedResumeText}
      selectedTemplate={selectedTemplate}
    />
  );
}
  return (
    <>
      <main className="flex flex-col lg:flex-row gap-6 px-4 py-8 max-w-7xl mx-auto">
        {/* Left Panel: Form */}
        <section className="w-full lg:w-1/2 bg-[#ffffff] rounded-xl border border-[#e5e7eb] shadow-md p-6 overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-1">
            Resume Details
          </h2>
          <p className="text-sm text-[#6b7280] mb-4">
            Upload or fill manually below
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#2563eb]">
              <div className="w-10 h-10 border-4 border-[#60a5fa] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Processing your resume...</p>
            </div>
          ) : (
            <ResumeForm
              manualForm={manualForm}
              setManualForm={setManualForm}
              fileInputRef={fileInputRef}
              resumeFile={resumeFile}
              handleFileChange={handleFileChange}
              handleDragOver={(e) => e.preventDefault()}
              handleDrop={(e) => {
                e.preventDefault();
                handleFileChange({
                  target: { files: [e.dataTransfer.files[0]] },
                });
              }}
              experienceLevel={experienceLevel}
              handleExperienceChange={(e) => setExperienceLevel(e.target.value)}
            />
          )}
        </section>

        {/* Right Panel: Preview */}
        <section className="w-full lg:w-1/2 bg-[#ffffff] rounded-xl border border-[#e5e7eb] shadow-md p-6 overflow-y-auto max-h-[85vh]">
          <div className="sticky top-0 bg-[#ffffff] pb-3 z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-[#1e3a8a]">
                Live Resume Preview
              </h2>
              <p className="text-sm text-[#6b7280]">
                View your resume in real-time
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className={`px-4 py-2 text-white text-sm rounded transition ${
                downloading
                  ? "bg-[#4ade80] cursor-not-allowed"
                  : "bg-[#16a34a] hover:bg-[#15803d]"
              }`}
              disabled={downloading}
            >
              {downloading ? "Preparing..." : "⬇️ Download PDF"}
            </button>
          </div>

          <div className="bg-[#f9fafb] ">
            <div
              ref={previewRef}
              id="resume-capture"
              className="border border-black   bg-white overflow-hidden "
            >
              <div className=" origin-top">{renderPreview()}</div>
            </div>
          </div>
        </section>
      </main>

      {/* JD Feedback */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <JDFeedback
          manualForm={manualForm}
          jdText={jdText}
          setJdText={setJdText}
          handleGenerateFeedback={handleGenerateFeedback}
          feedback={feedback}
          questions={questions}
          ats_score={jdAnalysis.ats_score}
          strengths={jdAnalysis.strengths}
          weaknesses={jdAnalysis.weaknesses}
          matching_skills={jdAnalysis.matching_skills}
          missing_skills={jdAnalysis.missing_skills}
          improvement_tips={jdAnalysis.improvement_tips}
          loading={loading}
          handleFixResume={handleFixResume}
        />
      </div>
    </>
  );
}
