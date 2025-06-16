import { useNavigate } from "react-router-dom";
import Microsoft from "./templates/Microsoft";
import Google from "./templates/Google";
import Meta from "./templates/Meta";

// Dummy data shown in the preview cards
const dummyData = {
  Name: "Ajay Kumar",
  Email: "ajay@example.com",
  phoneNo: "+91 9876543210",
  linkedinProfileUrl: "https://linkedin.com/in/ajaykumar",
  summary:
    "Full-stack developer with 2+ years of experience in building scalable web applications and APIs. Proficient in MERN stack and cloud deployment.",
  Skills: "JavaScript, React, Node.js, Express.js, MongoDB, Git, Docker",
  workExp: `Software Developer at ABC Corp (2022 - Present)\nFrontend Intern at XYZ Pvt Ltd (2021 - 2022)`,
  Projects: `• Resume Builder Application using React & Express\n• E-commerce Website with Admin Panel`,
  Education: "B.Tech in Computer Science, NIT Delhi, 2021",
  Achievements: `• Top 5 Finalist - Hackathon 2023\n• Solved 300+ DSA problems on LeetCode\n• Google Cloud Certified Associate`,
};

const templates = [
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Clean, corporate style",
    PreviewComponent: Microsoft,
  },
  {
    id: "google",
    name: "Google",
    description: "Modern and minimalistic",
    PreviewComponent: Google,
  },
  {
    id: "meta",
    name: "Meta",
    description: "Elegant, serif font style",
    PreviewComponent: Meta,
  },
];

export default function TemplateSelection() {
  const navigate = useNavigate();

  const handleSelect = (id) => {
    navigate(`/builder/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 py-10 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-10">
        Choose Your Resume Template
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {templates.map(({ id, name, description, PreviewComponent }) => (
          <div
            key={id}
            onClick={() => handleSelect(id)}
            className="bg-white/90 backdrop-blur-md border border-blue-100 rounded-2xl shadow-md px-4 pt-6 pb-10 cursor-pointer hover:shadow-xl hover:scale-[1.015] transition-all duration-300 relative group max-w-md mx-auto"
            title={`Click to build with the ${name} template`}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-blue-800">{name}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="h-[340px] overflow-hidden bg-white rounded-md border border-gray-200 shadow-inner">
              <div className="scale-[0.55] origin-top transition-transform duration-300 group-hover:scale-[0.6] pointer-events-none">
                <PreviewComponent data={dummyData} />
              </div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Click to select this template
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
