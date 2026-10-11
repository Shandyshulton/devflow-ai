/**
 * DevFlow AI — Application Logic
 * Iteration 5: Theme system, QA bug-reporting workflow, localStorage persistence.
 *
 * FR-01 Dashboard Overview
 * FR-02 Task Management  (status + priority editing)
 * FR-03 Requirement Breakdown
 * FR-04 Bug Tracking  (QA report form, search/filter, status update, persistence)
 * FR-05 AI Assistant (simulated)
 * FR-06 Project Progress
 * FR-07 Navigation
 */

'use strict';

/* ================================================================
   1. Sample / Seed Data
   ================================================================ */

/**
 * @typedef {{ id:number, title:string, description:string,
 *             status:'todo'|'inprogress'|'done',
 *             priority:'high'|'medium'|'low' }} Task
 */

/**
 * Extended Bug — supports both legacy sample records and user-reported QA findings.
 *
 * @typedef {{
 *   id:        number,
 *   bugId:     string,
 *   title:     string,
 *   description: string,
 *   feature:   string,
 *   steps:     string,
 *   expected:  string,
 *   actual:    string,
 *   severity:  'critical'|'high'|'medium'|'low',
 *   priority:  'high'|'medium'|'low',
 *   status:    'open'|'in-progress'|'resolved',
 *   source:    'sample'|'reported',
 *   taskId:    number|null,
 *   createdAt: string
 * }} Bug
 *
 * source:
 *   'sample'   — predefined demonstration record; not a verified defect.
 *   'reported' — manually submitted by a tester; represents an observation.
 */

/**
 * Predefined sample task data.
 * This data is for demonstration only and is not automatically discovered.
 * @type {Task[]}
 */
const SEED_TASKS = [
  { id: 1, title: 'Set up project repository',        description: 'Initialize Git repo, create branch structure, and configure .gitignore.',        status: 'done',       priority: 'high'   },
  { id: 2, title: 'Design database schema',            description: 'Define entity relationships and create the initial migration scripts.',            status: 'done',       priority: 'high'   },
  { id: 3, title: 'Implement user authentication',     description: 'Build registration, login, and password reset flows with JWT tokens.',             status: 'inprogress', priority: 'high'   },
  { id: 4, title: 'Build REST API endpoints',          description: 'Create CRUD endpoints for tasks, projects, and users following REST conventions.',  status: 'inprogress', priority: 'medium' },
  { id: 5, title: 'Develop dashboard UI',              description: 'Implement the main dashboard with stat cards and progress indicators.',             status: 'inprogress', priority: 'medium' },
  { id: 6, title: 'Write unit tests for services',     description: 'Cover core service methods with unit tests targeting 80% code coverage.',           status: 'todo',       priority: 'medium' },
  { id: 7, title: 'Integrate CI/CD pipeline',          description: 'Configure GitHub Actions for automated testing and deployment.',                    status: 'todo',       priority: 'low'    },
  { id: 8, title: 'Document API with OpenAPI/Swagger', description: 'Annotate all public endpoints and generate the API reference documentation.',       status: 'todo',       priority: 'low'    },
];

/**
 * Predefined sample bug records.
 * These are demonstration data only — not automatically discovered defects.
 * Each record is in the extended Bug shape for consistency.
 * @type {Bug[]}
 */
const SEED_BUGS = [
  {
    id: 1, bugId: 'BUG-001', taskId: 3, source: 'sample',
    title: 'Login form does not clear on error',
    description: 'After a failed login attempt the password field is not cleared, causing confusion for users.',
    feature: 'User Authentication', steps: 'Enter wrong credentials and submit the login form.',
    expected: 'Password field should clear after a failed attempt.',
    actual: 'Password field retains its value after failure.',
    severity: 'high', priority: 'high', status: 'open',
    createdAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: 2, bugId: 'BUG-002', taskId: 5, source: 'sample',
    title: 'Dashboard stats flash 0 on page load',
    description: 'Stat counters briefly display 0 before populating, producing a visible flicker on initial load.',
    feature: 'Dashboard', steps: 'Refresh the page and observe the stat cards.',
    expected: 'Stats should appear fully populated on first render.',
    actual: 'Stats show 0 for a brief moment then update.',
    severity: 'medium', priority: 'medium', status: 'in-progress',
    createdAt: '2025-01-11T10:00:00.000Z',
  },
  {
    id: 3, bugId: 'BUG-003', taskId: 5, source: 'sample',
    title: 'Filter dropdown overlaps task list',
    description: 'On viewports narrower than 400 px the status filter dropdown partially overlaps the task list.',
    feature: 'Task Management', steps: 'Resize the viewport to below 400 px and open the filter.',
    expected: 'Filter dropdown should open without overlapping content below.',
    actual: 'Dropdown overlaps the first task item.',
    severity: 'medium', priority: 'medium', status: 'open',
    createdAt: '2025-01-12T11:00:00.000Z',
  },
  {
    id: 4, bugId: 'BUG-004', taskId: 4, source: 'sample',
    title: 'API returns 500 on empty task title',
    description: 'Submitting an empty task title bypasses client validation and triggers an unhandled server error.',
    feature: 'Task Management', steps: 'Submit the add-task form with an empty title field.',
    expected: 'Client-side validation should prevent submission.',
    actual: 'Form submits and a 500 error is returned.',
    severity: 'high', priority: 'high', status: 'open',
    createdAt: '2025-01-13T08:30:00.000Z',
  },
  {
    id: 5, bugId: 'BUG-005', taskId: 5, source: 'sample',
    title: 'Progress bar exceeds 100% in edge case',
    description: 'When tasks are deleted while a status update is pending, the progress bar can exceed 100%.',
    feature: 'Project Progress', steps: 'Rapidly delete tasks and update statuses simultaneously.',
    expected: 'Progress bar should never exceed 100%.',
    actual: 'Bar exceeds 100% width in a race condition.',
    severity: 'low', priority: 'low', status: 'resolved',
    createdAt: '2025-01-14T14:00:00.000Z',
  },
  {
    id: 6, bugId: 'BUG-006', taskId: null, source: 'sample',
    title: 'Sidebar does not close on route change',
    description: 'On mobile devices, the sidebar stays open after navigating to a new section.',
    feature: 'Navigation', steps: 'Open the sidebar on mobile, then tap a nav item.',
    expected: 'Sidebar should close after navigation.',
    actual: 'Sidebar stays open.',
    severity: 'low', priority: 'low', status: 'resolved',
    createdAt: '2025-01-15T09:15:00.000Z',
  },
];

