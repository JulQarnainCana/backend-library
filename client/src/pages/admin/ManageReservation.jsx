import { useState } from "react";
import "../../styles/pages.css";

const seed = [
  { id: "R-01", member: "carl@school.edu", book: "1984", type: "Hold", status: "Pending" },
  { id: "R-02", member: "dana@school.edu", book: "Pride and Prejudice", type: "Wait list", status: "Pending" },
];

export default function ManageReservation() {
  const [rows, setRows] = useState(seed);

  const fulfill = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    alert("Reservation fulfilled (demo).");
  };

  const approve = (id) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
    alert("Reservation approved (demo).");
  };

  return (
    <>
      <h1>Admin reservation management</h1>
      <p>Approve holds and fulfill reservations when copies are ready for pickup.</p>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member</th>
              <th>Book</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.member}</td>
                <td>{r.book}</td>
                <td>{r.type}</td>
                <td>
                  <span className={`badge ${r.status === "Approved" ? "badge-success" : "badge-warn"}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className="btn-row">
                    {r.status === "Pending" && (
                      <button type="button" className="btn-sm secondary" onClick={() => approve(r.id)}>
                        Approve
                      </button>
                    )}
                    <button type="button" className="btn-sm primary" onClick={() => fulfill(r.id)}>
                      Fulfill
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
