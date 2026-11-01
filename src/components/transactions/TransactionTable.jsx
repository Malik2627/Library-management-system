import React from 'react';

export function TransactionTable({ transactions = [] }) {
  return (
    <div className="table-wrapper">
      <table className="glass-table">
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Book Title</th>
            <th>Borrower</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td><span className="txn-id">{tx.id}</span></td>
              <td><strong className="text-white">{tx.bookTitle}</strong></td>
              <td>{tx.studentName}</td>
              <td>{tx.issueDate}</td>
              <td>{tx.dueDate}</td>
              <td>
                <span className={`status-pill ${tx.status === 'Returned' ? 'emerald' : 'cyan'}`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

