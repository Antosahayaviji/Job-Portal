// contact.js
// Saves form data as a draft to localStorage, restores drafts on load,
// and stores submissions into localStorage as an array named 'contact_submissions'.

(function () {
  const FORM_KEY = 'contact_draft_v1';
  const SUBMISSIONS_KEY = 'contact_submissions_v1';
  const AUTO_SAVE_DELAY = 600; // ms

  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const clearBtn = document.getElementById('clearDraft');

  // Fields to persist (by id)
  const fields = ['fname', 'email', 'text', 'district', 'intrested', 'msg'];

  let saveTimer = null;

  function setStatus(msg, timeout = 2500) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    if (timeout) {
      setTimeout(() => {
        if (statusEl.textContent === msg) statusEl.textContent = '';
      }, timeout);
    }
  }

  function readFormData() {
    const data = {};
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === 'checkbox' || el.type === 'radio') data[id] = el.checked;
      else data[id] = el.value;
    });
    data._savedAt = new Date().toISOString();
    return data;
  }

  function populateForm(data) {
    if (!data) return;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!data[id];
      else if (data[id] !== undefined) el.value = data[id];
    });
  }

  function saveDraft() {
    try {
      const d = readFormData();
      localStorage.setItem(FORM_KEY, JSON.stringify(d));
      setStatus('Draft saved');
    } catch (e) {
      console.error('Failed to save draft', e);
      setStatus('Failed to save draft');
    }
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, AUTO_SAVE_DELAY);
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(FORM_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      populateForm(parsed);
      if (parsed && parsed._savedAt) setStatus('Loaded draft from ' + new Date(parsed._savedAt).toLocaleString(), 3000);
      return parsed;
    } catch (e) {
      console.error('Failed to load draft', e);
      return null;
    }
  }

  function clearDraft() {
    localStorage.removeItem(FORM_KEY);
    setStatus('Draft cleared');
  }

  function validateSubmission(data) {
    // Basic validation: name and email required
    if (!data.fname || !data.fname.trim()) return { ok: false, message: 'Please enter your full name.' };
    if (!data.email || !data.email.trim()) return { ok: false, message: 'Please enter your email.' };
    // Very simple email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return { ok: false, message: 'Please enter a valid email address.' };
    return { ok: true };
  }

  function saveSubmission(data) {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(data);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(arr));
      setStatus('Submission saved. Thank you!', 4000);
      renderSubmissions();
    } catch (e) {
      console.error('Failed to save submission', e);
      setStatus('Failed to save submission');
    }
  }

  // Submissions UI
  const submissionsListEl = document.getElementById('submissionsList');
  const toggleSubBtn = document.getElementById('toggleSubmissions');
  const clearSubsBtn = document.getElementById('clearSubmissions');
  const showSubmittedBtn = document.getElementById('showSubmittedBtn');

  function getAllSubmissions() {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read submissions', e);
      return [];
    }
  }

  function deleteSubmission(index) {
    try {
      const arr = getAllSubmissions();
      if (index < 0 || index >= arr.length) return;
      arr.splice(index, 1);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(arr));
      renderSubmissions();
      setStatus('Submission deleted');
    } catch (e) {
      console.error('Failed to delete submission', e);
      setStatus('Failed to delete submission');
    }
  }

  function clearAllSubmissions() {
    localStorage.removeItem(SUBMISSIONS_KEY);
    renderSubmissions();
    setStatus('All submissions cleared');
  }

  function renderSubmissions() {
    if (!submissionsListEl) return;
    const arr = getAllSubmissions();
    if (!arr.length) {
      submissionsListEl.innerHTML = '<p>No submissions yet.</p>';
      return;
    }
    const html = arr.map((s, i) => {
      const name = escapeHtml(s.fname || '—');
      const email = escapeHtml(s.email || '—');
      const district = escapeHtml(s.district || '—');
      const intrested = escapeHtml(s.intrested || '—');
      const text = escapeHtml(s.text || '—');
      const msg = escapeHtml(s.msg || '—');
      const at = s.submittedAt ? new Date(s.submittedAt).toLocaleString() : (s._savedAt ? new Date(s._savedAt).toLocaleString() : '—');
      return `\n+        <div class="submission" data-idx="${i}" style="border:1px solid #ddd;padding:8px;margin-bottom:8px;border-radius:4px;">\n+          <div style="display:flex;justify-content:space-between;align-items:center">\n+            <strong>${name}</strong> <small>${at}</small>\n+          </div>\n+          <div style="font-size:0.95rem;margin-top:6px">\n+            <div><strong>Email:</strong> ${email}</div>\n+            <div><strong>Phone:</strong> ${text}</div>\n+            <div><strong>District:</strong> ${district}</div>\n+            <div><strong>Intrested:</strong> ${intrested}</div>\n+            <div style="margin-top:6px"><strong>Message:</strong><div style=\"white-space:pre-wrap;margin-top:4px\">${msg}</div></div>\n+          </div>\n+          <div style="margin-top:8px;text-align:right">\n+            <button data-action="delete" data-idx="${i}">Delete</button>\n+          </div>\n+        </div>`;
    }).join('\n');
    submissionsListEl.innerHTML = html;
    // attach delete handlers
    submissionsListEl.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const idx = Number(btn.getAttribute('data-idx'));
        deleteSubmission(idx);
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Submissions section starts hidden. Toggle button exists in the section to Hide/Show
  const submissionsSection = document.getElementById('submissionsSection');
  if (submissionsSection) submissionsSection.style.display = 'none';

  if (showSubmittedBtn) {
    showSubmittedBtn.addEventListener('click', () => {
      if (!submissionsSection) return;
      // show the section and render
      submissionsSection.style.display = '';
      renderSubmissions();
      // if toggle button is present inside section, set it to 'Hide'
      if (toggleSubBtn) toggleSubBtn.textContent = 'Hide';
      // focus the list so keyboard users see it
      if (submissionsListEl) submissionsListEl.scrollIntoView({behavior: 'smooth'});
    });
  }

  if (toggleSubBtn) {
    toggleSubBtn.addEventListener('click', () => {
      if (!submissionsSection) return;
      if (submissionsSection.style.display === 'none') {
        submissionsSection.style.display = '';
        toggleSubBtn.textContent = 'Hide';
        renderSubmissions();
      } else {
        submissionsSection.style.display = 'none';
        toggleSubBtn.textContent = 'Show';
      }
    });
  }

  if (clearSubsBtn) {
    clearSubsBtn.addEventListener('click', () => {
      if (!confirm('Clear all saved submissions? This cannot be undone.')) return;
      clearAllSubmissions();
    });
  }

  // submissions will render only when the user shows the section

  // Attach listeners for autosave
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', scheduleSave);
    el.addEventListener('change', scheduleSave);
  });

  // Clear draft button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearDraft();
      // reset form visually
      form.reset();
    });
  }

  // On submit: validate, save submission, clear draft
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = readFormData();
    const v = validateSubmission(data);
    if (!v.ok) {
      setStatus(v.message, 4000);
      return;
    }
    data.submittedAt = new Date().toISOString();
    saveSubmission(data);
    clearDraft();
    form.reset();
  });

  // Load draft on startup
  document.addEventListener('DOMContentLoaded', loadDraft);
  // In case script is executed after DOMContentLoaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') loadDraft();
})();
