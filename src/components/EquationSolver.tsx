import React, { useState, useEffect } from 'react';
import { EquationSolverState } from '../types';
import { Play, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

interface EquationSolverProps {
  onBack: () => void;
}

export default function EquationSolver({ onBack }: EquationSolverProps) {
  const [solverState, setSolverState] = useState<EquationSolverState>({
    mode: '2-var',
    coeffs: {
      // 1-Var
      one_a: '2',
      one_b: '4',
      one_c: '10',
      // 2-Var
      two_a1: '2', two_b1: '3', two_c1: '8',
      two_a2: '1', two_b2: '-1', two_c2: '1',
      // 3-Var
      three_a1: '1', three_b1: '1', three_c1: '1', three_d1: '6',
      three_a2: '0', three_b2: '2', three_c2: '5', three_d2: '-4',
      three_a3: '2', three_b3: '5', three_c3: '-1', three_d3: '27',
    },
    results: null,
    error: null,
  });

  const [steps, setSteps] = useState<string[]>([]);

  // Auto solve or trigger solve
  const solveEquations = () => {
    const { mode, coeffs } = solverState;
    const newSteps: string[] = [];

    try {
      if (mode === '1-var') {
        const a = parseFloat(coeffs.one_a || '0');
        const b = parseFloat(coeffs.one_b || '0');
        const c = parseFloat(coeffs.one_c || '0');

        newSteps.push(`Equation form: ax + b = c`);
        newSteps.push(`Current coefficients: (${a})x + (${b}) = ${c}`);

        if (isNaN(a) || isNaN(b) || isNaN(c)) {
          throw new Error("Please enter valid decimal numbers for all coefficients.");
        }

        if (a === 0) {
          if (b === c) {
            newSteps.push(`Since a = 0 and b = c (${b} = ${c}), any real number is a solution.`);
            setSolverState(prev => ({
              ...prev,
              results: { x: 'Infinite Solutions' },
              error: null
            }));
          } else {
            newSteps.push(`Since a = 0 and b ≠ c (${b} ≠ ${c}), there is no solution.`);
            setSolverState(prev => ({
              ...prev,
              results: null,
              error: 'No Solution (Contradiction)'
            }));
          }
        } else {
          const step1 = c - b;
          newSteps.push(`Subtract b from both sides: ax = c - b`);
          newSteps.push(`${a}x = ${c} - ${b} = ${step1}`);
          const x = step1 / a;
          newSteps.push(`Divide both sides by a: x = ${step1} / ${a}`);
          newSteps.push(`x = ${Number(x.toFixed(4))}`);

          setSolverState(prev => ({
            ...prev,
            results: { x: Number(x.toFixed(4)) },
            error: null
          }));
        }
      } else if (mode === '2-var') {
        const a1 = parseFloat(coeffs.two_a1 || '0');
        const b1 = parseFloat(coeffs.two_b1 || '0');
        const c1 = parseFloat(coeffs.two_c1 || '0');
        const a2 = parseFloat(coeffs.two_a2 || '0');
        const b2 = parseFloat(coeffs.two_b2 || '0');
        const c2 = parseFloat(coeffs.two_c2 || '0');

        newSteps.push(`System of Equations:`);
        newSteps.push(`(1) ${a1}x + ${b1}y = ${c1}`);
        newSteps.push(`(2) ${a2}x + ${b2}y = ${c2}`);

        if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
          throw new Error("Please enter valid decimal numbers for all coefficients.");
        }

        newSteps.push(`Using Cramer's Rule to solve the system.`);
        const D = a1 * b2 - b1 * a2;
        newSteps.push(`Determinant (D) = a1*b2 - b1*a2`);
        newSteps.push(`D = (${a1})*(${b2}) - (${b1})*(${a2}) = ${D}`);

        const Dx = c1 * b2 - b1 * c2;
        newSteps.push(`Dx = c1*b2 - b1*c2`);
        newSteps.push(`Dx = (${c1})*(${b2}) - (${b1})*(${c2}) = ${Dx}`);

        const Dy = a1 * c2 - c1 * a2;
        newSteps.push(`Dy = a1*c2 - c1*a2`);
        newSteps.push(`Dy = (${a1})*(${c2}) - (${c1})*(${a2}) = ${Dy}`);

        if (D === 0) {
          if (Dx === 0 && Dy === 0) {
            newSteps.push(`Since D = Dx = Dy = 0, the lines coincide. There are infinite solutions.`);
            setSolverState(prev => ({
              ...prev,
              results: { x: 'Infinite', y: 'Infinite' },
              error: null
            }));
          } else {
            newSteps.push(`Since D = 0 but Dx or Dy is non-zero, the lines are parallel and never intersect.`);
            setSolverState(prev => ({
              ...prev,
              results: null,
              error: 'No Solution'
            }));
          }
        } else {
          const x = Dx / D;
          const y = Dy / D;
          newSteps.push(`x = Dx / D = ${Dx} / ${D} = ${Number(x.toFixed(4))}`);
          newSteps.push(`y = Dy / D = ${Dy} / ${D} = ${Number(y.toFixed(4))}`);

          setSolverState(prev => ({
            ...prev,
            results: { x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) },
            error: null
          }));
        }
      } else if (mode === '3-var') {
        const a1 = parseFloat(coeffs.three_a1 || '0');
        const b1 = parseFloat(coeffs.three_b1 || '0');
        const c1 = parseFloat(coeffs.three_c1 || '0');
        const d1 = parseFloat(coeffs.three_d1 || '0');

        const a2 = parseFloat(coeffs.three_a2 || '0');
        const b2 = parseFloat(coeffs.three_b2 || '0');
        const c2 = parseFloat(coeffs.three_c2 || '0');
        const d2 = parseFloat(coeffs.three_d2 || '0');

        const a3 = parseFloat(coeffs.three_a3 || '0');
        const b3 = parseFloat(coeffs.three_b3 || '0');
        const c3 = parseFloat(coeffs.three_c3 || '0');
        const d3 = parseFloat(coeffs.three_d3 || '0');

        newSteps.push(`System of 3 variables:`);
        newSteps.push(`(1) ${a1}x + ${b1}y + ${c1}z = ${d1}`);
        newSteps.push(`(2) ${a2}x + ${b2}y + ${c2}z = ${d2}`);
        newSteps.push(`(3) ${a3}x + ${b3}y + ${c3}z = ${d3}`);

        const vars = [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3];
        if (vars.some(isNaN)) {
          throw new Error("Please enter valid decimal numbers.");
        }

        newSteps.push(`Solving using 3x3 Determinants.`);
        // D
        const D = a1 * (b2 * c3 - c2 * b3) - b1 * (a2 * c3 - c2 * a3) + c1 * (a2 * b3 - b2 * a3);
        newSteps.push(`D = a1*(b2*c3 - c2*b3) - b1*(a2*c3 - c2*a3) + c1*(a2*b3 - b2*a3)`);
        newSteps.push(`D = ${D}`);

        // Dx
        const Dx = d1 * (b2 * c3 - c2 * b3) - b1 * (d2 * c3 - c2 * d3) + c1 * (d2 * b3 - b2 * d3);
        newSteps.push(`Dx = ${Dx}`);

        // Dy
        const Dy = a1 * (d2 * c3 - c2 * d3) - d1 * (a2 * c3 - c2 * a3) + c1 * (a2 * d3 - d2 * a3);
        newSteps.push(`Dy = ${Dy}`);

        // Dz
        const Dz = a1 * (b2 * d3 - d2 * b3) - b1 * (a2 * d3 - d2 * a3) + d1 * (a2 * b3 - b2 * a3);
        newSteps.push(`Dz = ${Dz}`);

        if (D === 0) {
          if (Dx === 0 && Dy === 0 && Dz === 0) {
            newSteps.push(`System has infinite equations or is dependent (D = Dx = Dy = Dz = 0).`);
            setSolverState(prev => ({
              ...prev,
              results: { x: 'Infinite', y: 'Infinite', z: 'Infinite' },
              error: null
            }));
          } else {
            newSteps.push(`System has no consistent solution (D = 0, but other determinants ≠ 0).`);
            setSolverState(prev => ({
              ...prev,
              results: null,
              error: 'No Solution'
            }));
          }
        } else {
          const x = Dx / D;
          const y = Dy / D;
          const z = Dz / D;
          newSteps.push(`x = Dx/D = ${Number(x.toFixed(4))}`);
          newSteps.push(`y = Dy/D = ${Number(y.toFixed(4))}`);
          newSteps.push(`z = Dz/D = ${Number(z.toFixed(4))}`);

          setSolverState(prev => ({
            ...prev,
            results: {
              x: Number(x.toFixed(4)),
              y: Number(y.toFixed(4)),
              z: Number(z.toFixed(4))
            },
            error: null
          }));
        }
      }
    } catch (err: any) {
      setSolverState(prev => ({ ...prev, error: err.message, results: null }));
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    solveEquations();
  }, [solverState.mode, solverState.coeffs]);

  const handleCoeffChange = (key: string, value: string) => {
    // allow numbers, decimals, and negative signs
    if (/^[+-]?\d*\.?\d*$/.test(value) || value === '') {
      setSolverState(prev => ({
        ...prev,
        coeffs: {
          ...prev.coeffs,
          [key]: value
        }
      }));
    }
  };

  const handleReset = () => {
    setSolverState(prev => {
      const clearedCoeffs = { ...prev.coeffs };
      Object.keys(clearedCoeffs).forEach(k => {
        clearedCoeffs[k] = '';
      });
      return {
        ...prev,
        coeffs: clearedCoeffs,
        results: null,
        error: null,
      };
    });
    setSteps([]);
  };

  return (
    <div id="equation-solver-box" className="p-4 w-full h-full text-white bg-neutral-900 overflow-y-auto select-none font-sans">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-orange-400" />
          Linear Eq Solver
        </h1>
        <button
          id="btn-back-to-calculator"
          onClick={onBack}
          className="px-3 py-1 text-sm bg-neutral-800 hover:bg-neutral-700 text-orange-400 rounded-lg transition-colors border border-neutral-700"
        >
          Calculator
        </button>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 rounded-lg mb-6 border border-neutral-800">
        {(['1-var', '2-var', '3-var'] as const).map((m) => (
          <button
            key={m}
            id={`tab-solver-${m}`}
            onClick={() => setSolverState(prev => ({ ...prev, mode: m, results: null }))}
            className={`py-2 text-xs font-medium rounded-md transition-all ${
              solverState.mode === m
                ? 'bg-orange-500 text-white shadow-md font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {m === '1-var' ? '1 Variable (ax+b=c)' : m === '2-var' ? '2 Variables' : '3 Variables'}
          </button>
        ))}
      </div>

      {/* Equations Editor Panel */}
      <div className="bg-neutral-950 p-4 rounded-xl mb-5 space-y-4 border border-neutral-800">
        <div className="text-center py-2 text-sm text-neutral-400 border-b border-neutral-800">
          {solverState.mode === '1-var' && (
            <span className="font-mono text-white text-base">ax + b = c</span>
          )}
          {solverState.mode === '2-var' && (
            <div className="font-mono text-neutral-300 text-xs text-left leading-relaxed space-y-1">
              <div>eq 1: <span className="text-white">a₁x + b₁y = c₁</span></div>
              <div>eq 2: <span className="text-white">a₂x + b₂y = c₂</span></div>
            </div>
          )}
          {solverState.mode === '3-var' && (
            <div className="font-mono text-neutral-300 text-xs text-left leading-relaxed space-y-0.5">
              <div>eq 1: <span className="text-white">a₁x + b₁y + c₁z = d₁</span></div>
              <div>eq 2: <span className="text-white">a₂x + b₂y + c₂z = d₂</span></div>
              <div>eq 3: <span className="text-white">a₃x + b₃y + c₃z = d₃</span></div>
            </div>
          )}
        </div>

        {/* Inputs based on Mode */}
        {solverState.mode === '1-var' && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">a</label>
              <input
                id="input-1var-a"
                type="text"
                value={solverState.coeffs.one_a}
                onChange={(e) => handleCoeffChange('one_a', e.target.value)}
                placeholder="2"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">b</label>
              <input
                id="input-1var-b"
                type="text"
                value={solverState.coeffs.one_b}
                onChange={(e) => handleCoeffChange('one_b', e.target.value)}
                placeholder="4"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">c</label>
              <input
                id="input-1var-c"
                type="text"
                value={solverState.coeffs.one_c}
                onChange={(e) => handleCoeffChange('one_c', e.target.value)}
                placeholder="10"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-lg focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {solverState.mode === '2-var' && (
          <div className="space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">a₁ (x)</label>
                <input
                  id="input-2var-a1"
                  type="text"
                  value={solverState.coeffs.two_a1}
                  onChange={(e) => handleCoeffChange('two_a1', e.target.value)}
                  placeholder="2"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-base focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">b₁ (y)</label>
                <input
                  id="input-2var-b1"
                  type="text"
                  value={solverState.coeffs.two_b1}
                  onChange={(e) => handleCoeffChange('two_b1', e.target.value)}
                  placeholder="3"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-base focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">c₁ (=)</label>
                <input
                  id="input-2var-c1"
                  type="text"
                  value={solverState.coeffs.two_c1}
                  onChange={(e) => handleCoeffChange('two_c1', e.target.value)}
                  placeholder="8"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-base focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">a₂ (x)</label>
                <input
                  id="input-2var-a2"
                  type="text"
                  value={solverState.coeffs.two_a2}
                  onChange={(e) => handleCoeffChange('two_a2', e.target.value)}
                  placeholder="1"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-base focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">b₂ (y)</label>
                <input
                  id="input-2var-b2"
                  type="text"
                  value={solverState.coeffs.two_b2}
                  onChange={(e) => handleCoeffChange('two_b2', e.target.value)}
                  placeholder="-1"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-base focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-orange-400 mb-1 font-semibold text-center font-mono">c₂ (=)</label>
                <input
                  id="input-2var-c2"
                  type="text"
                  value={solverState.coeffs.two_c2}
                  onChange={(e) => handleCoeffChange('two_c2', e.target.value)}
                  placeholder="1"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-center text-white font-mono text-base focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {solverState.mode === '3-var' && (
          <div className="space-y-2">
            {/* Equation 1 */}
            <div className="grid grid-cols-4 gap-1.5 items-center">
              <input
                id="input-3var-a1"
                type="text"
                value={solverState.coeffs.three_a1}
                onChange={(e) => handleCoeffChange('three_a1', e.target.value)}
                placeholder="a₁"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-b1"
                type="text"
                value={solverState.coeffs.three_b1}
                onChange={(e) => handleCoeffChange('three_b1', e.target.value)}
                placeholder="b₁"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-c1"
                type="text"
                value={solverState.coeffs.three_c1}
                onChange={(e) => handleCoeffChange('three_c1', e.target.value)}
                placeholder="c₁"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-d1"
                type="text"
                value={solverState.coeffs.three_d1}
                onChange={(e) => handleCoeffChange('three_d1', e.target.value)}
                placeholder="d₁"
                className="bg-neutral-950 border border-orange-500/70 rounded p-1 text-center font-mono text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            {/* Equation 2 */}
            <div className="grid grid-cols-4 gap-1.5 items-center">
              <input
                id="input-3var-a2"
                type="text"
                value={solverState.coeffs.three_a2}
                onChange={(e) => handleCoeffChange('three_a2', e.target.value)}
                placeholder="a₂"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-b2"
                type="text"
                value={solverState.coeffs.three_b2}
                onChange={(e) => handleCoeffChange('three_b2', e.target.value)}
                placeholder="b₂"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-c2"
                type="text"
                value={solverState.coeffs.three_c2}
                onChange={(e) => handleCoeffChange('three_c2', e.target.value)}
                placeholder="c₂"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-d2"
                type="text"
                value={solverState.coeffs.three_d2}
                onChange={(e) => handleCoeffChange('three_d2', e.target.value)}
                placeholder="d₂"
                className="bg-neutral-950 border border-orange-500/70 rounded p-1 text-center font-mono text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            {/* Equation 3 */}
            <div className="grid grid-cols-4 gap-1.5 items-center">
              <input
                id="input-3var-a3"
                type="text"
                value={solverState.coeffs.three_a3}
                onChange={(e) => handleCoeffChange('three_a3', e.target.value)}
                placeholder="a₃"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-b3"
                type="text"
                value={solverState.coeffs.three_b3}
                onChange={(e) => handleCoeffChange('three_b3', e.target.value)}
                placeholder="b₃"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-c3"
                type="text"
                value={solverState.coeffs.three_c3}
                onChange={(e) => handleCoeffChange('three_c3', e.target.value)}
                placeholder="c₃"
                className="bg-neutral-900 border border-neutral-700 rounded p-1 text-center font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <input
                id="input-3var-d3"
                type="text"
                value={solverState.coeffs.three_d3}
                onChange={(e) => handleCoeffChange('three_d3', e.target.value)}
                placeholder="d₃"
                className="bg-neutral-950 border border-orange-500/70 rounded p-1 text-center font-mono text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* Buttons for Reset vs Solve Manual */}
        <div className="flex gap-2 justify-end pt-1">
          <button
            id="btn-solver-reset"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-750 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            id="btn-solver-trigger"
            onClick={solveEquations}
            className="flex items-center gap-1 px-4 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 font-medium text-white rounded-lg transition-colors shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Solve Steps
          </button>
        </div>
      </div>

      {/* Solutions / Errors */}
      <div className="space-y-4">
        {solverState.error && (
          <div id="solver-error" className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 rounded-lg text-sm font-mono flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{solverState.error}</span>
          </div>
        )}

        {solverState.results && !solverState.error && (
          <div id="solver-results" className="p-4 bg-orange-950/20 border border-orange-500/30 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2 font-mono">Resolved Outputs:</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {Object.entries(solverState.results).map(([variable, val]) => (
                <div key={variable} className="bg-neutral-900 border border-neutral-750 px-3 py-2 rounded-lg">
                  <div className="text-sm text-neutral-400 font-semibold">{variable}</div>
                  <div className="text-lg font-mono font-bold text-white mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Steps Console */}
        {steps.length > 0 && (
          <div id="solver-steps-console" className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-xs">
            <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-neutral-900">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Solution Steps</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto text-neutral-300 leading-relaxed pr-1">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-1">
                  <span className="text-orange-550 select-none">›</span>
                  <span className={step.includes('x =') || step.includes('y =') || step.includes('z =') ? 'text-white font-bold' : ''}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
