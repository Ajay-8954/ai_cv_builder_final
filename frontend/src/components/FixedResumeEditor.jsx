import React, { useEffect, useRef, useState } from "react";
import Google from "./templates/Google";
import Meta from "./templates/Meta";
import Microsoft from "./templates/Microsoft";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export default function FixedResumeEditor({
  resumeText,
  setResumeText,
  selectedTemplate,
}) {
  const [downloading, setDownloading] = useState(false);
  const [formData, setFormData] = useState({});
  const previewRef = useRef();

  // Parse resumeText when component mounts
useEffect(() => {
  try {
    const cleaned = resumeText
      .replace(/```json/g, "") // remove opening code block
      .replace(/```/g, "")     // remove closing code block
      .trim();                 // clean up whitespace

    const parsed = JSON.parse(cleaned);
    setFormData(parsed);
  } catch (err) {
    console.error("Failed to parse resumeText:", err);
  }
}, [resumeText]);


  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setResumeText(JSON.stringify(updated, null, 2)); // Update parent
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#ffffff",
        allowTaint: true,
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

      pdf.save("updated_resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDF generation failed.");
    } finally {
      setDownloading(false);
    }
  };

  const renderPreview = () => {
    const props = { data: formData };

    if (selectedTemplate === "google") return <Google {...props} />;
    if (selectedTemplate === "meta") return <Meta {...props} />;
    if (selectedTemplate === "microsoft") return <Microsoft {...props} />;
    return null;
  };

  return (
    <main className="flex flex-col lg:flex-row gap-6 px-4 py-8 max-w-7xl mx-auto">
      {/* Left Side - Input Fields */}
      <section className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 shadow-md p-6 overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Edit Your Resume
        </h2>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key}
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Right Side - Live Preview */}
      <section className="w-full lg:w-1/2 bg-white rounded-xl border border-gray-300 shadow-md p-6 overflow-y-auto max-h-[85vh]">
        <div className="sticky top-0 bg-white pb-3 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-blue-800">
              Live Resume Preview
            </h2>
            <p className="text-sm text-gray-600">
              Based on your selected template
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className={`px-4 py-2 text-white text-sm rounded transition ${
              downloading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={downloading}
          >
            {downloading ? "Preparing..." : "⬇️ Download PDF"}
          </button>
        </div>

        <div className="bg-[#f9fafb] mt-4">
          <div
            ref={previewRef}
            id="resume-capture"
            className="border border-black bg-white overflow-hidden"
          >
            <div className="origin-top">{renderPreview()}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
