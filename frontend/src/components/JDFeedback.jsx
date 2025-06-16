import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  ListChecks,
  ListX,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";

export default function JDFeedback({
  jdText,
  setJdText,
  handleGenerateFeedback,
  feedback,
  questions,
  ats_score,
  strengths,
  weaknesses,
  matching_skills,
  missing_skills,
  improvement_tips,
  loading,
  handleFixResume, // 🟢 Add this in parent to handle resume update
  manualForm, //  12/06 -> accepting resume text for fixing
}) {
  const [openSections, setOpenSections] = useState({
    strengths: true,
    weaknesses: true,
    matching_skills: true,
    missing_skills: true,
    improvement_tips: true,
    questions: true,
  });

  const [answers, setAnswers] = useState({});

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const sections = [
    { title: "Strengths", icon: ThumbsUp, color: "green", data: strengths },
    { title: "Weaknesses", icon: ThumbsDown, color: "red", data: weaknesses },
    {
      title: "Matching Skills",
      icon: ListChecks,
      color: "blue",
      data: matching_skills,
    },
    {
      title: "Missing Skills",
      icon: ListX,
      color: "orange",
      data: missing_skills,
    },
    {
      title: "Improvement Tips",
      icon: Lightbulb,
      color: "purple",
      data: improvement_tips,
    },
  ];

  return (
    <section className="space-y-6 mt-10 p-4 bg-gradient-to-br from-white via-sky-50 to-blue-100 rounded-xl shadow-md">
      {/* JD Input */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          📄 Job Description
        </h3>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:ring-2 focus:ring-blue-200"
          rows={4}
          placeholder="Paste your Job Description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <button
          onClick={handleGenerateFeedback}
          className={`mt-3 px-5 py-2 rounded-md text-white font-medium transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "✨ Generate Feedback"
          )}
        </button>
      </div>

      {/* ATS Score */}
      {ats_score !== undefined && (
        <div className="p-4 bg-white rounded shadow border border-blue-100 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-yellow-500" /> ATS Score:
          </h4>
          <span className="text-3xl font-bold text-blue-700">
            {ats_score}/100
          </span>
        </div>
      )}

      {/* Overall Feedback */}
      {feedback && (
        <div className="p-4 bg-green-50 rounded-md border border-green-300 shadow-sm">
          <h4 className="font-semibold text-green-800 mb-2">
            ✅ Overall Feedback
          </h4>
          <p className="text-sm text-green-700">{feedback}</p>
        </div>
      )}

      {/* Feedback Sections */}
      {sections.map(({ title, icon: Icon, color, data }) => {
        const key = title.toLowerCase().replace(/\s/g, "_");
        if (!data?.length) return null;

        return (
          <div
            key={key}
            className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleSection(key)}
              className={`w-full flex justify-between items-center px-4 py-3 text-${color}-700 font-medium text-left bg-${color}-50 hover:bg-${color}-100 transition`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-5 h-5" /> {title}
              </span>
              {openSections[key] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {openSections[key] && (
              <ul
                className={`px-6 py-3 list-${
                  key === "suggested_questions" ? "decimal" : "disc"
                } text-sm text-${color}-700 space-y-1 bg-white`}
              >
                {data.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* Answer Section for Questions */}
      {questions?.length > 0 && (
        <div className="bg-white p-6 rounded-md shadow border border-gray-300 space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            ✍️ Answer These Questions
          </h4>

          {questions.map((q, i) => (
            <div key={i} className="space-y-1">
              <label className="text-sm text-gray-700 font-medium">{q}</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300"
                rows={2}
                placeholder="Write your answer..."
                value={answers[i] || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [i]: e.target.value })
                }
              />
            </div>
          ))}

          <button
            onClick={() => {
              if (handleFixResume) {
                handleFixResume({ jdText, answers, manualForm });
              } else {
                alert("handleFixResume function is missing!");
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium transition"
          >
            ✅ Fix My Resume
          </button>
        </div>
      )}
    </section>
  );
}
