'use client';
import { useEffect } from 'react';
import { seedIfEmpty } from '@/lib/db-seed';

export function DbInit() {
  useEffect(() => {
    seedIfEmpty().catch(console.error);
  }, []);
  return null;
}
