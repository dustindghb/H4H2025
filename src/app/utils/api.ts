import { StudentPreferences } from '../types/student';

export async function submitStudentPreferences(data: StudentPreferences): Promise<Response> {
  const response = await fetch('/api/user/student-preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit preferences');
  }

  return response;
}