/* ================================================================
   2. Application State
   ================================================================ */

const AppState = {
  /** @type {'dashboard'|'tasks'|'bugs'|'assistant'} */
  activeSection: 'dashboard',

  /** @type {Task[]} */
  tasks: SEED_TASKS.map(t => Object.assign({}, t)),

  /**
   * Combined bug list: seed records + user-reported records from localStorage.
   * @type {Bug[]}
   */
  bugs: [],

  /** Running ID counter for new tasks */
  nextTaskId: SEED_TASKS.length + 1,

  /** Running numeric counter for user-reported bugs */
  nextBugNum: SEED_BUGS.length + 1,

  /** Task filter values */
  filter: { status: 'all', priority: 'all' },

  /** Bug filter/search values */
  bugFilter: { search: '', status: 'all', severity: 'all', priority: 'all' },

  /** Bug being viewed in detail modal (null when closed) */
  activeBugId: /** @type {number|null} */ (null),
};

/* ================================================================
   3. localStorage Persistence
   ================================================================ */

const LS_KEYS = {
  REPORTED_BUGS: 'devflow-reported-bugs',
  THEME:         'devflow-theme',
};

/**
 * Load user-reported bugs from localStorage.
 * Returns an empty array on parse error or unavailability.
 * @returns {Bug[]}
 */
function loadReportedBugs() {
  try {
    const raw = localStorage.getItem(LS_KEYS.REPORTED_BUGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Basic shape validation
    return parsed.filter(b =>
      typeof b === 'object' &&
      b !== null &&
      typeof b.id === 'number' &&
      typeof b.title === 'string' &&
      b.source === 'reported'
    );
  } catch (_) {
    return [];
  }
}

/**
 * Persist all user-reported bugs to localStorage.
 */
function saveReportedBugs() {
  try {
    const reported = AppState.bugs.filter(b => b.source === 'reported');
    localStorage.setItem(LS_KEYS.REPORTED_BUGS, JSON.stringify(reported));
  } catch (_) { /* localStorage unavailable */ }
}

/**
 * Initialise AppState.bugs from seed data + localStorage, avoiding duplicates.
 */
function initBugData() {
  const reported = loadReportedBugs();
  AppState.bugs = [
    ...SEED_BUGS.map(b => Object.assign({}, b)),
    ...reported,
  ];
  // Ensure nextBugNum is beyond any existing reported bug IDs
  const maxId = AppState.bugs.reduce((m, b) => Math.max(m, b.id), 0);
  AppState.nextBugNum = maxId + 1;
}

/* ================================================================
   4. Section Configuration
   ================================================================ */

const SECTIONS = {
  dashboard: { label: 'Dashboard',    sectionId: 'section-dashboard' },
  tasks:     { label: 'Tasks',        sectionId: 'section-tasks'     },
  bugs:      { label: 'Bug Tracking', sectionId: 'section-bugs'      },
  assistant: { label: 'AI Assistant', sectionId: 'section-assistant' },
};

/* ================================================================
   5. Utility Helpers
   ================================================================ */

/** @param {string} str @returns {string} */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {HTMLElement|null} el @param {boolean} visible */
function setVisible(el, visible) {
  if (!el) return;
  el.hidden = !visible;
}

/** @type {number|undefined} */
let _toastTimer;

/**
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.hidden = false;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
}

/* ================================================================
   6. Theme System
   ================================================================ */

/**
 * Apply a theme by setting data-theme on <html> and persisting to localStorage.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Update meta theme-color for mobile browser chrome
  const metaTheme = document.getElementById('meta-theme-color');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'light' ? '#ffffff' : '#14172a');
  }

  // Sync all theme toggle buttons
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    const isLight = theme === 'light';
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  });

  try {
    localStorage.setItem(LS_KEYS.THEME, theme);
  } catch (_) { /* localStorage unavailable */ }
}

/**
 * Toggle between dark and light.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  // Restore saved theme (also applied early via inline script in <head>)
  let saved = 'dark';
  try {
    const v = localStorage.getItem(LS_KEYS.THEME);
    if (v === 'light' || v === 'dark') saved = v;
  } catch (_) { /* use default */ }

  applyTheme(/** @type {'dark'|'light'} */ (saved));

  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);
}

/* ================================================================
   7. Navigation  (FR-07)
   ================================================================ */

function navigateTo(sectionKey) {
  if (!SECTIONS[sectionKey]) return;

  Object.values(SECTIONS).forEach(({ sectionId }) => {
    const el = document.getElementById(sectionId);
    if (el) el.classList.add('section--hidden');
  });

  const target = document.getElementById(SECTIONS[sectionKey].sectionId);
  if (target) target.classList.remove('section--hidden');

  document.querySelectorAll('.nav-item').forEach((btn) => {
    const isActive = btn.dataset.section === sectionKey;
    btn.classList.toggle('nav-item--active', isActive);
    btn.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  const topbarTitle = document.getElementById('topbarTitle');
  if (topbarTitle) topbarTitle.textContent = SECTIONS[sectionKey].label;

  AppState.activeSection = sectionKey;
  closeSidebar();
}

function initNavigation() {
  document.querySelectorAll('.nav-item[data-section]').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  const viewAll = document.getElementById('viewAllTasks');
  if (viewAll) viewAll.addEventListener('click', () => navigateTo('tasks'));
}

/* ================================================================
   8. Mobile Sidebar
   ================================================================ */

let sidebarBackdrop = null;

function createSidebarBackdrop() {
  sidebarBackdrop = document.createElement('div');
  sidebarBackdrop.className = 'sidebar-backdrop';
  sidebarBackdrop.setAttribute('aria-hidden', 'true');
  sidebarBackdrop.addEventListener('click', closeSidebar);
  document.body.appendChild(sidebarBackdrop);
}

function openSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (sidebar) sidebar.classList.add('sidebar--open');
  if (sidebarBackdrop) sidebarBackdrop.classList.add('sidebar-backdrop--visible');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (sidebar) sidebar.classList.remove('sidebar--open');
  if (sidebarBackdrop) sidebarBackdrop.classList.remove('sidebar-backdrop--visible');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

function initMobileSidebar() {
  createSidebarBackdrop();
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const isOpen = sidebar && sidebar.classList.contains('sidebar--open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
}

/* ================================================================
   9. Project Progress  (FR-06)
   ================================================================ */

function renderProgress() {
  const tasks = AppState.tasks;
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'inprogress').length;
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));

  const fill = document.getElementById('progress-fill');
  const pctEl = document.getElementById('progress-pct');
  const bar   = fill && fill.closest('[role="progressbar"]');
  const note  = document.getElementById('progress-note');

  if (fill)  fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
  if (bar)   bar.setAttribute('aria-valuenow', String(pct));
  if (note) {
    note.textContent = total === 0
      ? 'No tasks yet.'
      : `${done} of ${total} task${total !== 1 ? 's' : ''} completed.`;
  }

  // Open bugs = bugs with status 'open' (not 'in-progress' or 'resolved')
  const openBugs = AppState.bugs.filter(b => b.status === 'open').length;

  /** @param {string} id @param {number} value @param {string} label */
  function setStat(id, value, label) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = String(value);
    el.setAttribute('aria-label', `${label}: ${value}`);
  }

  setStat('stat-total',      total,      'Total tasks');
  setStat('stat-done',       done,        'Completed tasks');
  setStat('stat-inprogress', inProgress, 'Tasks in progress');
  setStat('stat-bugs',       openBugs,   'Open bugs');
}

