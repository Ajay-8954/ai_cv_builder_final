import React from 'react';

const Google = ({ data = {} }) => {
  const {
    Name,
    Email,
    phoneNo,
    linkedinProfileUrl,
    summary,
    Skills,
    Projects,
    Education,
    Achievements,
  } = data;

  const skillList = Skills?.split(',').map((s) => s.trim()) || [];
  const projectList = Projects?.split('\n').filter(Boolean) || [];
  const achievementList = Achievements?.split('\n').filter(Boolean) || [];

  return (
    <div className="w-full bg-white text-gray-900 font-sans p-6 max-w-[800px] mx-auto rounded border border-gray-300">
      {/* Name */}
      <h1 className="text-3xl font-bold text-center">{Name || 'Your Name'}</h1>

      {/* Contact Info */}
      <p className="text-center text-sm text-gray-700 mt-1">
        {Email} | {phoneNo} |{' '}
        {linkedinProfileUrl && (
          <a
            href={linkedinProfileUrl}
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
      </p>

      {/* Profile Summary */}
      {summary && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b border-gray-300 pb-1">
            Profile
          </h2>
          <p className="mt-2 text-justify text-sm">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <ul className="list-disc list-inside mt-2 text-sm space-y-1">
            {skillList.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects */}
      {projectList.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b border-gray-300 pb-1">
            Projects
          </h2>
          <ul className="list-disc list-inside mt-2 text-sm space-y-1">
            {projectList.map((project, i) => (
              <li key={i}>{project}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Education */}
      {Education && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b border-gray-300 pb-1">
            Education
          </h2>
          <p className="mt-2 text-sm">{Education}</p>
        </section>
      )}

      {/* Achievements */}
      {achievementList.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-blue-800 border-b border-gray-300 pb-1">
            Achievements
          </h2>
          <ul className="list-disc list-inside mt-2 text-sm space-y-1">
            {achievementList.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Google;
