const ANALYTICS_KEY = 'ai_portfolio_analytics';

export function getAnalytics() {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : { questionsAsked: 0, reportsGenerated: 0 };
  } catch {
    return { questionsAsked: 0, reportsGenerated: 0 };
  }
}

export function trackQuestionAsked() {
  try {
    const stats = getAnalytics();
    stats.questionsAsked = (stats.questionsAsked || 0) + 1;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to track question:', err);
  }
}

export function trackReportGenerated() {
  try {
    const stats = getAnalytics();
    stats.reportsGenerated = (stats.reportsGenerated || 0) + 1;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to track report:', err);
  }
}
