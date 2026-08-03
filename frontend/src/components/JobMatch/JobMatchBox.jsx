import { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../UI/GlassCard';
import { analyzeJobMatch } from '../../services/api';
import { Toast } from '../UI/Toast';

export function JobMatchBox({ jobDescription, onBack }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const abortControllerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    // Cancel any previous in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const runAnalysis = async () => {
      if (!jobDescription?.trim()) {
        if (isMounted) setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const data = await analyzeJobMatch(jobDescription, signal);
        if (isMounted) setResult(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Job match request was cancelled');
          return;
        }
        if (isMounted) setError(err.message || 'Failed to analyze job description.');
      } finally {
        if (isMounted && abortControllerRef.current?.signal === signal) {
          setLoading(false);
        }
      }
    };
    
    runAnalysis();
    
    return () => { 
      isMounted = false; 
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [jobDescription]);

  const generateMarkdownReport = () => {
    if (!result) return '';
    return `# Candidate Interview Evaluation Report

**Candidate:** Jyoti Ranjan Panda  
**Overall Match:** ${result.score}%  
**Recommendation:** ${result.recommendation_level}  
**Confidence:** ${result.confidence}  

---

### Executive Summary
${result.reason}

${result.final_verdict ? `### Final Verdict\n${result.final_verdict}\n` : ''}

### Strengths
${result.strengths?.map(s => `- ${s}`).join('\n')}

### Missing Skills
${result.missing_skills?.map(m => `- ${m}`).join('\n')}

${result.risks?.length ? `### Evaluation Risks\n${result.risks?.map(r => `- ${r}`).join('\n')}\n` : ''}
${result.suggested_questions?.length ? `### Suggested Interview Questions\n${result.suggested_questions?.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n` : ''}
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport();
    navigator.clipboard.writeText(md);
    setToastMessage('Report copied as Markdown! 📋');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      
      <GlassCard className="w-full max-w-xl h-[560px] md:h-[600px] flex flex-col p-6 mx-auto relative overflow-hidden print-report-container print:h-auto print:max-w-none print:bg-white print:text-black print:overflow-visible print:p-0 print:border-none print:shadow-none">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none print:hidden" />

        <div className="flex flex-col h-full z-10 print:h-auto print:overflow-visible">
          {/* Print PDF Document Header */}
          <div className="hidden print:block mb-6 border-b-2 border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-black tracking-tight">Candidate Evaluation & Interview Report</h1>
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2 font-mono">
              <span>Candidate: <strong>Jyoti Ranjan Panda</strong></span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 print:hidden">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📊 Recruiter Dashboard
            </h2>
            <button 
              onClick={onBack}
              className="px-3 py-1.5 text-xs font-mono text-gray-400 border border-white/10 rounded-md hover:text-white hover:bg-white/5 transition-colors"
            >
              ← Back to Chat
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-cyan-400">
              <span className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium animate-pulse">Analyzing Candidate Profile & Generating Report...</span>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-red-400 text-sm px-2">⚠️ {error}</div>
            </div>
          ) : !result ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              No job description provided.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 print:overflow-visible print:h-auto print:pr-0">

              {/* Action / Export Toolbar */}
              <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10 print:hidden">
                <span className="text-xs font-mono text-gray-400 pl-2">Export Options:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-2.5 py-1 text-xs font-mono bg-white/5 hover:bg-white/10 text-cyan-300 rounded-lg border border-white/10 transition-colors"
                  >
                    📝 Copy Markdown
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-2.5 py-1 text-xs font-mono bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition-colors"
                  >
                    📄 Export / Print PDF
                  </button>
                </div>
              </div>

              {/* Phase 1: Submitted Job Description */}
              {jobDescription && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl print:border-gray-300 print:bg-gray-50 print:p-4">
                  <h3 className="text-sm font-bold text-cyan-400 mb-2 print:text-black print:text-sm print:font-bold flex items-center gap-2">
                    <span>📋</span> Phase 1: Submitted Job Description
                  </h3>
                  <div className="text-xs text-gray-300 print:text-gray-800 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible">
                    {jobDescription}
                  </div>
                </div>
              )}

              {/* Phase 2: Interview Evaluation & Match Analysis Header (Print Only) */}
              <div className="hidden print:block text-xs font-mono uppercase tracking-wider font-bold text-gray-500 border-b border-gray-300 pb-1 mt-6">
                Phase 2: Candidate Interview Evaluation & Match Analysis
              </div>

              {/* Score & Confidence Section */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl print:border-black">
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium print:text-black">Overall Match Score</span>
                  <span className="text-xs text-gray-400 mt-1 print:text-gray-700">
                    Confidence: <strong className={
                      result.confidence === 'High' ? 'text-green-400' :
                      result.confidence === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }>{result.confidence}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${result.score >= 70 ? 'text-green-400' : result.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.score}%
                  </span>
                </div>
              </div>

              {/* Skill Breakdown */}
              {result.skill_breakdown && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-white mb-2 print:text-black">📈 Skill Fit Breakdown</h3>
                  {Object.entries(result.skill_breakdown).map(([skill, percentage]) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-300 print:text-black">{skill}</span>
                        <span className="text-cyan-400 font-bold print:text-black">{percentage}%</span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendation & Reason */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-2">Recommendation</h3>
                <p className={`text-sm mb-2 font-bold ${
                  result.recommendation_level?.includes('Not') ? 'text-red-400' : 
                  result.recommendation_level?.includes('Junior') ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {result.recommendation_level}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed print:text-black">{result.reason}</p>
              </div>

              {/* Strengths & Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-green-500/20 rounded-xl">
                  <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                    <span>💪</span> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths?.length > 0 ? (
                      result.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                          <span className="text-green-500 mt-0.5">•</span> {s}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No specific matching strengths found.</li>
                    )}
                  </ul>
                </div>

                <div className="p-4 bg-white/5 border border-red-500/20 rounded-xl">
                  <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                    <span>⚠</span> Missing Skills
                  </h3>
                  <ul className="space-y-2">
                    {result.missing_skills?.length > 0 ? (
                      result.missing_skills.map((s, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                          <span className="text-red-500 mt-0.5">•</span> {s}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No significant missing skills.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Suggested Questions */}
              {result.suggested_questions && result.suggested_questions.length > 0 && (
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                  <h3 className="text-sm font-bold text-indigo-400 mb-3 flex items-center gap-2">
                    <span>❓</span> Suggested Interview Questions
                  </h3>
                  <ol className="space-y-2">
                    {result.suggested_questions.map((q, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                        <span className="text-indigo-400 font-bold mt-0.5">{i + 1}.</span> {q}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Risks */}
              {result.risks && result.risks.length > 0 && (
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <h3 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Evaluation Risks & Deductions
                  </h3>
                  <ul className="space-y-2">
                    {result.risks.map((r, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2 print:text-black">
                        <span className="text-orange-500 mt-0.5">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Final Verdict */}
              {result.final_verdict && (
                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <h3 className="text-sm font-bold text-cyan-400 mb-1">🏁 Final Verdict</h3>
                  <p className="text-sm text-gray-300 leading-relaxed print:text-black">{result.final_verdict}</p>
                </div>
              )}

            </div>
          )}
        </div>
      </GlassCard>
    </>
  );
}
