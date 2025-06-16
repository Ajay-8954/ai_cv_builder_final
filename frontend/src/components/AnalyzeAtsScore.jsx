import { useState } from "react";
import {
  UploadCloud,
  GaugeCircle,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import JDFeedback from "./JDFeedback";

// Toggleable Section Component
const ToggleSection = ({
  title,
  color,
  icon: Icon,
  items = [],
  open,
  setOpen,
}) => {
  return (
    <div className="mb-4 border border-gray-200 rounded-md shadow-sm bg-gray-50">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center px-4 py-3 font-semibold text-left text-${color}-700 hover:bg-${color}-50 transition-all`}
      >
        <span className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${color}-600`} />
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {open && (
        <ul
          className={`px-5 py-2 text-sm text-${color}-700 space-y-1 list-disc`}
        >
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function AnalyzeAtsScore() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [jdText, setJdText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [questions, setQuestions] = useState([]);
  const [jdAnalysis, setJdAnalysis] = useState({});
  const [generatingFeedback, setGeneratingFeedback] = useState(false);

  const [showStrengths, setShowStrengths] = useState(false);
  const [showWeaknesses, setShowWeaknesses] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showSections, setShowSections] = useState(false);

  const handleFileUpload = async (e) => {
    setErrorMsg(null);
    const file = e.target.files[0];
    if (!file) return;

    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setErrorMsg("Please upload PDF or DOCX files only.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File size should be less than 2MB.");
      return;
    }

    setSelectedFileName(file.name);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload_resume_for_ats", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data);
      } else {
        setErrorMsg(data.error || "Failed to analyze resume.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFeedback = async () => {
    if (!jdText || !analysis?.parsed_text)
      return alert("JD or resume is missing");

    setGeneratingFeedback(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:5000/generate_feedback_from_jd",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jd: jdText,
            resume_text: analysis.parsed_text,
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
          section_feedback: data.section_feedback || {},
        });
      } else {
        setFeedback("Something went wrong!");
      }
    } catch {
      setFeedback("Error generating feedback.");
    } finally {
      setGeneratingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-100 to-green-100 px-4 py-10 space-y-10">
      {/* Upload + Score Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full md:w-1/2 text-center border border-dashed border-green-400 hover:shadow-2xl transition-all">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Is your resume good enough?
          </h2>
          <p className="text-gray-500 mb-6">
            Upload a resume to get instant ATS insights.
          </p>

          <label className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-100 transition-all">
            <UploadCloud className="w-10 h-10 text-green-500 mb-2 animate-bounce" />
            <span className="text-gray-600 font-medium">
              Click or drag to upload
            </span>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {selectedFileName && (
            <p className="mt-2 text-sm text-green-700 font-medium">
              ✅ Uploaded: {selectedFileName}
            </p>
          )}
          {errorMsg && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              ❌ {errorMsg}
            </p>
          )}
          <p className="mt-4 text-xs text-gray-400">
            Max 2MB. Privacy guaranteed{" "}
            <ShieldCheck className="inline w-4 h-4 ml-1 text-green-400" />
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full md:w-1/2 max-h-[600px] overflow-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Resume Score
          </h3>

          {loading ? (
            <div className="flex flex-col items-center text-green-500">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p>Analyzing resume...</p>
            </div>
          ) : !analysis ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 space-y-3 p-4">
              <div className="relative">
                <GaugeCircle className="w-16 h-16 text-gray-300 animate-pulse" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-600 rounded-full" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-700">
                Awaiting Resume
              </h4>
              <p className="text-sm text-gray-500 max-w-sm">
                Upload your resume to receive a detailed ATS analysis including
                scoring, grammar, tone, and personalized suggestions.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {analysis.ats_score}/100
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {analysis.strengths.length} strengths,{" "}
                {analysis.weaknesses.length} issues
              </div>

              <div className="mb-4 text-sm space-y-1 text-gray-700">
                <p>
                  <strong>Assertiveness:</strong> {analysis.assertiveness_score}
                </p>
                <p>
                  <strong>Grammar:</strong> {analysis.grammar_score}
                </p>
                <p>
                  <strong>Readability:</strong> {analysis.readability_score}
                </p>
                <p>
                  <strong>Tone:</strong> {analysis.tone}
                </p>
              </div>

              {analysis.emotional_feedback && (
                <div className="mb-4 p-3 bg-green-50 rounded border border-green-200 text-green-700">
                  <strong>Feedback:</strong> {analysis.emotional_feedback}
                </div>
              )}

              {/* Toggle Sections */}
              <ToggleSection
                title="Strengths"
                color="green"
                icon={CheckCircle}
                items={analysis.strengths}
                open={showStrengths}
                setOpen={setShowStrengths}
              />
              <ToggleSection
                title="Weaknesses"
                color="red"
                icon={XCircle}
                items={analysis.weaknesses}
                open={showWeaknesses}
                setOpen={setShowWeaknesses}
              />
              <ToggleSection
                title="Improvement Tips"
                color="blue"
                icon={CheckCircle}
                items={analysis.improvement_tips}
                open={showTips}
                setOpen={setShowTips}
              />
              <ToggleSection
                title="Section Feedback"
                color="purple"
                icon={GaugeCircle}
                items={Object.entries(analysis.section_feedback || {}).map(
                  ([section, text]) => `${section}: ${text}`
                )}
                open={showSections}
                setOpen={setShowSections}
              />
            </div>
          )}
        </div>
      </div>

      {/* JD Feedback */}
      {analysis?.parsed_text && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
          <JDFeedback
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
            handleFixResume={handleFixResume}
          />

          {generatingFeedback && (
            <div className="mt-4 flex justify-center items-center gap-2 text-blue-600 text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating AI
              feedback...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
