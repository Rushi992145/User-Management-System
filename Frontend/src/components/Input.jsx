import { motion } from 'framer-motion';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-700 leading-tight"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300 focus:border-purple-500 focus:ring-purple-500/20'
          } placeholder:text-slate-400 text-slate-900 font-medium ${className}`}
          {...props}
        />
        {error && (
          <motion.p
            className="text-sm text-red-600 font-medium flex items-center gap-1.5 mt-1.5"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-red-500">⚠</span>
            <span>{error}</span>
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
