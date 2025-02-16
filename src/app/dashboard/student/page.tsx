'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/student/profile');
  }, [router]);

  return null;
}