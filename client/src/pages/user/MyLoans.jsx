import { useState } from "react";
import "../../styles/pages.css";

const initialLoans = [
  {
    id: "L-101",
    title: "To Kill a Mockingbird",
    borrowed: "Mar 15, 2026",
    due: "Apr 14, 2026",
    fine: 0,
    status: "On loan",
  },
  {
    id: "L-102",
    title: "Moby Dick",
    borrowed: "Mar 1, 2026",
    due: "Mar 29, 2026",
    fine: 2.5,
    status: "Overdue",
  },
];

export default function MyLoans() {
  const [loans] = useState(initialLoans);

  return (
    <>
      <h1>MyLoans</h1>
      <p>Current borrowed books, due dates, and overdue fines.</p>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Loan</th>
              <th>Title</th>
              <th>Borrowed</th>
              <th>Due</th>
              <th>Fine</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>{row.borrowed}</td>
                <td>{row.due}</td>
                <td>{row.fine > 0 ? `$${row.fine.toFixed(2)}` : "—"}</td>
                <td>
                  <span className={`badge ${row.status === "Overdue" ? "badge-danger" : "badge-success"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