/* ================================================================
   10. Dashboard  (FR-01)
   ================================================================ */

function renderDashboardTasks() {
  const list  = document.getElementById('dashboard-task-list');
  const empty = document.getElementById('dashboard-empty');
  if (!list) return;

  const tasks = AppState.tasks.slice(-5).reverse();
  setVisible(empty, tasks.length === 0);

  list.innerHTML = tasks.map(task => buildTaskItemHTML(task, true)).join('');
  list.querySelectorAll('select[data-action="status"]').forEach(attachStatusSelectListener);
  list.querySelectorAll('select[data-action="priority"]').forEach(attachPrioritySelectListener);
}

function initDashboard() {
  renderProgress();
  renderDashboardTasks();
}

/* ================================================================
   11. Task Item HTML Builder
   ================================================================ */

const STATUS_LABELS   = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };
const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

/**
 * @param {Task} task
 * @param {boolean} compact
 * @returns {string}
 */
function buildTaskItemHTML(task, compact = false) {
  const descHTML = (!compact && task.description)
    ? `<p class="task-item__desc">${escHtml(task.description)}</p>`
    : '';

  return `
    <li class="task-item" data-task-id="${task.id}">
      <div class="task-item__body">
        <p class="task-item__title">${escHtml(task.title)}</p>
        ${descHTML}
        <div class="task-item__meta">
          <span class="badge badge--${task.status}">${escHtml(STATUS_LABELS[task.status] || task.status)}</span>
          <span class="badge badge--${task.priority}">${escHtml(PRIORITY_LABELS[task.priority] || task.priority)}</span>
        </div>
      </div>
      <div class="task-item__actions">
        <label class="sr-only" for="status-${task.id}">Change status for ${escHtml(task.title)}</label>
        <select id="status-${task.id}" data-task-id="${task.id}" data-action="status" aria-label="Change status">
          <option value="todo"       ${task.status === 'todo'       ? 'selected' : ''}>To Do</option>
          <option value="inprogress" ${task.status === 'inprogress' ? 'selected' : ''}>In Progress</option>
          <option value="done"       ${task.status === 'done'       ? 'selected' : ''}>Done</option>
        </select>
        <label class="sr-only" for="priority-${task.id}">Change priority for ${escHtml(task.title)}</label>
        <select id="priority-${task.id}" data-task-id="${task.id}" data-action="priority" aria-label="Change priority">
          <option value="high"   ${task.priority === 'high'   ? 'selected' : ''}>High</option>
          <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="low"    ${task.priority === 'low'    ? 'selected' : ''}>Low</option>
        </select>
      </div>
    </li>`;
}

/** @param {HTMLSelectElement} select */
function attachStatusSelectListener(select) {
  select.addEventListener('change', () => {
    const id     = Number(select.dataset.taskId);
    const task   = AppState.tasks.find(t => t.id === id);
    const newVal = /** @type {Task['status']} */ (select.value);
    if (!task || task.status === newVal) return;
    task.status = newVal;
    renderProgress();
    renderDashboardTasks();
    renderTaskList();
    showToast(`Status updated to "${STATUS_LABELS[newVal]}"`, 'success');
  });
}

/** @param {HTMLSelectElement} select */
function attachPrioritySelectListener(select) {
  select.addEventListener('change', () => {
    const id     = Number(select.dataset.taskId);
    const task   = AppState.tasks.find(t => t.id === id);
    const newVal = /** @type {Task['priority']} */ (select.value);
    if (!task || task.priority === newVal) return;
    task.priority = newVal;
    renderDashboardTasks();
    renderTaskList();
    showToast(`Priority updated to "${PRIORITY_LABELS[newVal]}"`, 'success');
  });
}

/* ================================================================
   12. Task Management  (FR-02)
   ================================================================ */

function renderTaskList() {
  const list  = document.getElementById('task-list');
  const empty = document.getElementById('tasks-empty');
  if (!list) return;

  const { status, priority } = AppState.filter;
  const filtered = AppState.tasks.filter(task => {
    if (status   !== 'all' && task.status   !== status)   return false;
    if (priority !== 'all' && task.priority !== priority) return false;
    return true;
  });

  setVisible(empty, filtered.length === 0);
  list.innerHTML = filtered.map(t => buildTaskItemHTML(t, false)).join('');
  list.querySelectorAll('select[data-action="status"]').forEach(attachStatusSelectListener);
  list.querySelectorAll('select[data-action="priority"]').forEach(attachPrioritySelectListener);
}

