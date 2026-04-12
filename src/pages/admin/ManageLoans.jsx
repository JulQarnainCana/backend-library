import { useState } from "react";
import "../../styles/pages.css";

const seed = [
  { id: "C-201", member: "ana@school.edu", book: "Brave New World", due: "Apr 20, 2026" },
  { id: "C-202", member: "ben@school.edu", book: "Moby Dick", due: "Apr 5, 2026" },
];

export default function ManageLoans() {
  const [rows, setRows] = useState(seed);

  const checkIn = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    alert(`Checked in ${id} (demo).`);
  };

  const checkOut = () => {
    alert("Wire this to your circulation endpoint for check-out (demo).");
  };

  return (
    <>
      <h1>Circulation control</h1>
      <p>Process book check-outs and check-ins.</p>

      <div className="page-card">
        <h2>Check-out</h2>
        <p className="desc">Scan or select member and copy to start a loan.</p>
        <button type="button" className="btn-primary" onClick={checkOut}>
          New check-out
        </button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Loan</th>
              <th>Member</th>
              <th>Book</th>
              <th>Due</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>
                  No active loans in the demo list.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.member}</td>
                  <td>{r.book}</td>
                  <td>{r.due}</td>
                  <td>
                    <button type="button" className="btn-sm primary" onClick={() => checkIn(r.id)}>
                      Check in
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
