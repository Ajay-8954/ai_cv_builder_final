import React from "react";

const Microsoft = ({ data = {} }) => {
  const {
    Name,
    Email,
    phoneNo,
    linkedinProfileUrl,
    summary,
    Skills,
    workExp,
    Education,
    Achievements,
  } = data;

  const skillList = Skills?.split(",").map((s) => s.trim()) || [];
  const workList = workExp?.split("\n").filter(Boolean) || [];
  const achievementList = Achievements?.split("\n").filter(Boolean) || [];

  return (
    <div className="w-full bg-white p-4 text-sm text-gray-900 font-sans">
      <div className="max-w-[900px] mx-auto border border-gray-300 flex flex-col md:flex-row rounded-md overflow-hidden">
        {/* Left Sidebar */}
        <div className="md:w-1/3 bg-blue-800 text-white p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{Name || "Your Name"}</h1>
            <p className="text-xs mt-1">Full Stack Developer</p>
          </div>

          <div>
            <h2 className="font-semibold text-sm border-b border-white pb-1">Contact</h2>
            <div className="mt-2 space-y-1 text-xs">
              {phoneNo && <p>📞 {phoneNo}</p>}
              {Email && <p>📧 {Email}</p>}
              {linkedinProfileUrl && (
                <p className="break-words">
                  🔗{" "}
                  <a
                    href={linkedinProfileUrl}
                    className="underline text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </p>
              )}
            </div>
          </div>

          {skillList.length > 0 && (
            <div>
              <h2 className="font-semibold text-sm border-b border-white pb-1">Skills</h2>
              <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                {skillList.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="md:w-2/3 p-6 space-y-5">
          {summary && (
            <section>
              <h2 className="text-base font-semibold text-blue-800 border-b border-gray-300 pb-1">Summary</h2>
              <p className="text-xs mt-1 text-justify">{summary}</p>
            </section>
          )}

          {workList.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-blue-800 border-b border-gray-300 pb-1">
                Work History
              </h2>
              <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                {workList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {Education && (
            <section>
              <h2 className="text-base font-semibold text-blue-800 border-b border-gray-300 pb-1">
                Education
              </h2>
              <p className="mt-1 text-xs">{Education}</p>
            </section>
          )}

          {achievementList.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-blue-800 border-b border-gray-300 pb-1">
                Achievements
              </h2>
              <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                {achievementList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-base font-semibold text-blue-800 border-b border-gray-300 pb-1">
              Interests and Hobbies
            </h2>
            <p className="mt-1 text-xs">Cricket, Table Tennis, Traveling</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Microsoft;
