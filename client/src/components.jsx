import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.js'
import { io } from 'socket.io-client'
import { apiRequest } from './api.js'
import { capitalize, getSkillId, PROFICIENCIES } from './skillUtils.js'
import { getPrimaryBadge } from './badgeUtils.js'

export function Brand() {
  return <Link className="brand" to="/" aria-label="SkillForge home">
    <span className="brand-mark">
      <svg className="brand-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </span>
    <span>Skill<span className="brand-light">Forge</span></span>
  </Link>
}

export function UserBadgePill({ badge, compact = false }) {
  if (!badge) return null
  return <span className={`user-badge-pill badge-tier-${badge.level.toLowerCase()}${compact ? ' is-compact' : ''}`} title={badge.description}>
    <span className="badge-pill-icon" aria-hidden="true">{badge.icon}</span>
    <span className="badge-pill-name">{badge.name}</span>
  </span>
}

export function Header({ compact = false }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuError, setMenuError] = React.useState('')
  const [unreadTotal, setUnreadTotal] = React.useState(0)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [theme, setTheme] = React.useState(() => {
    try {
      const stored = window.localStorage.getItem('skillforge-theme')
      return stored === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
    try { window.localStorage.setItem('skillforge-theme', theme) } catch { /* Theme still works for this session. */ }
  }, [theme])
  const apiOrigin = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const socketOrigin = apiOrigin || window.location.origin
  const userId = user?.id

  React.useEffect(() => {
    if (!userId) return undefined
    let active = true
    let refreshTimer
    const refreshUnread = async () => {
      try {
        const { conversations = [] } = await apiRequest('/conversations')
        if (active) setUnreadTotal(conversations.reduce((sum, item) => sum + (Number(item.unreadCount) || 0), 0))
      } catch {
        // A temporary unread-count failure must not break navigation.
      }
    }
    void refreshUnread()
    const socket = io(socketOrigin, { withCredentials: true })
    socket.on('user:message', () => { void refreshUnread() })
    socket.on('user:read', () => { void refreshUnread() })
    // Reconcile missed socket events after reconnects and while the tab is idle.
    socket.on('connect', () => { void refreshUnread() })
    refreshTimer = window.setInterval(() => { void refreshUnread() }, 30000)
    return () => { active = false; window.clearInterval(refreshTimer); socket.disconnect() }
  }, [userId, socketOrigin])

  async function handleSignOut() {
    setMenuError('')
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      setMenuError(error.message)
    }
  }

  const primaryBadge = user ? getPrimaryBadge(user) : null

  return <>
    <header className={`topbar${mobileNavOpen ? ' mobile-nav-open' : ''}`}>
      <Brand />
      {!compact && user && <button className="mobile-nav-toggle" type="button" aria-expanded={mobileNavOpen} aria-controls="primary-navigation" onClick={() => setMobileNavOpen((open) => !open)}><span aria-hidden="true">{mobileNavOpen ? '×' : '☰'}</span><span>{mobileNavOpen ? 'Close menu' : 'Menu'}</span></button>}
      {!compact && user && <nav id="primary-navigation" className={`main-nav${mobileNavOpen ? ' is-open' : ''}`} aria-label="Main navigation" onClick={(event) => { if (event.target.closest('a')) setMobileNavOpen(false) }}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/requests/sent">Sent requests</NavLink>
        <NavLink to="/requests/received">Received requests</NavLink>
        <NavLink to="/sessions">Sessions</NavLink>
        <NavLink to="/messages" className="messages-nav-link">Messages{unreadTotal > 0 && <span className="unread-badge" aria-label={`${unreadTotal} unread messages`}>{unreadTotal > 99 ? '99+' : unreadTotal}</span>}</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        <NavLink to="/profile">My profile</NavLink>
      </nav>}
      <div className="account-actions">
        {user ? <>
          <Link className="header-user" to="/profile" aria-label="Open your profile">
            <span className="header-avatar" aria-hidden="true">{user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
            <span className="header-user-name">{user.name.split(' ')[0]}</span>
            {primaryBadge && <span className={`header-badge-tag badge-tier-${primaryBadge.level.toLowerCase()}`} title={`${primaryBadge.name} · ${primaryBadge.description}`}>
              <span aria-hidden="true">{primaryBadge.icon}</span> <span className="header-badge-text">{primaryBadge.name}</span>
            </span>}
          </Link>
          <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span><span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
          <button className="login-button" onClick={handleSignOut}>Log out</button>
        </> : location.pathname === '/login' ? <>
          <Link className="join-button" to="/register">Sign up <ArrowIcon /></Link>
        </> : location.pathname === '/register' ? <>
          <Link className="login-button" to="/login">Log in</Link>
        </> : <>
          <Link className="login-button" to="/login">Log in</Link>
          <Link className="join-button" to="/register">Join for free <ArrowIcon /></Link>
        </>}
      </div>
    </header>
    {menuError && <div className="inline-banner error-banner" role="alert">{menuError}</div>}
  </>
}

