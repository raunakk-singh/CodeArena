const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(', ')
      : detail || 'Something went wrong. Please try again.';
    throw new Error(message);
  }
  return data;
}

export async function signIn(email, password) {
  const body = new URLSearchParams({ username: email, password });
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const { access_token: token } = await readResponse(response);
  return token;
}

export async function signUp({ firstName, lastName, email, password }) {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: firstName,
      second_name: lastName,
      email,
      password,
    }),
  });
  await readResponse(response);
  return signIn(email, password);
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return readResponse(response);
}

export async function createSubmission(token, submission) {
  const response = await fetch(`${API_BASE_URL}/submissions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(submission),
  });
  return readResponse(response);
}

export async function getSubmissions(token) {
  const response = await fetch(`${API_BASE_URL}/submissions/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return readResponse(response);
}

export async function getProblems() {
  const response = await fetch(`${API_BASE_URL}/problems/`);
  const data = await readResponse(response);
  return data.data || [];
}

export async function getProblem(id) {
  const response = await fetch(`${API_BASE_URL}/problems/${id}`);
  const data = await readResponse(response);
  return data.data;
}
