// Simple rule-based chatbot service
export const chatbotResponses: Record<string, Record<string, string>> = {
  report: {
    how: "To report an issue: 1) Click 'Report Issue' 2) Select category (pothole, streetlight, water, etc.) 3) Add location and photos 4) Submit. You'll get 10 points!",
    categories:
      "We accept reports for: Potholes, Broken Streetlights, Water Issues, Train Problems, Garbage, and more.",
    points: "You earn 10 points for reporting an issue and 50 points when it's resolved!",
  },
  track: {
    how: "To track your issue: 1) Go to 'Track Complaint' 2) Enter your issue ID 3) View real-time updates and timeline",
    status: "Issue statuses: Reported → Assigned → In-Progress → Resolved → Closed",
    timeline: "You can see all updates on your issue timeline including authority assignments and status changes.",
  },
  leaderboard: {
    how: "The leaderboard shows top contributors in your city and globally. Earn points by reporting and resolving issues!",
    badges: "Earn badges for achievements like reporting 5 issues, resolving issues, and reaching point milestones.",
    rank: "Your rank is based on total points. Check your profile to see your global and city rankings.",
  },
  authority: {
    routing:
      "Issues are automatically routed to relevant authorities: Potholes→ROADS, Lights→ELECTRICITY, Water→WATER, Trains→IRCTC",
    sla: "Authorities have 48 hours to respond. If not resolved, issues escalate automatically.",
    escalation: "If an issue isn't resolved within SLA, it escalates to higher authorities for faster resolution.",
  },
  general: {
    help: "I can help you with: reporting issues, tracking complaints, understanding leaderboards, and authority routing. What would you like to know?",
    contact: "For support, contact us at support@spotit.com or call 1800-SPOTIT",
    faq: "Common questions: How do I report? How do I track? How do I earn points? How does authority routing work?",
  },
}

export const getChatbotResponse = (userMessage: string): { response: string; category: string; intent: string } => {
  const message = userMessage.toLowerCase()

  // Detect intent
  let category = "general"
  let intent = "help"

  if (message.includes("report") || message.includes("issue")) {
    category = "report"
    if (message.includes("how")) intent = "how"
    else if (message.includes("category") || message.includes("type")) intent = "categories"
    else if (message.includes("point")) intent = "points"
  } else if (message.includes("track") || message.includes("complaint")) {
    category = "track"
    if (message.includes("how")) intent = "how"
    else if (message.includes("status")) intent = "status"
    else if (message.includes("timeline")) intent = "timeline"
  } else if (message.includes("leaderboard") || message.includes("rank") || message.includes("badge")) {
    category = "leaderboard"
    if (message.includes("how")) intent = "how"
    else if (message.includes("badge")) intent = "badges"
    else if (message.includes("rank")) intent = "rank"
  } else if (message.includes("authority") || message.includes("routing") || message.includes("escalat")) {
    category = "authority"
    if (message.includes("routing")) intent = "routing"
    else if (message.includes("sla")) intent = "sla"
    else if (message.includes("escalat")) intent = "escalation"
  }

  const response = chatbotResponses[category]?.[intent] || chatbotResponses.general.help

  return { response, category, intent }
}