export function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

export function LoadingScreen() {
  return <main className="loading-screen" role="status"><span className="spinner" />Loading SkillForge…</main>
}

export function FormField({ label, error, ...props }) {
  return <label className="form-field">
    <span>{label}</span>
    <input {...props} aria-invalid={Boolean(error)} />
    {error && <small className="field-error">{error}</small>}
  </label>
}

export function SkillChoices({ title, skills, entries, onChange, description, openToAnySkill, onOpenToAnyChange }) {
  const [query, setQuery] = React.useState('')
  const visibleSkills = skills.filter((skill) => (
    `${skill.name} ${skill.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  ))

  function toggleSkill(skill) {
    const exists = entries.some((entry) => getSkillId(entry.skill) === skill._id)
    onChange(exists
      ? entries.filter((entry) => getSkillId(entry.skill) !== skill._id)
      : [...entries, { skill: skill._id, proficiency: 'BEGINNER' }])
  }

  function setProficiency(skillId, proficiency) {
    onChange(entries.map((entry) => (
      getSkillId(entry.skill) === skillId ? { ...entry, proficiency } : entry
    )))
  }

  return <section className="skill-editor">
    <div className="skill-editor-heading">
      <div><h3>{title}</h3><p>{description}</p></div>
      <span className="selection-count">{entries.length} selected</span>
    </div>
    {onOpenToAnyChange && <label className="open-any-toggle">
      <input type="checkbox" checked={openToAnySkill} onChange={(event) => onOpenToAnyChange(event.target.checked)} />
      <span>Open to any skill</span>
    </label>}
    {openToAnySkill
      ? <p className="open-any-description">You are open to learning any skill another student can teach. Your saved learning preferences will be kept if you turn this off.</p>
      : <>
        <input className="skill-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the skill catalogue" aria-label={`Search ${title.toLowerCase()}`} />
        {visibleSkills.length ? <div className="skill-options">
      {visibleSkills.map((skill) => {
        const entry = entries.find((item) => getSkillId(item.skill) === skill._id)
        return <div className={`skill-option${entry ? ' is-selected' : ''}`} key={skill._id}>
          <label><input type="checkbox" checked={Boolean(entry)} onChange={() => toggleSkill(skill)} /><span>{skill.name}</span><small>{skill.category}</small></label>
          {entry && <select value={entry.proficiency} onChange={(event) => setProficiency(skill._id, event.target.value)} aria-label={`${skill.name} proficiency`}>
            {PROFICIENCIES.map((level) => <option key={level} value={level}>{capitalize(level)}</option>)}
          </select>}
        </div>
      })}
        </div> : <p className="subtle-text">No catalogue skills match that search.</p>}
      </>}
  </section>
}

export function SkillList({ entries, emptyText }) {
  if (!entries?.length) return <p className="subtle-text">{emptyText}</p>
  return <div className="skill-list">{entries.map((entry) => (
    <span className="skill-tag" key={getSkillId(entry.skill)}>
      {typeof entry.skill === 'object' ? entry.skill.name : 'Skill'}
      <small>{capitalize(entry.proficiency)}</small>
    </span>
  ))}</div>
}
