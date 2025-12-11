import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import MemorialCard from '@/components/pet/MemorialCard';

export default function Graveyard() {
  const { data: memorials, isLoading } = useQuery({
    queryKey: ['memorials'],
    queryFn: () => base44.entities.Memorial.list(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-stone-900 to-slate-900 p-4 pb-24 relative overflow-hidden">
      {/* Atmospheric particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Fog effect at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <Link to="/PetCare">
          <Button variant="ghost" className="text-white/60 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sanctuary
          </Button>
        </Link>

        <div className="text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            🪦
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Memorial Garden</h1>
          <p className="text-white/60">
            A peaceful place to remember our beloved companions
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-2xl mx-auto relative z-10">
        {isLoading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl inline-block"
            >
              ✨
            </motion.div>
            <p className="text-white/60 mt-4">Loading memories...</p>
          </div>
        ) : memorials?.length > 0 ? (
          <>
            <motion.div 
              className="text-center mb-6 text-white/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              {memorials.length} {memorials.length === 1 ? 'memory' : 'memories'} preserved
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {memorials.map((memorial, index) => (
                <MemorialCard key={memorial.id} memorial={memorial} index={index} />
              ))}
            </div>

            {/* Footer message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8 py-6 border-t border-white/10"
            >
              <p className="text-white/40 text-sm italic">
                "Those we love don't go away, they walk beside us every day."
              </p>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/5 rounded-3xl border border-white/10"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🌸
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">No Memorials Yet</h3>
            <p className="text-white/60 max-w-xs mx-auto">
              This garden awaits to honor the memories of your beloved companions when the time comes.
            </p>
            <Link to="/PetCare">
              <Button className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600">
                Return to Your Pet
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