function initTasks() {
  renderTaskList();

  const filterStatus   = document.getElementById('filterStatus');
  const filterPriority = document.getElementById('filterPriority');
  const clearFilters   = document.getElementById('clearFilters');

  if (filterStatus) {
    filterStatus.addEventListener('change', () => {
      AppState.filter.status = filterStatus.value;
      renderTaskList();
    });
  }

  if (filterPriority) {
    filterPriority.addEventListener('change', () => {
      AppState.filter.priority = filterPriority.value;
      renderTaskList();
    });
  }

  if (clearFilters) {
    clearFilters.addEventListener('click', () => {
      AppState.filter = { status: 'all', priority: 'all' };
      if (filterStatus)   filterStatus.value   = 'all';
      if (filterPriority) filterPriority.value = 'all';
      renderTaskList();
    });
  }

  const openBtn = document.getElementById('openAddTask');
  if (openBtn) openBtn.addEventListener('click', openAddTaskModal);

  const closeBtn  = document.getElementById('closeAddTask');
  const cancelBtn = document.getElementById('cancelAddTask');
  const overlay   = document.getElementById('modal-addTask');

  if (closeBtn)  closeBtn.addEventListener('click',  closeAddTaskModal);
  if (cancelBtn) cancelBtn.addEventListener('click',  closeAddTaskModal);
  if (overlay)   overlay.addEventListener('click', e => { if (e.target === overlay) closeAddTaskModal(); });

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal-addTask');
    if (e.key === 'Escape' && modal && !modal.hidden) closeAddTaskModal();
  });

  const form = document.getElementById('addTaskForm');
  if (form) form.addEventListener('submit', handleAddTask);
}

function openAddTaskModal() {
  const modal = document.getElementById('modal-addTask');
  if (!modal) return;
  modal.hidden = false;
  const form = document.getElementById('addTaskForm');
  if (form) form.reset();
  hideError('taskTitleError', 'taskTitle');
  const titleInput = document.getElementById('taskTitle');
  if (titleInput) setTimeout(() => titleInput.focus(), 50);
}

function closeAddTaskModal() {
  const modal = document.getElementById('modal-addTask');
  if (modal) modal.hidden = true;
  document.getElementById('openAddTask')?.focus();
}

/** @param {SubmitEvent} e */
function handleAddTask(e) {
  e.preventDefault();
  const titleInput = /** @type {HTMLInputElement}    */ (document.getElementById('taskTitle'));
  const descInput  = /** @type {HTMLTextAreaElement} */ (document.getElementById('taskDesc'));
  const statusSel  = /** @type {HTMLSelectElement}   */ (document.getElementById('taskStatus'));
  const pSel       = /** @type {HTMLSelectElement}   */ (document.getElementById('taskPriority'));

  const title = titleInput ? titleInput.value.trim() : '';
  if (!title) {
    showError('taskTitleError', 'taskTitle');
    if (titleInput) titleInput.focus();
    return;
  }
  hideError('taskTitleError', 'taskTitle');

  /** @type {Task} */
  const newTask = {
    id:          AppState.nextTaskId++,
    title,
    description: descInput  ? descInput.value.trim()  : '',
    status:      /** @type {Task['status']} */   (statusSel ? statusSel.value   : 'todo'),
    priority:    /** @type {Task['priority']} */ (pSel      ? pSel.value        : 'medium'),
  };

  AppState.tasks.push(newTask);
  closeAddTaskModal();
  renderTaskList();
  renderDashboardTasks();
  renderProgress();
  showToast('Task added successfully.', 'success');
}

/** @param {string} errorId @param {string} inputId */
function showError(errorId, inputId) {
  const errEl   = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);
  if (errEl)   errEl.hidden = false;
  if (inputEl) inputEl.classList.add('form-input--error');
}

/** @param {string} errorId @param {string} inputId */
function hideError(errorId, inputId) {
  const errEl   = document.getElementById(errorId);
  const inputEl = document.getElementById(inputId);
  if (errEl)   errEl.hidden = true;
  if (inputEl) inputEl.classList.remove('form-input--error', 'form-textarea--error');
}

/* ================================================================
   13. Bug Tracking — Data Labels  (FR-04)
   ================================================================ */

const BUG_STATUS_LABELS = {
  'open':        'Open',
  'in-progress': 'In Progress',
  'resolved':    'Resolved',
};

const SEVERITY_LABELS = {
  critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
};

/* ================================================================
   14. Bug List Rendering
   ================================================================ */

/**
 * Apply current bug filters and search to AppState.bugs.
 * @returns {Bug[]}
 */
function getFilteredBugs() {
  const { search, status, severity, priority } = AppState.bugFilter;
  const q = search.trim().toLowerCase();

  return AppState.bugs.filter(bug => {
    if (q) {
      const matchTitle = bug.title.toLowerCase().includes(q);
      const matchId    = bug.bugId.toLowerCase().includes(q);
      if (!matchTitle && !matchId) return false;
    }
    if (status   !== 'all' && bug.status   !== status)   return false;
    if (severity !== 'all' && bug.severity !== severity) return false;
    if (priority !== 'all' && bug.priority !== priority) return false;
    return true;
  });
}

/**
 * Build the HTML for a single bug list item.
 * @param {Bug} bug
 * @returns {string}
 */
function buildBugItemHTML(bug) {
  const relatedTask = bug.taskId != null
    ? AppState.tasks.find(t => t.id === bug.taskId)
    : null;

  const taskRefHTML = relatedTask
    ? `<p class="bug-item__task-ref">Related task: <span class="bug-item__task-name">${escHtml(relatedTask.title)}</span></p>`
    : '';

  const sourceLabel = bug.source === 'sample'
    ? `<span class="badge badge--sample">Demo</span>`
    : `<span class="badge badge--reported">Reported</span>`;

  return `
  <li class="bug-item bug-item--${escHtml(bug.severity)}"
      data-bug-id="${bug.id}"
      tabindex="0"
      role="button"
      aria-label="View details for bug ${escHtml(bug.bugId)}: ${escHtml(bug.title)}">
    <div class="bug-item__content">
      <div class="bug-item__header">
        <span class="bug-item__id">${escHtml(bug.bugId)}</span>
        <span class="bug-item__title">${escHtml(bug.title)}</span>
      </div>
      <p class="bug-item__desc">${escHtml(bug.description)}</p>
      <div class="bug-item__meta">
        <span class="bug-item__feature">📄 ${escHtml(bug.feature || '—')}</span>
        ${taskRefHTML}
      </div>
    </div>
    <div class="bug-item__badges">
      ${sourceLabel}
      <span class="badge badge--${escHtml(bug.severity)}">${escHtml(SEVERITY_LABELS[bug.severity] || bug.severity)}</span>
      <span class="badge badge--${escHtml(bug.priority)}">${escHtml(PRIORITY_LABELS[bug.priority] || bug.priority)}</span>
      <span class="badge badge--${escHtml(bug.status)}">${escHtml(BUG_STATUS_LABELS[bug.status] || bug.status)}</span>
      <label class="sr-only" for="bug-status-${bug.id}">Update status for ${escHtml(bug.bugId)}</label>
      <select class="bug-item__status-select" id="bug-status-${bug.id}"
        data-bug-id="${bug.id}" aria-label="Update bug status">
        <option value="open"        ${bug.status === 'open'        ? 'selected' : ''}>Open</option>
        <option value="in-progress" ${bug.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
        <option value="resolved"    ${bug.status === 'resolved'    ? 'selected' : ''}>Resolved</option>
      </select>
    </div>
  </li>`;
}

