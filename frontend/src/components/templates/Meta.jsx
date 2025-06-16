import React from "react";

const Meta = ({ data = {} }) => {
  const {
    Name,
    Email,
    phoneNo,
    linkedinProfileUrl,
    summary,
    Skills,
    Projects,
    workExp,
    Education,
    Achievements,
  } = data;

  const skillList = Skills?.split(",").map((s) => s.trim()) || [];
  const projectList = Projects?.split("\n").filter(Boolean) || [];
  const achievementList = Achievements?.split("\n").filter(Boolean) || [];
  const experienceList = workExp?.split("\n").filter(Boolean) || [];

  const contactInfo = [Email, phoneNo, linkedinProfileUrl]
    .filter(Boolean)
    .map((item, i, arr) => {
      const isLink = item.startsWith("http");
      return (
        <span key={i}>
          {isLink ? (
            <a
              href={item}
              className="text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item}
            </a>
          ) : (
            item
          )}
          {i !== arr.length - 1 && " | "}
        </span>
      );
    });

  return (
    <div className="w-full bg-white ">
      <div className="max-w-[900px] mx-auto border border-gray-300 rounded-md p-6 text-gray-900 font-serif">
        <h1 className="text-3xl font-bold text-center">{Name || "Your Name"}</h1>

        {/* Contact Info */}
        {contactInfo.length > 0 && (
          <p className="text-sm text-gray-700 mt-1 mb-4 text-center">{contactInfo}</p>
        )}

        <hr className="my-4 border-gray-500" />

        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xl font-bold uppercase text-blue-800 mb-1">Professional Summary</h2>
            <p className="text-sm text-justify mb-4">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experienceList.length > 0 && (
          <section>
            <h2 className="text-xl font-bold uppercase text-blue-800 mb-2">Experience</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {experienceList.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects */}
        {projectList.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xl font-bold uppercase text-blue-800 mb-2">Projects</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {projectList.map((proj, i) => (
                <li key={i}>{proj}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {skillList.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xl font-bold uppercase text-blue-800 mb-2">Skills</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {skillList.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {Education && (
          <section className="mt-4">
            <h2 className="text-xl font-bold uppercase text-blue-800 mb-2">Education</h2>
            <p className="text-sm">{Education}</p>
          </section>
        )}

        {/* Achievements */}
        {achievementList.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xl font-bold uppercase text-blue-800 mb-2">Achievements</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {achievementList.map((ach, i) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Meta;
