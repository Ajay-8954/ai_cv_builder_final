from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  # PyMuPDF
import docx
import openai
from werkzeug.utils import secure_filename
import re
import json
from dotenv import load_dotenv
load_dotenv()



app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text(file, filename):
    filename = filename.lower()

    if filename.endswith(".pdf"):
        doc = fitz.open(stream=file.read(), filetype="pdf")
        return " ".join(page.get_text() for page in doc)

    elif filename.endswith(".docx"):
        return "\n".join(para.text for para in docx.Document(file).paragraphs)

    elif filename.endswith(".txt"):
        return file.read().decode("utf-8", errors="ignore")

    return ""


@app.route("/extract", methods=["POST"])
def extract_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files["resume"]
    filename = file.filename

# No need to save to disk!
    raw_text = extract_text(file, filename)

    truncated_text = raw_text[:10000]

    prompt = f"""
Extract the following information from the resume text and return it in JSON format. For the fields Education, Projects, Skills, Achievements, and Experience, return the values as comma-separated strings.
Fields to extract:
summary or professional summary 
Name
Email
phoneNo
linkedinProfileUrl
Education (comma-separated)
Projects (comma-separated)
Skills (comma-separated)
Achievements (comma-separated)
Certifications -(comma-separated)
Experience (comma-separated) not put projects in experience
Format the response as JSON, with each field as a exact key that i mention and the corresponding extracted value as a string. For example, Education should be one string with each education entry separated by commas.

Resume:
\"\"\"{truncated_text}\"\"\"
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )
        result = response["choices"][0]["message"]["content"]
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return "Resume API is live."

@app.route('/upload_resume_for_ats', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = file.filename
    resume_text = extract_text(file, filename)

    prompt = f"""
You are a professional Resume Analyzer AI built to mimic how real Applicant Tracking Systems (ATS) and recruiters scan resumes. 

Given a resume text, evaluate its strength, ATS compatibility, and areas for improvement — even without a job description. 
Use the criteria below to assign scores and give actionable suggestions. and if you detect that it is a not document and pdf please return Please upload a resume file only 

-------------------------------
70 se upar ats score mat de or agr resume na ho toh 0 dedena

-------------------------------
Output Format:
Return a single flat JSON object with the following fields:

{{
  "ats_score": 0,
  "strengths": [],
  "weaknesses": [],
  "section_feedback": {{
    "Formatting": "",
    "Skills": "",
    "Experience": "",
    "Education": "",
    "Summary": ""
  }},
  "improvement_tips": [],
  "emotional_feedback": "",
  "assertiveness_score": 0,
  "readability_score": 0,
  "grammar_score": 0,
  "tone": ""
}}

Resume:
\"\"\"{resume_text}\"\"\"
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{ "role": "user", "content": prompt }],
            temperature=0.3
        )

        result = response.choices[0].message.content.strip()

        # Extract JSON part from triple backticks if present
        match = re.search(r'```json(.*?)```', result, re.DOTALL)
        if match:
            json_str = match.group(1).strip()
        else:
            json_str = result

        # Convert JSON string to dict
        result_dict = json.loads(json_str)

        # Add parsed_text key
        result_dict["parsed_text"] = resume_text

        return jsonify(result_dict)

    except Exception as e:
        return jsonify({ "error": str(e) }), 500



@app.route('/generate_feedback_from_jd', methods=['POST'])
def generate_feedback_from_jd():
    try:
        data = request.get_json()
        jd = data.get('jd')
        resume_text = data.get('resume_text')

        if not jd or not resume_text:
            return jsonify({"error": "JD or resume text missing"}), 400

        prompt = f"""
You are an expert Career Coach and ATS (Applicant Tracking System) evaluator.

Your task is to compare a **Job Description (JD)** and a **Resume**. Based on this comparison, analyze and return insights that help the candidate improve alignment for better hiring outcomes.

Generate and return your response strictly in the following JSON format:

{{
  "ats_score": number (0-100),
  "feedback": "string",
  "strengths": ["string", "string", ...],
  "weaknesses": ["string", "string", ...],
  "matching_skills": ["string", "string", ...],
  "missing_skills": ["string", "string", ...],
  "improvement_tips": ["string", "string", ...],
  "questions": ["string", "string", "string", ...]
}}

JD:
\"\"\"{jd}\"\"\"

Resume:
\"\"\"{resume_text}\"\"\"
"""

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000
        )

        result = response.choices[0].message.content.strip()

        # Extract JSON from code block if wrapped
        match = re.search(r'```json(.*?)```', result, re.DOTALL)
        if match:
            result_json = match.group(1).strip()
        else:
            result_json = result

        try:
            parsed_result = json.loads(result_json)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON returned by model", "raw": result_json}), 500

        # Fix missing fields
        feedback = parsed_result.get("feedback", "No feedback generated.")
        questions = parsed_result.get("questions", [])

        # If questions is a string or invalid format, try converting to list
        if isinstance(questions, str):
            questions = [q.strip() for q in re.split(r'[\n\-•]', questions) if q.strip()]

       
        return jsonify({
            "ats_score": parsed_result.get("ats_score", 0),
            "feedback": parsed_result.get("feedback", "No feedback generated."),
            "strengths": parsed_result.get("strengths", []),
            "weaknesses": parsed_result.get("weaknesses", []),
            "matching_skills": parsed_result.get("matching_skills", []),
            "missing_skills": parsed_result.get("missing_skills", []),
            "improvement_tips": parsed_result.get("improvement_tips", []),
            "questions": questions
})

    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route('/api/fix-resume', methods=['POST'])
def fix_resume():
    data = request.get_json()

    jd = data.get('jd')  # Job Description
    answers = data.get('answers')  # Dict of question-answers
    resume = data.get('resume')  # Resume text

    if not jd or not resume:
        return jsonify({"error": "JD and Resume are required"}), 400

    # Convert answers dict to readable format
    formatted_answers = "\n".join(
        f"Q{i+1}: {q}\nA{i+1}: {a}" for i, (q, a) in enumerate(answers.items())
    )

    # Construct the prompt for ChatGPT
    prompt = f"""
You are an expert resume writer.

Below is a Job Description:
{jd}

Here is the current resume:
{resume}

The candidate has answered a few job-specific questions:
{formatted_answers}

Now, rewrite the resume to be tailored to this job. Keep formatting clear and professional. Match keywords and responsibilities from the JD. Make it ATS-friendly.
Return only the improved resume.
summary or professional summary 
Name
Email
phoneNo
linkedinProfileUrl
Education (comma-separated)
Projects (comma-separated)
Skills (comma-separated)
Achievements (comma-separated)
Certifications -(comma-separated)
Experience (comma-separated) not put projects in experience
Format the response as JSON, with each field as a exact key that i mention and the corresponding extracted value as a string. For example, Education should be one string with each education entry separated by commas.

"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful resume assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        improved_resume = response['choices'][0]['message']['content']
        return jsonify({"fixed_resume": improved_resume})

    except Exception as e:
        return jsonify({"error": str(e)}), 500







if __name__ == "__main__":
    app.run(debug=True)
