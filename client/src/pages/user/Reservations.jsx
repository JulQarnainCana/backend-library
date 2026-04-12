import { useState } from "react";
import "../../styles/pages.css";

const initial = [
  { id: 1, title: "The Great Gatsby", status: "Available", queue: 0, requested: "—" },
  { id: 2, title: "1984", status: "Wait list", queue: 2, requested: "Apr 2, 2026" },
  { id: 3, title: "Brave New World", status: "Reserved", queue: 0, requested: "Apr 8, 2026" },
];

export default function Reservations() {
  const [rows, setRows] = useState(initial);

  const today = () =>
    new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const placeHold = (id) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status === "Available") {
          return { ...r, status: "Reserved", queue: 0, requested: today() };
        }
        return {
          ...r,
          status: "Wait list",
          queue: (r.queue || 0) + 1,
          requested: today(),
        };
      })
    );
    alert("Reservation recorded (demo). Connect your API to persist.");
  };

  return (
    <>
      <h1>Reservation</h1>
      <p>Place a reservation on available books or join a waiting list when copies are checked out.</p>

      <div className="page-card">
        <h2>How it works</h2>
        <p className="desc">
          Use <strong>Reserve</strong> when copies are available. Use <strong>Join wait list</strong> to
          queue when the title is fully on loan.
        </p>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Queue</th>
              <th>Requested</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "Available"
                        ? "badge-success"
                        : r.status === "Wait list"
                          ? "badge-warn"
                          : "badge-muted"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.queue === 0 ? "—" : r.queue}</td>
                <td>{r.requested}</td>
                <td>
                  <button type="button" className="btn-sm primary" onClick={() => placeHold(r.id)}>
                    {r.status === "Available" ? "Reserve" : "Join wait list"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