function renderBugList() {
  const list  = document.getElementById('bug-list');
  const empty = document.getElementById('bugs-empty');
  if (!list) return;

  const filtered = getFilteredBugs();
  setVisible(empty, filtered.length === 0);
  list.innerHTML = filtered.map(buildBugItemHTML).join('');

  // Wire status-change selects
  list.querySelectorAll('select[data-bug-id]').forEach(sel => {
    sel.addEventListener('change', (e) => {
      e.stopPropagation(); // prevent click-on-item from firing detail modal
      const bugId  = Number(/** @type {HTMLElement} */ (sel).dataset.bugId);
      const bug    = AppState.bugs.find(b => b.id === bugId);
      const newVal = /** @type {Bug['status']} */ (/** @type {HTMLSelectElement} */ (sel).value);
      if (!bug || bug.status === newVal) return;
      bug.status = newVal;
      if (bug.source === 'reported') saveReportedBugs();
      renderBugList();
      renderProgress();
      showToast(`Bug status updated to "${BUG_STATUS_LABELS[newVal]}"`, 'success');
    });
  });

  // Wire click-on-item to open detail modal (ignore select clicks)
  list.querySelectorAll('.bug-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (/** @type {HTMLElement} */ (e.target).closest('select')) return;
      const bugId = Number(/** @type {HTMLElement} */ (item).dataset.bugId);
      openBugDetail(bugId);
    });
    // Keyboard activation
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const bugId = Number(/** @type {HTMLElement} */ (item).dataset.bugId);
        openBugDetail(bugId);
      }
    });
  });
}

/* ================================================================
   15. Bug Search & Filters
   ================================================================ */

function initBugFilters() {
  const searchInput  = document.getElementById('bugSearch');
  const statusSel    = document.getElementById('bugFilterStatus');
  const severitySel  = document.getElementById('bugFilterSeverity');
  const prioritySel  = document.getElementById('bugFilterPriority');
  const clearBtn     = document.getElementById('clearBugFilters');

  const update = () => renderBugList();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      AppState.bugFilter.search = /** @type {HTMLInputElement} */ (searchInput).value;
      update();
    });
  }

  if (statusSel) {
    statusSel.addEventListener('change', () => {
      AppState.bugFilter.status = /** @type {HTMLSelectElement} */ (statusSel).value;
      update();
    });
  }

  if (severitySel) {
    severitySel.addEventListener('change', () => {
      AppState.bugFilter.severity = /** @type {HTMLSelectElement} */ (severitySel).value;
      update();
    });
  }

  if (prioritySel) {
    prioritySel.addEventListener('change', () => {
      AppState.bugFilter.priority = /** @type {HTMLSelectElement} */ (prioritySel).value;
      update();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      AppState.bugFilter = { search: '', status: 'all', severity: 'all', priority: 'all' };
      if (searchInput)  /** @type {HTMLInputElement} */ (searchInput).value     = '';
      if (statusSel)    /** @type {HTMLSelectElement} */ (statusSel).value    = 'all';
      if (severitySel)  /** @type {HTMLSelectElement} */ (severitySel).value  = 'all';
      if (prioritySel)  /** @type {HTMLSelectElement} */ (prioritySel).value  = 'all';
      update();
    });
  }
}

/* ================================================================
   16. Bug Detail Modal
   ================================================================ */

/**
 * @param {number} bugId
 */
