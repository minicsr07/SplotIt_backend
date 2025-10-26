export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}

export const validateIssueCategory = (category: string): boolean => {
  const validCategories = ["pothole", "streetlight", "water", "train", "garbage", "other"]
  return validCategories.includes(category)
}

export const validateSeverity = (severity: string): boolean => {
  const validSeverities = ["low", "medium", "high", "critical"]
  return validSeverities.includes(severity)
}

export const validateIssueStatus = (status: string): boolean => {
  const validStatuses = ["reported", "assigned", "in-progress", "resolved", "closed"]
  return validStatuses.includes(status)
}
