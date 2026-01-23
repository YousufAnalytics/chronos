import React from 'react';
import './TableCard.css';

interface TableCardProps {
  title?: string;
  columns: {
    key: string;
    header: string;
    width?: string;
  }[];
  data: Record<string, any>[];
  keyField: string;
}

const TableCard: React.FC<TableCardProps> = ({
  title,
  columns,
  data,
  keyField,
}) => {
  // Render cell content
  const renderCell = (value: any) => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return value.toString();
  };

  return (
    <div className="table-card">
      {/* Title */}
      {title && <h3 className="table-card-title">{title}</h3>}

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ 
                    width: column.width,
                    textAlign: "left"
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row[keyField]}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{ textAlign: "left" }}
                    >
                      {renderCell(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-message">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCard;