export const BADGE_DEFINITIONS = {
  NOVICE: {
    id: 'skill-novice',
    name: 'Skill Novice',
    icon: '🌱',
    level: 'Bronze',
    tier: 1,
    color: '#10b981',
    description: 'Shared first skill in the Forge community',
  },
  MENTOR: {
    id: 'code-mentor',
    name: 'Code Mentor',
    icon: '⚡',
    level: 'Silver',
    tier: 2,
    color: '#06b6d4',
    description: 'Actively mentoring with 3+ skills shared',
  },
  MASTER: {
    id: 'master-swapper',
    name: 'Master Swapper',
    icon: '🏆',
    level: 'Gold',
    tier: 3,
    color: '#8b5cf6',
    description: 'Elite collaborator with multiple completed swaps',
  },
  TOP_RATED: {
    id: 'top-rated',
    name: 'Top Rated Mentor',
    icon: '🌟',
    level: 'Gold',
    tier: 3,
    color: '#f59e0b',
    description: 'Maintains an exceptional 4.5+ star rating from peers',
  },
  EXPLORER: {
    id: 'curious-explorer',
    name: 'Curious Explorer',
    icon: '🧭',
    level: 'Bronze',
    tier: 1,
    color: '#3b82f6',
    description: 'Dedicated to learning with 3+ active goals or open to any skill',
  },
  PIONEER: {
    id: 'forge-pioneer',
    name: 'Forge Pioneer',
    icon: '⚒️',
    level: 'Silver',
    tier: 2,
    color: '#14b8a6',
    description: 'Founding member shaping peer skill exchange on SkillForge',
  },
}

export function getUserBadges(user, reputation = null) {
  if (!user) return []
  const badges = []
  const teachCount = Array.isArray(user.skillsToTeach) ? user.skillsToTeach.length : 0
  const learnCount = Array.isArray(user.skillsToLearn) ? user.skillsToLearn.length : 0
  const reviewCount = Number(reputation?.reviewCount ?? user.reputation?.reviewCount ?? 0)
  const avgRating = Number(reputation?.averageRating ?? user.reputation?.averageRating ?? 0)

  // 1. Sharing Badges
  if (teachCount >= 5 || reviewCount >= 3) {
    badges.push(BADGE_DEFINITIONS.MASTER)
  }
  if (teachCount >= 3) {
    badges.push(BADGE_DEFINITIONS.MENTOR)
  }
  if (teachCount >= 1) {
    badges.push(BADGE_DEFINITIONS.NOVICE)
  }

  // 2. Reputation Badges
  if (avgRating >= 4.5 && reviewCount >= 1) {
    badges.push(BADGE_DEFINITIONS.TOP_RATED)
  }

  // 3. Learning Ambition Badges
  if (user.openToAnySkill || learnCount >= 3) {
    badges.push(BADGE_DEFINITIONS.EXPLORER)
  }

  // 4. Pioneer (awarded to all active profile holders with bio & college)
  if (user.bio && user.college) {
    badges.push(BADGE_DEFINITIONS.PIONEER)
  }

  if (badges.length === 0) {
    badges.push(BADGE_DEFINITIONS.NOVICE)
  }

  return badges
}

export function getPrimaryBadge(user, reputation = null) {
  const badges = getUserBadges(user, reputation)
  if (!badges.length) return BADGE_DEFINITIONS.NOVICE
  return badges.reduce((prev, curr) => (curr.tier > prev.tier ? curr : prev), badges[0])
}

export function getBadgeProgress(user) {
  const teachCount = Array.isArray(user?.skillsToTeach) ? user.skillsToTeach.length : 0
  if (teachCount < 1) {
    return { nextBadge: 'Skill Novice', needed: 1 - teachCount, metric: 'skill to teach' }
  }
  if (teachCount < 3) {
    return { nextBadge: 'Code Mentor', needed: 3 - teachCount, metric: 'more skills to teach' }
  }
  if (teachCount < 5) {
    return { nextBadge: 'Master Swapper', needed: 5 - teachCount, metric: 'more skills to teach or 3 completed swaps' }
  }
  return { nextBadge: 'Max Level Reached', needed: 0, metric: 'master artisan' }
}
