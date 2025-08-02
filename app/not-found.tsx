'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-gray-900">
          404
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Es scheint, als hättest du dich in das unbekannte digitale Reich gewagt.
        </p>
        <Link href="/dashboard">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
            Zur Website zurückkehren
          </Button>
        </Link>
      </div>
    </div>
  );
}
