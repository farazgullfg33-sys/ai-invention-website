const adminState = {
  password: "",
  content: null,
};

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "x-admin-password": adminState.password,
  };
}

async function loadContent() {
  const response = await fetch("/api/content");
  adminState.content = await response.json();
  populateContentForm(adminState.content);
}

function populateContentForm(content) {
  const form = document.getElementById("content-form");
  form.heroEyebrow.value = content.hero.eyebrow;
  form.heroTitle.value = content.hero.title;
  form.heroDescription.value = content.hero.description;
  form.aboutHeadline.value = content.about.headline;
  form.aboutBody.value = content.about.body;
}

function renderSubmission(submission) {
  return `
    <article class="submission-card">
      <div class="submission-header">
        <h3>${submission.name}</h3>
        <span>${new Date(submission.submittedAt).toLocaleString()}</span>
      </div>
      <p><strong>Email:</strong> ${submission.email}</p>
      <p><strong>Company:</strong> ${submission.company || "N/A"}</p>
      <p><strong>Service:</strong> ${submission.service}</p>
      <p><strong>Budget:</strong> ${submission.budget || "N/A"}</p>
      <p>${submission.message}</p>
    </article>
  `;
}

async function loadSubmissions() {
  const response = await fetch("/api/admin/submissions", {
    headers: { "x-admin-password": adminState.password },
  });

  if (!response.ok) {
    throw new Error("Unable to load submissions.");
  }

  const submissions = await response.json();
  const list = document.getElementById("submission-list");
  list.innerHTML = submissions.length
    ? submissions.map(renderSubmission).join("")
    : '<p class="empty-state">No submissions yet.</p>';
}

async function unlockDashboard(event) {
  event.preventDefault();
  const status = document.getElementById("admin-status");
  const password = new FormData(event.currentTarget).get("password");

  adminState.password = String(password || "");
  status.textContent = "Verifying access...";

  try {
    await loadSubmissions();
    await loadContent();
    document.getElementById("admin-dashboard").classList.remove("hidden");
    status.textContent = "Dashboard unlocked.";
  } catch (error) {
    status.textContent = "Incorrect password or dashboard unavailable.";
  }
}

async function saveContent(event) {
  event.preventDefault();
  const status = document.getElementById("content-status");
  const form = event.currentTarget;

  const updated = structuredClone(adminState.content);
  updated.hero.eyebrow = form.heroEyebrow.value.trim();
  updated.hero.title = form.heroTitle.value.trim();
  updated.hero.description = form.heroDescription.value.trim();
  updated.about.headline = form.aboutHeadline.value.trim();
  updated.about.body = form.aboutBody.value.trim();

  status.textContent = "Saving content...";

  const response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(updated),
  });

  const result = await response.json();
  if (!response.ok) {
    status.textContent = result.error || "Unable to save content.";
    return;
  }

  adminState.content = updated;
  status.textContent = "Content saved.";
}

document.getElementById("admin-login").addEventListener("submit", unlockDashboard);
document.getElementById("content-form").addEventListener("submit", saveContent);
document.getElementById("refresh-submissions").addEventListener("click", async () => {
  const status = document.getElementById("admin-status");
  status.textContent = "Refreshing submissions...";
  try {
    await loadSubmissions();
    status.textContent = "Submissions refreshed.";
  } catch (error) {
    status.textContent = "Unable to refresh submissions.";
  }
});
