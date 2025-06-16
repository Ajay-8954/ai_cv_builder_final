export default function ResumePreview({ resumeText, manualForm }) {
  return (
    <section className="w-full h-full overflow-y-auto px-2 md:px-4 border rounded-md">
      <div className="p-4">
        {resumeText ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {resumeText}
          </pre>
        ) : Object.keys(manualForm).length > 0 ? (
          <div className="space-y-4 text-sm text-gray-800">
            {manualForm.name && (
              <h2 className="text-2xl font-bold text-black">
                {manualForm.name}
              </h2>
            )}

            {manualForm.summary && (
              <>
                <h3 className="font-semibold text-blue-700">Summary</h3>
                <p>{manualForm.summary}</p>
              </>
            )}

            {manualForm.Education && (
              <>
                <h3 className="font-semibold text-blue-700">Education</h3>
                <p>{manualForm.Education}</p>
              </>
            )}

            {manualForm.Skills && typeof manualForm.skills === "string" && (
              <>
                <h3 className="font-semibold text-blue-700">Skills</h3>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {manualForm.Skills.split(",").map((skill, idx) => (
                    <li
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {manualForm.Projects && (
              <>
                <h3 className="font-semibold text-blue-700">Projects</h3>
                <p>{manualForm.Projects}</p>
              </>
            )}

            {manualForm.Experience && (
              <>
                <h3 className="font-semibold text-blue-700">Experience</h3>
                <p>{manualForm.Experience}</p>
              </>
            )}

            {manualForm.Achievements && (
              <>
                <h3 className="font-semibold text-blue-700">Achievements</h3>
                <p>{manualForm.Achievements}</p>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Upload your resume or fill out the form to see a live preview.
          </p>
        )}
      </div>
    </section>
  );
}


// ye kaam ka ni h syd