/* ────────────────────────────────────────────────────────────────────────
   Shreya Dawadi — portfolio interactions (plain JavaScript, no libraries)
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Optional form backend. Create a free form at https://formspree.io and paste
 * its endpoint (https://formspree.io/f/xxxxxxxx) here to have messages
 * delivered straight to your inbox. While this is null, the form opens the
 * visitor's own email app with the message filled in, and says so.
 */
const FORM_ENDPOINT = null
const EMAIL = 'dawadishreya1@gmail.com'

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
const root = document.documentElement

/* ── Theme toggle ─────────────────────────────────────────────────────── */
function initTheme() {
  const btn = $('#theme-toggle')
  const label = () => (root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
  const sync = () => {
    btn.setAttribute('aria-label', label())
    btn.title = label()
  }
  sync()
  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem('theme', root.dataset.theme)
    } catch (e) {
      /* private mode: the choice just won't persist */
    }
    sync()
    btn.classList.remove('spin')
    void btn.offsetWidth // restart the animation
    btn.classList.add('spin')
  })
}

/* ── Header: solid background, scroll progress, back-to-top ───────────── */
function initScroll() {
  const header = $('#site-header')
  const bar = $('#progress')
  const toTop = $('#to-top')
  let ticking = false

  const update = () => {
    ticking = false
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    header.classList.toggle('solid', y > 24)
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    toTop.classList.toggle('show', y > window.innerHeight * 1.2)
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
}

/* ── Highlight the menu item of the section in the middle of the screen ─ */
function initActiveSection() {
  const links = $$('.nav-desktop a')
  if (!('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        for (const a of links) {
          if (a.getAttribute('href') === `#${e.target.id}`) a.setAttribute('aria-current', 'true')
          else a.removeAttribute('aria-current')
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  for (const a of links) {
    const section = document.getElementById(a.getAttribute('href').slice(1))
    if (section) observer.observe(section)
  }
}

/* ── Mobile menu ──────────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn = $('#menu-toggle')
  const menu = $('#mobile-menu')

  const setOpen = (open) => {
    menu.hidden = !open
    root.classList.toggle('menu-open', open)
    btn.setAttribute('aria-expanded', String(open))
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.body.style.overflow = open ? 'hidden' : ''
  }

  btn.addEventListener('click', () => setOpen(menu.hidden))
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)))
  $('.brand').addEventListener('click', () => setOpen(false))
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) setOpen(false)
  })
  // Close it if the window grows to desktop width.
  matchMedia('(min-width: 48rem)').addEventListener('change', (e) => e.matches && setOpen(false))
}

/* ── Fade content in the first time it scrolls into view ──────────────── */
function initReveal() {
  const items = $$('.reveal')
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          observer.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  items.forEach((el) => observer.observe(el))
}

/* ── Projects: category filter + expandable details ───────────────────── */
function initProjects() {
  const ALL = 'All'
  const projects = $$('#projects .project')
  const filterBox = $('#filters')
  const count = $('#filter-count')
  const categories = [ALL, ...new Set(projects.map((p) => p.dataset.category))]
  let current = ALL

  const setExpanded = (project, open) => {
    const detail = $('.detail', project)
    detail.classList.toggle('open', open)
    $$('[aria-expanded]', project).forEach((b) => b.setAttribute('aria-expanded', String(open)))
    const text = $('.details-btn span', project)
    if (text) text.textContent = open ? 'Close details' : 'Project details'
  }
  const closeAll = () => projects.forEach((p) => setExpanded(p, false))

  // Only one project open at a time.
  projects.forEach((project) => {
    $$('[data-toggle]', project).forEach((btn) =>
      btn.addEventListener('click', () => {
        const willOpen = !$('.detail', project).classList.contains('open')
        closeAll()
        setExpanded(project, willOpen)
      }),
    )
  })

  const buttons = categories.map((c) => {
    const n = c === ALL ? projects.length : projects.filter((p) => p.dataset.category === c).length
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'label'
    b.innerHTML = `${c}<sup>${n}</sup>`
    b.addEventListener('click', () => apply(c))
    filterBox.appendChild(b)
    return b
  })

  function apply(category) {
    const changed = category !== current
    current = category
    closeAll()
    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(categories[i] === category)))
    let shown = 0
    for (const p of projects) {
      const visible = category === ALL || p.dataset.category === category
      p.hidden = !visible
      p.classList.remove('entering')
      if (visible) {
        shown++
        if (changed) {
          void p.offsetWidth
          p.classList.add('entering')
        }
      }
    }
    count.textContent = `Showing ${shown} of ${projects.length}`
  }
  apply(ALL)
}

/* ── Contact: copy email + form ───────────────────────────────────────── */
function initCopyEmail() {
  const btn = $('#copy-email')
  let timer
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      btn.classList.add('copied')
      btn.setAttribute('aria-label', 'Email address copied')
      clearTimeout(timer)
      timer = setTimeout(() => {
        btn.classList.remove('copied')
        btn.setAttribute('aria-label', 'Copy email address')
      }, 2000)
    } catch (e) {
      /* clipboard unavailable: the address is still visible and linked */
    }
  })
}

