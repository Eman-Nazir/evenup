import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm border border-slate-100"
      >
        {children}
      </motion.div>
    </div>
  );
}