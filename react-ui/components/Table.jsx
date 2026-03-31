import React from 'react';

export const Table = ({ columns = [], data = [], className = '' }) => {
  return (
    <div className={`table-container ${className}`} style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ 
                padding: '12px 16px', 
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                fontWeight: 600,
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                position: 'sticky',
                top: 0
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.id || rowIdx} style={{ transition: 'background-color 150ms linear' }}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} style={{ 
                  padding: '12px 16px', 
                  borderBottom: rowIdx === data.length - 1 ? 'none' : '1px solid var(--border-color)' 
                }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
