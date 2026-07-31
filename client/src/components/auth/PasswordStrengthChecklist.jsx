import { Check, X } from 'lucide-react';

const rules = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

export default function PasswordStrengthChecklist({ password = '' }) {
  if (!password) return null;

  return (
    <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
      {rules.map((rule) => {
        const passed = rule.test(password);
        return (
          <div
            key={rule.label}
            className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-slate-400'}`}
          >
            {passed ? <Check size={12} /> : <X size={12} />}
            {rule.label}
          </div>
        );
      })}
    </div>
  );
}