function initContactForm() {
  const form = $('#contact-form')
  const submit = $('#contact-submit')
  const submitText = $('#submit-text')
  const status = $('#form-status')
  const viaEmailApp = !FORM_ENDPOINT
  const keys = ['name', 'email', 'message']

  const idleText = viaEmailApp ? 'Continue in your email app' : 'Send message'
  const idleStatus = viaEmailApp ? 'Opens a ready-to-send email addressed to me.' : ''

  const setStatus = (text, kind = '') => {
    status.textContent = text
    status.className = `form-status ${kind}`
  }
  submitText.textContent = idleText
  setStatus(idleStatus)

  const values = () => Object.fromEntries(keys.map((k) => [k, form.elements[k].value.trim()]))

  function validate(f) {
    const errors = {}
    if (f.name.length < 2) errors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) errors.email = 'Please enter a valid email address.'
    if (f.message.length < 10) errors.message = 'Please write at least a sentence.'
    return errors
  }

  function showError(key, message) {
    const input = form.elements[key]
    const el = $(`#contact-${key}-error`)
    if (message) {
      el.textContent = message
      el.hidden = false
      input.setAttribute('aria-invalid', 'true')
      input.setAttribute('aria-describedby', el.id)
    } else {
      el.hidden = true
      input.removeAttribute('aria-invalid')
      input.removeAttribute('aria-describedby')
    }
  }

  // Clear a field's error and reset the status line as soon as the visitor edits.
  keys.forEach((k) =>
    form.elements[k].addEventListener('input', () => {
      showError(k, null)
      if (!submit.disabled) setStatus(idleStatus)
    }),
  )

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const f = values()
    const errors = validate(f)
    keys.forEach((k) => showError(k, errors[k]))
    const firstInvalid = keys.find((k) => errors[k])
    if (firstInvalid) {
      form.elements[firstInvalid].focus()
      return
    }
    if (form.elements._gotcha.value) return

    if (viaEmailApp) {
      const subject = `Portfolio enquiry from ${f.name}`
      const body = `${f.message}\n\n${f.name}\n${f.email}`
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('Your email app should now be open with the message. Press send there to deliver it.')
      return
    }

    submit.disabled = true
    submitText.textContent = 'Sending…'
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(f),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('Thank you. Your message has been sent.', 'ok')
    } catch (err) {
      setStatus(`That didn't go through. Please email me directly at ${EMAIL}.`, 'err')
    } finally {
      submit.disabled = false
      submitText.textContent = idleText
    }
  })
}

/* ── Start ────────────────────────────────────────────────────────────── */
$('#year').textContent = new Date().getFullYear()
initTheme()
initScroll()
initActiveSection()
initMobileMenu()
initReveal()
initProjects()
initCopyEmail()
initContactForm()
