import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchNotifications, markAsRead } from "../api/notifications";

export default function Notifications() {
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /* ---------------- Fetch Notifications ---------------- */

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data || []);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ---------------- Lock Body Scroll ---------------- */

  useEffect(() => {
    document.body.classList.toggle("modal-open", showModal);
    return () => document.body.classList.remove("modal-open");
  }, [showModal]);

  /* ---------------- Derived ---------------- */

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* ---------------- Actions ---------------- */

  const handleRead = async (n) => {
    if (!n.is_read) {
      try {
        await markAsRead(n.id);
        setNotifications((prev) =>
          prev.map((i) =>
            i.id === n.id ? { ...i, is_read: true } : i
          )
        );
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* 🔔 NOTIFICATION ICON */}
      <button
        className="btn btn-light position-relative"
        onClick={() => setShowModal(true)}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📩 MODAL */}
      {showModal &&
        createPortal(
          <>
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content rounded-3 shadow">
                  {/* HEADER */}
                  <div className="modal-header flex-column align-items-start">
                    <h5 className="modal-title mb-0">Notifications</h5>
                    <small className="text-muted">
                      Click to mark as read
                    </small>
                    <button
                      type="button"
                      className="btn-close position-absolute end-0 me-3"
                      onClick={() => setShowModal(false)}
                    />
                  </div>

                  {/* BODY */}
                  <div className="modal-body p-0">
                    {notifications.length === 0 ? (
                      <div className="text-muted text-center py-4">
                        No notifications
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {notifications.map((n) => {
                          const isUnread = !n.is_read;

                          return (
                            <div
                              key={n.id}
                              onClick={() => handleRead(n)}
                              className={`list-group-item list-group-item-action ${
                                isUnread ? "fw-semibold" : ""
                              }`}
                              style={{
                                cursor: "pointer",
                                backgroundColor: isUnread
                                  ? "#eef6ff"
                                  : "white",
                                borderLeft: isUnread
                                  ? "4px solid #0d6efd"
                                  : "4px solid transparent",
                              }}
                            >
                              <div>{n.message}</div>
                              <div className="text-muted small mt-1">
                                {new Date(n.created_at).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* BACKDROP */}
            <div
              className="modal-backdrop fade show"
              onClick={() => setShowModal(false)}
            />
          </>,
          document.body
        )}
    </>
  );
}
