const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchBeats = async () => {
  const response = await fetch(`${API_URL}/api/beats`);
  return response.json();
};

export const createBeat = async (formData) => {
  const response = await fetch(`${API_URL}/api/beats`, {
    method: 'POST',
    body: formData
  });
  return response.json();
};

export const updateBeat = async (id, formData) => {
  const response = await fetch(`${API_URL}/api/beats/${id}`, {
    method: 'PUT',
    body: formData
  });
  return response.json();
};

export const deleteBeat = async (id) => {
  await fetch(`${API_URL}/api/beats/${id}`, {
    method: 'DELETE'
  });
};