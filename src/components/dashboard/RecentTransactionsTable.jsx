import React from 'react';
import { ArrowLeftRight, Clock, CheckCircle2, RotateCcw, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RecentTransactionsTable({ transactions = [], onReturn }) {
  return (
    <div className="glass-card recent-transactions-card">
      <div className="card-header-flex">
        <div>
          <h3 className="section-title">Recent Circulation Transactions</h3>
          <p className="section-desc">Realtime stream of book borrowings and returns</p>
        </div>
        <Link to="/transactions" className="section-link">
          <span>View All</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Book Title</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center empty-table-cell">
                  <div className="empty-state">
                    <ArrowLeftRight size={32} className="empty-icon" />
                    <p className="empty-title">No transactions recorded</p>
                    <p className="empty-subtitle">Use the Quick Issue button to checkout books to students.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span className="txn-id">{tx.id}</span>
                  </td>
                  <td>
                    <strong className="text-white table-book-title-cell">{tx.bookTitle}</strong>
                  </td>
                  <td>
                    <span className="table-member-name">{tx.studentName}</span>
                  </td>
                  <td>{tx.issueDate}</td>
                  <td>
                    <span className={`status-pill ${tx.status === 'Returned' ? 'emerald' : 'purple'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="text-right">
                    {tx.status === 'Issued' && onReturn ? (
                      <button
                        type="button"
                        className="glass-btn action-sm"
                        onClick={() => onReturn(tx.id)}
                        title="Quick Return"
                      >
                        <RotateCcw size={13} />
                        <span>Return</span>
                      </button>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>Closed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactionsTable;

