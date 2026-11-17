import { useState } from 'react';
import { Matrix } from '../types';

interface MatrixInputProps {
  matrix: Matrix;
  onChange: (matrix: Matrix) => void;
  editable: boolean;
  correctness?: boolean[][];
  highlightCorrect?: boolean;
}

export function MatrixInput({
  matrix,
  onChange,
  editable,
  correctness,
  highlightCorrect = true,
}: MatrixInputProps) {
  const [focusedCell, setFocusedCell] = useState<{ r: number; c: number } | null>(null);

  if (!matrix || !matrix.values) return null;

  const toggleFractionMode = () => {
    if (!editable || !focusedCell) return;
    const { r, c } = focusedCell;

    const newIsFraction = matrix.isFraction
      ? matrix.isFraction.map((row) => [...row])
      : Array(matrix.rows).fill(null).map(() => Array(matrix.cols).fill(false));
    newIsFraction[r][c] = !newIsFraction[r][c];

    const newValues = matrix.values.map((row) => [...row]);
    newValues[r][c] = null;

    const newOperations = matrix.operations
      ? matrix.operations.map((row) => [...row])
      : Array(matrix.rows).fill(null).map(() => Array(matrix.cols).fill(null));
    newOperations[r][c] = null;

    onChange({
      ...matrix,
      isFraction: newIsFraction,
      values: newValues,
      operations: newOperations,
    });
  };

  const handleFractionChange = (
    row: number,
    col: number,
    part: 'num' | 'den',
    value: string
  ) => {
    if (!editable) return;

    const newOperations = matrix.operations
      ? matrix.operations.map((r) => [...r])
      : Array(matrix.rows).fill(null).map(() => Array(matrix.cols).fill(null));
    const newValues = matrix.values.map((r) => [...r]);

    const currentOp = newOperations[row][col] || '/';
    const parts = currentOp.split('/');
    let numStr = parts[0] || '';
    let denStr = parts[1] || '';

    if (part === 'num') numStr = value;
    if (part === 'den') denStr = value;

    newOperations[row][col] = `${numStr}/${denStr}`;

    const num = parseFloat(numStr);
    const den = parseFloat(denStr);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      newValues[row][col] = num / den;
    } else {
      newValues[row][col] = isNaN(num) ? null : num;
    }

    onChange({ ...matrix, values: newValues, operations: newOperations });
  };

  const handleNormalChange = (row: number, col: number, value: string) => {
    if (!editable) return;
    if (value !== '' && value !== '-' && value !== '.' && isNaN(parseFloat(value))) return;

    const newValues = matrix.values.map((r) => [...r]);
    newValues[row][col] = value === '' ? null : parseFloat(value);

    const newOperations = matrix.operations
      ? matrix.operations.map((r) => [...r])
      : Array(matrix.rows).fill(null).map(() => Array(matrix.cols).fill(null));
    newOperations[row][col] = null;

    onChange({ ...matrix, values: newValues, operations: newOperations });
  };

  const getCellBorderClass = (row: number, col: number): string => {
    if (!highlightCorrect || !correctness || !correctness[row]) {
      if (!editable) return 'border border-gray-300 bg-gray-100 text-gray-700';
      return 'border-2 border-gray-300 bg-white focus-within:border-indigo-500 hover:border-gray-400';
    }
    const val = matrix.values[row][col];
    if (val === null)
      return 'border-2 border-gray-300 bg-white focus-within:border-indigo-500';
    return correctness[row][col]
      ? 'border-2 border-green-500 bg-green-50 text-green-700'
      : 'border-2 border-red-500 bg-red-50 text-red-700';
  };

  const isCellFocused = (r: number, c: number) =>
    focusedCell?.r === r && focusedCell?.c === c;

  return (
    <div className="flex flex-col items-center">
      {editable && (
        <div className="h-9 mb-2 flex items-center">
          {focusedCell ? (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleFractionMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${matrix.isFraction?.[focusedCell.r]?.[focusedCell.c]
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
            >
              <span
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1px',
                  fontSize: '0.6rem',
                  lineHeight: 1,
                }}
              >
                <span>a</span>
                <span
                  style={{
                    display: 'block',
                    width: '12px',
                    height: '1.5px',
                    background: 'currentColor',
                    borderRadius: '1px',
                  }}
                />
                <span>b</span>
              </span>
              Fracción
            </button>
          ) : (
            <span className="text-xs text-gray-400 italic">
              Selecciona una celda para activar fracción
            </span>
          )}
        </div>
      )}

      <div className="inline-flex items-center">
        <div className="flex flex-col justify-between self-stretch mr-2 py-1">
          <div style={{ borderLeft: '3px solid #343A40', borderTop: '3px solid #343A40', width: '12px', height: '8px', borderTopLeftRadius: '2px' }} />
          <div style={{ borderLeft: '3px solid #343A40', flex: 1, marginTop: '-1px', marginBottom: '-1px' }} />
          <div style={{ borderLeft: '3px solid #343A40', borderBottom: '3px solid #343A40', width: '12px', height: '8px', borderBottomLeftRadius: '2px' }} />
        </div>

        <table className="border-collapse">
          <tbody>
            {matrix.values.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isFrac = matrix.isFraction?.[rowIndex]?.[colIndex];
                  const currentOp = matrix.operations?.[rowIndex]?.[colIndex] || '';
                  const [numStr, denStr] = currentOp.includes('/')
                    ? currentOp.split('/')
                    : ['', ''];
                  const focused = isCellFocused(rowIndex, colIndex);

                  return (
                    <td key={colIndex} className="p-1">
                      <div
                        className={`w-14 h-12 rounded-md transition-all flex items-center justify-center ${getCellBorderClass(rowIndex, colIndex)}`}
                        onFocus={() => setFocusedCell({ r: rowIndex, c: colIndex })}
                      >
                        {isFrac ? (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '2px',
                              width: '100%',
                              padding: '2px 4px',
                            }}
                          >
                            <input
                              type="text"
                              value={numStr}
                              onChange={(e) =>
                                handleFractionChange(rowIndex, colIndex, 'num', e.target.value)
                              }
                              onFocus={() => setFocusedCell({ r: rowIndex, c: colIndex })}
                              disabled={!editable}
                              placeholder="a"
                              style={{
                                width: '100%',
                                textAlign: 'center',
                                fontSize: '0.7rem',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'inherit',
                              }}
                            />
                            <div
                              style={{
                                width: '75%',
                                height: '1.5px',
                                background: focused ? '#6366f1' : '#9ca3af',
                                borderRadius: '1px',
                                transition: 'background 0.15s',
                              }}
                            />
                            <input
                              type="text"
                              value={denStr}
                              onChange={(e) =>
                                handleFractionChange(rowIndex, colIndex, 'den', e.target.value)
                              }
                              onFocus={() => setFocusedCell({ r: rowIndex, c: colIndex })}
                              disabled={!editable}
                              placeholder="b"
                              style={{
                                width: '100%',
                                textAlign: 'center',
                                fontSize: '0.7rem',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'inherit',
                              }}
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={cell === null ? '' : cell.toString()}
                            onChange={(e) =>
                              handleNormalChange(rowIndex, colIndex, e.target.value)
                            }
                            onFocus={() => setFocusedCell({ r: rowIndex, c: colIndex })}
                            disabled={!editable}
                            placeholder="0"
                            style={{
                              width: '100%',
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: 'inherit',
                            }}
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col justify-between self-stretch ml-2 py-1">
          <div style={{ borderRight: '3px solid #343A40', borderTop: '3px solid #343A40', width: '12px', height: '8px', borderTopRightRadius: '2px' }} />
          <div style={{ borderRight: '3px solid #343A40', flex: 1, marginTop: '-1px', marginBottom: '-1px' }} />
          <div style={{ borderRight: '3px solid #343A40', borderBottom: '3px solid #343A40', width: '12px', height: '8px', borderBottomRightRadius: '2px' }} />
        </div>
      </div>
    </div>
  );
}