function openBugDetail(bugId) {
  const bug   = AppState.bugs.find(b => b.id === bugId);
  const modal = document.getElementById('modal-bugDetail');
  const body  = document.getElementById('bugDetailBody');
  if (!bug || !modal || !body) return;

  AppState.activeBugId = bugId;

  const relatedTask = bug.taskId != null
    ? AppState.tasks.find(t => t.id === bug.taskId)
    : null;

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch (_) { return iso; }
  };

  body.innerHTML = `
    <div class="bug-detail-grid">
      <div class="bug-detail-field">
        <span class="bug-detail-label">Bug ID</span>
        <span class="bug-detail-value">${escHtml(bug.bugId)}</span>
      </div>
      <div class="bug-detail-field">
        <span class="bug-detail-label">Source</span>
        <span class="bug-detail-value">
          ${bug.source === 'sample'
            ? '<span class="badge badge--sample">Demo data</span>'
            : '<span class="badge badge--reported">User-reported finding</span>'}
        </span>
      </div>
      <div class="bug-detail-field bug-detail-field--full">
        <span class="bug-detail-label">Title</span>
        <span class="bug-detail-value">${escHtml(bug.title)}</span>
      </div>
      <div class="bug-detail-field bug-detail-field--full">
        <span class="bug-detail-label">Description</span>
        <span class="bug-detail-value">${escHtml(bug.description)}</span>
      </div>
      <div class="bug-detail-field">
        <span class="bug-detail-label">Related Feature</span>
        <span class="bug-detail-value">${escHtml(bug.feature || '—')}</span>
      </div>
      <div class="bug-detail-field">
        <span class="bug-detail-label">Related Task</span>
        <span class="bug-detail-value">${relatedTask ? escHtml(relatedTask.title) : '<span class="bug-detail-value--muted">None</span>'}</span>
      </div>
      ${bug.steps ? `
      <div class="bug-detail-field bug-detail-field--full">
        <span class="bug-detail-label">Steps to Reproduce</span>
        <span class="bug-detail-value">${escHtml(bug.steps)}</span>
      </div>` : ''}
      ${bug.expected ? `
      <div class="bug-detail-field">
        <span class="bug-detail-label">Expected Result</span>
        <span class="bug-detail-value">${escHtml(bug.expected)}</span>
      </div>` : ''}
      ${bug.actual ? `
      <div class="bug-detail-field">
        <span class="bug-detail-label">Actual Result</span>
        <span class="bug-detail-value">${escHtml(bug.actual)}</span>
      </div>` : ''}
      <div class="bug-detail-field">
        <span class="bug-detail-label">Severity</span>
        <span class="bug-detail-value"><span class="badge badge--${escHtml(bug.severity)}">${escHtml(SEVERITY_LABELS[bug.severity] || bug.severity)}</span></span>
      </div>
      <div class="bug-detail-field">
        <span class="bug-detail-label">Priority</span>
        <span class="bug-detail-value"><span class="badge badge--${escHtml(bug.priority)}">${escHtml(PRIORITY_LABELS[bug.priority] || bug.priority)}</span></span>
      </div>
      <div class="bug-detail-field">
        <span class="bug-detail-label">Reported</span>
        <span class="bug-detail-value">${escHtml(fmtDate(bug.createdAt))}</span>
      </div>
      <div class="bug-detail-field">
        <span class="bug-detail-label">Current Status</span>
        <span class="bug-detail-value" id="detail-status-badge">
          <span class="badge badge--${escHtml(bug.status)}">${escHtml(BUG_STATUS_LABELS[bug.status] || bug.status)}</span>
        </span>
      </div>
      <div class="bug-detail-status-row">
        <label class="bug-detail-label" for="detail-status-select">Update Status</label>
        <select class="form-select" id="detail-status-select" style="width:auto">
          <option value="open"        ${bug.status === 'open'        ? 'selected' : ''}>Open</option>
          <option value="in-progress" ${bug.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="resolved"    ${bug.status === 'resolved'    ? 'selected' : ''}>Resolved</option>
        </select>
        <button class="btn btn--primary btn--sm" id="detail-status-save" type="button">Save</button>
      </div>
    </div>`;

  // Wire status update inside detail view
  document.getElementById('detail-status-save')?.addEventListener('click', () => {
    const sel    = /** @type {HTMLSelectElement|null} */ (document.getElementById('detail-status-select'));
    const newVal = /** @type {Bug['status']} */ (sel ? sel.value : bug.status);
    if (newVal !== bug.status) {
      bug.status = newVal;
      if (bug.source === 'reported') saveReportedBugs();
      renderBugList();
      renderProgress();
      showToast(`Bug status updated to "${BUG_STATUS_LABELS[newVal]}"`, 'success');
      // Update badge in detail without closing modal
      const badge = document.getElementById('detail-status-badge');
      if (badge) badge.innerHTML = `<span class="badge badge--${escHtml(newVal)}">${escHtml(BUG_STATUS_LABELS[newVal] || newVal)}</span>`;
    }
  });

  modal.hidden = false;
  document.getElementById('closeBugDetail')?.focus();
}

function closeBugDetail() {
  const modal = document.getElementById('modal-bugDetail');
  if (modal) modal.hidden = true;
  AppState.activeBugId = null;
  document.getElementById('openReportBug')?.focus();
}

/* ================================================================
   17. Report Bug Modal
   ================================================================ */

function openReportBugModal() {
  const modal = document.getElementById('modal-reportBug');
  if (!modal) return;
  modal.hidden = false;
  const form = document.getElementById('reportBugForm');
  if (form) form.reset();
  ['bugTitleError','bugDescError','bugFeatureError','bugSeverityError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  ['bugTitle','bugDesc','bugFeature','bugSeverity'].forEach(id => {
    document.getElementById(id)?.classList.remove('form-input--error', 'form-textarea--error', 'form-select--error');
  });
  setTimeout(() => document.getElementById('bugTitle')?.focus(), 50);
}

function closeReportBugModal() {
  const modal = document.getElementById('modal-reportBug');
  if (modal) modal.hidden = true;
  document.getElementById('openReportBug')?.focus();
}

/** @param {SubmitEvent} e */
function handleReportBug(e) {
  e.preventDefault();

  const titleInput    = /** @type {HTMLInputElement}    */ (document.getElementById('bugTitle'));
  const descInput     = /** @type {HTMLTextAreaElement} */ (document.getElementById('bugDesc'));
  const featureInput  = /** @type {HTMLInputElement}    */ (document.getElementById('bugFeature'));
  const stepsInput    = /** @type {HTMLTextAreaElement} */ (document.getElementById('bugSteps'));
  const expectedInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('bugExpected'));
  const actualInput   = /** @type {HTMLTextAreaElement} */ (document.getElementById('bugActual'));
  const severitySel   = /** @type {HTMLSelectElement}   */ (document.getElementById('bugSeverity'));
  const prioritySel   = /** @type {HTMLSelectElement}   */ (document.getElementById('bugPriority'));
  const statusSel     = /** @type {HTMLSelectElement}   */ (document.getElementById('bugStatus'));

  const title    = titleInput   ? titleInput.value.trim()   : '';
  const desc     = descInput    ? descInput.value.trim()    : '';
  const feature  = featureInput ? featureInput.value.trim() : '';
  const severity = severitySel  ? severitySel.value         : '';

  let valid = true;

  if (!title) {
    showBugFieldError('bugTitleError', 'bugTitle');
    valid = false;
  } else hideBugFieldError('bugTitleError', 'bugTitle');

  if (!desc) {
    showBugFieldError('bugDescError', 'bugDesc');
    valid = false;
  } else hideBugFieldError('bugDescError', 'bugDesc');

  if (!feature) {
    showBugFieldError('bugFeatureError', 'bugFeature');
    valid = false;
  } else hideBugFieldError('bugFeatureError', 'bugFeature');

  if (!severity) {
    showBugFieldError('bugSeverityError', 'bugSeverity');
    valid = false;
  } else hideBugFieldError('bugSeverityError', 'bugSeverity');

  if (!valid) {
    // Focus first errored field
    const first = ['bugTitle','bugDesc','bugFeature','bugSeverity'].find(id => {
      const el = document.getElementById(id);
      return el && (el.classList.contains('form-input--error') || el.classList.contains('form-textarea--error'));
    });
    if (first) document.getElementById(first)?.focus();
    return;
  }

  const numPad = String(AppState.nextBugNum).padStart(3, '0');
  const bugId  = `BUG-${numPad}`;

  /** @type {Bug} */
  const newBug = {
    id:          AppState.nextBugNum++,
    bugId,
    title,
    description: desc,
    feature,
    steps:       stepsInput    ? stepsInput.value.trim()    : '',
    expected:    expectedInput ? expectedInput.value.trim() : '',
    actual:      actualInput   ? actualInput.value.trim()   : '',
    severity:    /** @type {Bug['severity']} */ (severity),
    priority:    /** @type {Bug['priority']} */ (prioritySel ? prioritySel.value : 'medium'),
    status:      /** @type {Bug['status']} */   (statusSel   ? statusSel.value   : 'open'),
    source:      'reported',
    taskId:      null,
    createdAt:   new Date().toISOString(),
  };

  AppState.bugs.push(newBug);
  saveReportedBugs();
  closeReportBugModal();
  renderBugList();
  renderProgress();
  showToast(`Bug ${bugId} submitted.`, 'success');
}

