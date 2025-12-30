import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const ResetPassword = () => {
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <motion.div 
        className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl p-8 rounded-2xl" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            To reset your password, please sign in to your account and change your password from your profile settings.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
            <p className="text-sm text-blue-800 font-medium">
              📌 Steps to reset password:
            </p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 text-left">
              <li>1. Click "Sign in" below</li>
              <li>2. Login with your email and current password</li>
              <li>3. Go to your profile</li>
              <li>4. Change your password from settings</li>
            </ol>
          </div>

          <p className="text-slate-600 text-sm">
            For immediate assistance, please contact your administrator.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link to="/login" className="block">
            <Button className="w-full">Sign In to Account</Button>
          </Link>
          <Link to="/login" className="block">
            <Button variant="secondary" className="w-full">Back to Login</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
