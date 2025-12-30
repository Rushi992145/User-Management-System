import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]',
    destructive:
      'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-400 hover:to-red-400 shadow-lg shadow-rose-400/25 hover:shadow-xl hover:shadow-rose-400/30 hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'border-2 border-purple-600 text-purple-700 bg-transparent hover:bg-purple-50 hover:border-purple-700 hover:shadow-md active:scale-[0.98]',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <motion.svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </motion.svg>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </motion.button>
  );
};
