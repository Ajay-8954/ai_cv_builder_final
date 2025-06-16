import React from "react";
import { CloudUpload } from "lucide-react";

export default function ResumeForm({
  experienceLevel,
  handleExperienceChange,
  resumeFile,
  fileInputRef,
  handleFileChange,
  handleDrop,
  handleDragOver,
  manualForm,
  setManualForm,
}) {
  return (
    <section className="space-y-6 max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200">
      <h3 className="text-2xl font-bold text-blue-800">
        Upload or Fill Resume
      </h3>

      {/* Experience level */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="radio"
            value="fresher"
            checked={experienceLevel === "fresher"}
            onChange={handleExperienceChange}
            className="accent-blue-600"
          />
          <span>Fresher</span>
        </label>
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="radio"
            value="experienced"
            checked={experienceLevel === "experienced"}
            onChange={handleExperienceChange}
            className="accent-blue-600"
          />
          <span>Experienced</span>
        </label>
      </div>

      {/* Upload Box */}
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-6 text-center text-blue-600 cursor-pointer hover:bg-blue-50 transition-all"
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CloudUpload className="w-10 h-10 mb-2 text-blue-500" />
        {resumeFile ? (
          <>
            <div className="font-medium">{resumeFile.name}</div>
            <div className="text-sm text-gray-500">
              Click or drag to change file
            </div>
          </>
        ) : (
          <>
            <div className="font-medium">
              Click or drag your resume file here
            </div>
            <div className="text-sm text-gray-500">
              Supported: .txt, .pdf, .docx
            </div>
          </>
        )}
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 gap-6">
        {[
          {
            label: "Full Name",
            id: "name",
            value: manualForm.Name,
            field: "Name",
            type: "input",
          },
          {
            label: "Professional Summary",
            id: "summary",
            value: manualForm.summary,
            field: "summary",
            type: "textarea",
          },
          {
            label: "Education",
            id: "education",
            value: manualForm.Education,
            field: "Education",
            type: "textarea",
          },
          {
            label: "Skills (comma-separated)",
            id: "skills",
            value: manualForm.Skills,
            field: "Skills",
            type: "input",
          },
          {
            label: "Projects",
            id: "projects",
            value: manualForm.Projects,
            field: "Projects",
            type: "textarea",
          },
          ...(experienceLevel === "experienced"
            ? [
                {
                  label: "Work Experience",
                  id: "workExp",
                  value: manualForm.workExp,
                  field: "workExp",
                  type: "textarea",
                },
              ]
            : []),
          {
            label: "Achievements",
            id: "achievements",
            value: manualForm.Achievements,
            field: "Achievements",
            type: "textarea",
          },
        ].map(({ label, id, value, field, type }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                id={id}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                value={value || ""}
                onChange={(e) =>
                  setManualForm((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            ) : (
              <input
                id={id}
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                value={value || ""}
                onChange={(e) =>
                  setManualForm((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            )}
          </div>
        ))}
      </div>

      {/* Preview Debug (Optional) */}
      <pre className="text-xs bg-gray-100 p-3 rounded-md border border-gray-200 text-gray-700">
        {JSON.stringify(manualForm, null, 2)}
      </pre>
    </section>
  );
}
