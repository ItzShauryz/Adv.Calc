export interface EquationSolverState {
  mode: '1-var' | '2-var' | '3-var';
  // 1-var: ax + b = c  => coeffs: { a: '', b: '', c: '' }
  // 2-var: a1*x + b1*y = c1, a2*x + b2*y = c2 => coeffs: { a1, b1, c1, a2, b2, c2 }
  // 3-var: a1*x + b1*y + c1*z = d1, etc => coeffs: { a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3 }
  coeffs: Record<string, string>;
  results: Record<string, number | string> | null;
  error: string | null;
}

export interface HiddenApp {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  color: string; // Tailwind bg class
  description: string;
  isHidden: boolean; // Managed by the "Hide Apps" shortcut
  category: string;
}

export interface SecretNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface SecretContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  category: 'Personal' | 'Work' | 'Classified';
}

export interface SecretPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}
