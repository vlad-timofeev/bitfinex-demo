import React from 'react';

export function renderTable(title, header1, header2, header3, rows) {
  return (
    <div>
      <div><b>{title}</b></div>
      <table>
        <tbody>
          <tr>
            <th>{header1}</th>
            <th>{header2}</th>
            <th>{header3}</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
}
