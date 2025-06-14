'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AnimatePresence>
      <motion.div
        className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.97 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-headline font-bold mb-2">Oops! Something went wrong.</h1>
        <p className="text-lg text-muted-foreground mb-6">
          We encountered an error trying to load this page. Please try again.
        </p>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Error details: {error.message}
          {error.digest && <span className="block mt-1">Digest: {error.digest}</span>}
        </p>
        <Button
          onClick={() => reset()}
          size="lg"
        >
          Try again
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
