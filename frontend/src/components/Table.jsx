// src/components/Table.jsx
import React from "react";
import PropTypes from "prop-types";

export const Table = ({ columns, data, loading }) => {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.4)" }}>
                Loading records...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.4)" }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.accessor}>
                    {col.Cell ? col.Cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

Table.defaultProps = {
  loading: false,
};

export default Table;