/** @param {string} errorId @param {string} fieldId */
function showBugFieldError(errorId, fieldId) {
  const el    = document.getElementById(errorId);
  const field = document.getElementById(fieldId);
  if (el)    el.hidden = false;
  if (field) {
    const tag = field.tagName;
    const cls = tag === 'TEXTAREA' ? 'form-textarea--error'
              : tag === 'SELECT'   ? 'form-select--error'
              : 'form-input--error';
    field.classList.add(cls);
  }
}

/** @param {string} errorId @param {string} fieldId */
function hideBugFieldError(errorId, fieldId) {
  const el    = document.getElementById(errorId);
  const field = document.getElementById(fieldId);
  if (el)    el.hidden = true;
  if (field) field.classList.remove('form-input--error', 'form-textarea--error', 'form-select--error');
}

/* ================================================================
   18. Bug Tracking Init
   ================================================================ */

function initBugTracking() {
  renderBugList();
  initBugFilters();

  // Open Report Bug modal
  document.getElementById('openReportBug')?.addEventListener('click', openReportBugModal);

  // Close Report Bug modal
  document.getElementById('closeReportBug')?.addEventListener('click',  closeReportBugModal);
  document.getElementById('cancelReportBug')?.addEventListener('click', closeReportBugModal);

  const reportOverlay = document.getElementById('modal-reportBug');
  if (reportOverlay) {
    reportOverlay.addEventListener('click', e => { if (e.target === reportOverlay) closeReportBugModal(); });
  }

  // Report Bug form submit
  document.getElementById('reportBugForm')?.addEventListener('submit', handleReportBug);

  // Close Bug Detail modal
  document.getElementById('closeBugDetail')?.addEventListener('click', closeBugDetail);

  const detailOverlay = document.getElementById('modal-bugDetail');
  if (detailOverlay) {
    detailOverlay.addEventListener('click', e => { if (e.target === detailOverlay) closeBugDetail(); });
  }

  // Escape closes whichever modal is open
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const report = document.getElementById('modal-reportBug');
    if (report && !report.hidden) { closeReportBugModal(); return; }
    const detail = document.getElementById('modal-bugDetail');
    if (detail && !detail.hidden) { closeBugDetail(); return; }
  });
}

/* ================================================================
   19. AI Assistant — Simulated Response Engine  (FR-03, FR-05)
   ================================================================ */

const AI_RULES = [
  { test: /\b(hello|hi|hey|greet)/i,                  response: "Hello! I'm the DevFlow AI Assistant. I can help you plan tasks, break down requirements, and prioritize your work. What would you like help with today?" },
  { test: /\b(help|what can you do|capabilities)/i,   response: "I can assist you with:\n• Breaking down project requirements into smaller tasks\n• Suggesting task priorities based on project goals\n• Recommending a workflow for common development scenarios\n• Answering general questions about task planning\n\nTry asking: \"How do I prioritize my tasks?\" or \"Break down user authentication.\"" },
  { test: /\b(priorit|urgent|important|order|rank)/i, response: "A common prioritization approach:\n\n1. High — Security fixes, blocking bugs, critical features.\n2. Medium — Core development and integrations.\n3. Low — Refactoring, documentation, non-blocking enhancements.\n\nConsider MoSCoW (Must / Should / Could / Won't) for backlog triage." },
  { test: /\b(bug|fix|defect|issue|error)/i,          response: "For bug management:\n\n1. Reproduce the bug consistently before changing code.\n2. Write a failing test that captures the defect.\n3. Fix until the test passes.\n4. Verify no regressions are introduced.\n5. Update bug status to Resolved and document the root cause." },
  { test: /\b(breakdown|break.?down|decompos|split|requirement)/i, response: "Use the Requirement Breakdown tab to decompose a requirement into tasks. In general:\n\n1. Identify the user action.\n2. List backend tasks: endpoint, validation, database.\n3. List frontend tasks: UI, state, error handling.\n4. Add cross-cutting tasks: tests, docs, accessibility." },
  { test: /\b(progress|status|track|monitor)/i,       response: "To track progress:\n\n• Keep task statuses up to date (To Do → In Progress → Done).\n• Review the Dashboard daily.\n• No task should stay In Progress for more than 2–3 days — break it down further if needed." },
  { test: /\b(plan|planning|sprint|iteration|roadmap)/i, response: "Simple iteration planning:\n\n1. Review the backlog and pick tasks for the sprint.\n2. Tackle High-priority items first.\n3. Track progress daily on the Dashboard.\n4. At the end, review completions and update the backlog." },
  { test: /\b(test|testing|unit test|coverage)/i,     response: "Testing recommendations:\n\n• Write unit tests for all service and utility functions.\n• Write integration tests for API endpoints.\n• Target 70–80% code coverage for core modules.\n• Run tests in CI before merging." },
  { test: /\b(thank|thanks|great|good job|awesome)/i, response: "You're welcome! Let me know if there's anything else I can help with." },
];

const AI_FALLBACK = "I don't have a specific response for that scenario. Try asking about:\n• Task prioritization\n• Requirement breakdown\n• Bug management\n• Sprint planning\n• Testing strategies";

/** @param {string} message @returns {string} */
function getAIResponse(message) {
  for (const rule of AI_RULES) {
    if (rule.test instanceof RegExp && rule.test.test(message)) return rule.response;
  }
  return AI_FALLBACK;
}

function appendChatMessage(role, text) {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) return;
  const senderLabel = role === 'user' ? 'You' : 'DevFlow AI';
  const msg = document.createElement('div');
  msg.className = `chat-msg chat-msg--${role}`;
  const contentHTML = role === 'assistant'
    ? escHtml(text).replace(/\n/g, '<br>')
    : escHtml(text);
  msg.innerHTML = `
    <span class="chat-msg__sender">${escHtml(senderLabel)}</span>
    <div class="chat-msg__bubble">${contentHTML}</div>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function initChat() {
  appendChatMessage('assistant', "Hello! I'm DevFlow AI Assistant.\n\nI can help you plan tasks, break down requirements, and prioritize your work. What would you like help with?");

  const form  = document.getElementById('chat-form');
  const input = /** @type {HTMLInputElement} */ (document.getElementById('chat-input'));
  const error = document.getElementById('chat-error');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      if (error) error.hidden = false;
      input.focus();
      return;
    }
    if (error) error.hidden = true;
    appendChatMessage('user', text);
    input.value = '';
    setTimeout(() => appendChatMessage('assistant', getAIResponse(text)), 400);
  });

  input.addEventListener('input', () => { if (error) error.hidden = true; });
}

/* ================================================================
   20. Requirement Breakdown  (FR-03)
   ================================================================ */

const BREAKDOWN_PATTERNS = [
  { test: /\b(auth|login|sign.?in|register|password|account)/i, tasks: ['Design the user authentication data model','Implement user registration endpoint with input validation','Implement login endpoint with JWT token generation','Implement password reset flow (request + confirm)','Build the registration form UI with error states','Build the login form UI with error handling','Add protected route middleware for authenticated pages','Write unit tests for authentication service methods','Document authentication API endpoints'] },
  { test: /\b(dashboard|overview|summary|stat|metric|analytic)/i, tasks: ['Define the key metrics and data sources for the dashboard','Create API endpoints to aggregate dashboard statistics','Design and implement the stat card components','Implement the project progress bar with live calculation','Add a recent activity or recent tasks panel','Ensure dashboard statistics update on data changes','Write tests for the statistics calculation logic','Make the dashboard layout responsive for mobile'] },
  { test: /\b(task|todo|to.do|work item|backlog|ticket)/i, tasks: ['Define the task data model (title, description, status, priority)','Implement CRUD API endpoints for tasks','Build the task list UI with status and priority indicators','Implement the add-task form with validation','Implement inline status update for tasks','Add filtering by status and priority','Ensure task changes are reflected in the dashboard','Write tests for task management logic'] },
  { test: /\b(bug|defect|issue|error|fix|patch)/i, tasks: ['Define the bug report data model (title, description, severity, priority, status)','Implement the bug list view with priority and status indicators','Add visual differentiation for bug severity levels','Implement bug status transitions (Open → In Progress → Resolved)','Link open bug count to the dashboard summary','Write tests for bug tracking logic'] },
  { test: /\b(api|endpoint|rest|backend|server|service)/i, tasks: ['Define the API resource structure and URL conventions','Implement base middleware (authentication, error handling, logging)','Implement CRUD endpoints for each resource','Add input validation and error response formatting','Write integration tests for each endpoint','Generate API documentation with OpenAPI/Swagger','Set up rate limiting and security headers'] },
  { test: /\b(ui|interface|front.?end|page|screen|view|layout|design)/i, tasks: ['Define the design system: colors, typography, spacing tokens','Build the navigation component and routing structure','Implement reusable form input and button components','Build the main page layout with responsive grid','Implement loading states and empty states','Add form validation and user feedback messages','Test layouts across desktop, tablet, and mobile viewports','Verify accessibility: keyboard navigation and ARIA labels'] },
  { test: /\b(test|testing|unit|integration|e2e|coverage|qa)/i, tasks: ['Set up the testing framework and configuration','Write unit tests for all utility and service functions','Write integration tests for API endpoints','Set up end-to-end test scenarios for critical user flows','Configure code coverage reporting','Add tests to the CI pipeline to run on every pull request','Document testing conventions in the project README'] },
  { test: /\b(deploy|ci|cd|pipeline|devops|docker|cloud|hosting)/i, tasks: ['Set up version control branching strategy (main / develop / feature)','Configure CI pipeline for automated testing on pull requests','Write a Dockerfile and docker-compose configuration','Set up environment variable management for staging and production','Configure the CD pipeline for automated deployment','Set up application monitoring and error tracking','Document the deployment process in the project README'] },
];

const BREAKDOWN_FALLBACK = ['Clarify and document the full requirement scope','Identify dependencies and external integrations','Break the requirement into independent sub-features','Design the data model for the new feature','Implement the backend logic and API endpoint','Build the frontend UI for the feature','Write unit and integration tests','Update project documentation'];

/** @param {string} requirement @returns {string[]} */
function generateBreakdownTasks(requirement) {
  for (const pattern of BREAKDOWN_PATTERNS) {
    if (pattern.test.test(requirement)) return pattern.tasks;
  }
  return BREAKDOWN_FALLBACK;
}

function initBreakdown() {
  const form   = document.getElementById('breakdown-form');
  const input  = /** @type {HTMLTextAreaElement} */ (document.getElementById('req-input'));
  const error  = document.getElementById('req-error');
  const result = document.getElementById('breakdown-result');
  const list   = document.getElementById('breakdown-list');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      if (error) error.hidden = false;
      input.classList.add('form-textarea--error');
      input.focus();
      return;
    }
    if (error) error.hidden = true;
    input.classList.remove('form-textarea--error');
    const tasks = generateBreakdownTasks(text);
    if (list) list.innerHTML = tasks.map(t => `<li>${escHtml(t)}</li>`).join('');
    if (result) {
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  input.addEventListener('input', () => {
    if (error) error.hidden = true;
    input.classList.remove('form-textarea--error');
  });
}

function initAssistantTabs() {
  const tabs = document.querySelectorAll('.tab-bar .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('tab--active');
        t.setAttribute('aria-selected', 'false');
        const panelId = t.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (panel) panel.classList.add('tabpanel--hidden');
      });
      tab.classList.add('tab--active');
      tab.setAttribute('aria-selected', 'true');
      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) panel.classList.remove('tabpanel--hidden');
    });
  });
}

function initAssistant() {
  initAssistantTabs();
  initChat();
  initBreakdown();
}

/* ================================================================
   21. Application Bootstrap
   ================================================================ */

function boot() {
  initBugData();      // Load localStorage bugs before any render
  initTheme();        // Apply theme early (also done by inline script)
  initNavigation();
  initMobileSidebar();
  initDashboard();
  initTasks();
  initBugTracking();
  initAssistant();
  navigateTo(AppState.activeSection);
}

document.addEventListener('DOMContentLoaded', boot);
