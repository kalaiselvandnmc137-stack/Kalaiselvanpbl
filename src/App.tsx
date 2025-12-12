import { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Check, X, AlertCircle } from 'lucide-react';

interface PasswordCriteria {
  label: string;
  met: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'No password',
    color: 'text-gray-400',
    bgColor: 'bg-gray-200'
  });
  const [criteria, setCriteria] = useState<PasswordCriteria[]>([]);

  useEffect(() => {
    analyzePassword(password);
  }, [password]);

  const analyzePassword = (pwd: string) => {
    if (!pwd) {
      setStrength({
        score: 0,
        label: 'No password',
        color: 'text-gray-400',
        bgColor: 'bg-gray-200'
      });
      setCriteria([]);
      return;
    }

    const checks: PasswordCriteria[] = [
      { label: 'At least 8 characters', met: pwd.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(pwd) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(pwd) },
      { label: 'Contains number', met: /\d/.test(pwd) },
      { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
      { label: 'At least 12 characters', met: pwd.length >= 12 }
    ];

    setCriteria(checks);

    const metCount = checks.filter(c => c.met).length;
    const score = Math.min((metCount / checks.length) * 100, 100);

    let strengthData: PasswordStrength;

    if (score < 33) {
      strengthData = {
        score,
        label: 'Weak',
        color: 'text-red-600',
        bgColor: 'bg-red-500'
      };
    } else if (score < 66) {
      strengthData = {
        score,
        label: 'Moderate',
        color: 'text-orange-600',
        bgColor: 'bg-orange-500'
      };
    } else if (score < 90) {
      strengthData = {
        score,
        label: 'Strong',
        color: 'text-blue-600',
        bgColor: 'bg-blue-500'
      };
    } else {
      strengthData = {
        score,
        label: 'Very Strong',
        color: 'text-green-600',
        bgColor: 'bg-green-500'
      };
    }

    setStrength(strengthData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-2">
              <Shield className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Password Checker</h1>
            <p className="text-slate-600">Test your password strength</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Enter Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all"
                  placeholder="Type your password..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {password && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Strength:</span>
                    <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.bgColor} transition-all duration-300 ease-out`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Password Requirements:</h3>
                  {criteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {criterion.met ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${criterion.met ? 'text-green-700' : 'text-slate-600'}`}>
                        {criterion.label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-blue-900">Security Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use a unique password for each account</li>
                  <li>• Avoid common words and personal information</li>
                  <li>• Consider using a password manager</li>
                  <li>• Enable two-factor authentication when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Your password is never sent or stored anywhere
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
