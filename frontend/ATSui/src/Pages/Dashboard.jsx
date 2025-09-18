import { useState } from "react";
import "./Dashboard.css";
import CircleChart from "./CircleChart";
import "./AnalysisCard.css"

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // Must match backend multer field
      formData.append("jobDescription", jd);

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze resume");

      const data = await response.json();

      // Map backend result to strengths and weaknesses
      const strengths = Object.entries(data.categoryScores)
        .filter(([_, score]) => score >= 60)
        .map(([cat]) => cat);

      const weaknesses = Object.entries(data.categoryScores)
        .filter(([_, score]) => score < 60)
        .map(([cat]) => cat);

      setAnalysis({
        score: Math.round(data.totalScore),
        strengths,
        weaknesses,
        preview: data.preview || "",
      });
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = analysis
    ? {
        labels: ["Match Score", "Remaining"],
        values: [analysis.score, 100 - analysis.score],
      }
    : null;

  return (
    <div className="dashboard">
      <header className="header">
        <h1>
          ATS <span>Scorer</span>
        </h1>
        <p>
          Upload resume (.txt, .pdf, .docx) • Paste job description • Get
          analysis
        </p>
      </header>

      <section className="features">
        <div className="feature-card">✔ Keyword Match</div>
        <div className="feature-card">✔ Formatting & Readability</div>
        <div className="feature-card">✔ Contact Info Checks</div>
        <div className="feature-card">✔ Education & Experience</div>
      </section>

      <main className="main">
        <div className="upload-card">
          <h3>Upload Resume</h3>
          <input type="file" accept=".pdf,.txt,.docx" onChange={handleUpload} />
          <textarea
            placeholder="Paste Job Description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <div className="buttons">
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
            <button
              className="clear-btn"
              onClick={() => {
                setFile(null);
                setJd("");
                setAnalysis(null);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="analysis-card">
  <h3>Analysis Report</h3>
  {analysis ? (
    <>
      {chartData && <CircleChart data={chartData} />}

      <p>
        <strong>Match Score:</strong> {analysis.score}%
      </p>

      <h4>✅ Strengths</h4>
      {analysis.strengths.length > 0 ? (
        <ul className="strength-list">
          {analysis.strengths.map((s, i) => (
            <li key={i}>
              {s}
              <div className="gradient-line strength" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No strong areas detected.</p>
      )}

      <h4>⚠ Weaknesses</h4>
      {analysis.weaknesses.length > 0 ? (
        <ul className="weakness-list">
          {analysis.weaknesses.map((w, i) => (
            <li key={i}>
              {w}
              <div className="gradient-line weakness" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No significant weaknesses.</p>
      )}

      {analysis.preview && (
        <>
          <h4>📝 Preview:</h4>
          <p>{analysis.preview}...</p>
          {/* Optional: Add a preview gradient line */}
          <div className="gradient-line preview" />
        </>
      )}
    </>
  ) : (
    <div className="placeholder">
      {loading ? "Analyzing..." : "Awaiting upload…"}
    </div>
  )}
</div>

      </main>

      <footer className="footer">
        <p>Built for ATS • Upload processed on server • Designed for clarity</p>
      </footer>
    </div>
  );
}
