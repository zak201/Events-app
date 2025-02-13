'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';

export default function LoginPromptModal({ isOpen, onClose, onLogin, onSignup }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-overlay"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="modal-container"
          >
            <div className="modal-content">
              <button
                onClick={onClose}
                className="modal-close-button"
                aria-label="Fermer"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center p-6">
                <div className="mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <LogIn className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Connexion requise
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Pour réserver des places à cet événement, vous devez être connecté.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={onLogin}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-5 w-5" />
                    Se connecter
                  </button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                        ou
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onSignup}
                    className="btn btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    Créer un compte
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 