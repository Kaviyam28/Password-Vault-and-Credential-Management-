import axios from "axios";
import { useEffect, useState } from "react";
import "./ReceivedCredentials.css";

function ReceivedCredentials() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCredential, setSelectedCredential] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    website: "",
    username: "",
    password: "",
    notes: ""
  });

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchReceivedCredentials();
  }, []);

  const fetchReceivedCredentials = async () => {
    if (!userEmail) {
      alert("User email not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://password-vault-and-credential-management-4n8d.onrender.com/api/sharing/received/${encodeURIComponent(
          userEmail
        )}`
      );

      console.log("Received credentials:");
      console.log(response.data);

      setCredentials(response.data);
    } catch (error) {
      console.error(
        "Error fetching shared credentials:",
        error
      );

      if (error.response) {
        alert(
          "Server Error (" +
            error.response.status +
            "): " +
            (error.response.data?.message ||
              error.response.data ||
              "Failed to load shared credentials")
        );
      } else if (error.request) {
        alert(
          "No response from Spring Boot server.\n\n" +
            "Make sure Spring Boot is running on port 8080."
        );
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OPEN CREDENTIAL
  // ==========================================

  const viewCredential = async (sharingId, openEdit = false) => {
    if (!sharingId) {
      alert("Sharing ID is missing.");
      console.error("Missing sharing ID:", sharingId);
      return;
    }

    try {
      setViewLoading(true);

      const response = await axios.get(
        `https://password-vault-and-credential-management-4n8d.onrender.com/api/sharing/credential/${sharingId}`
      );

      const credential = response.data;

      if (!credential.sharingId) {
        console.error(
          "Backend response does not contain sharingId:",
          credential
        );

        alert("Sharing ID was not returned by the backend.");
        return;
      }

      setSelectedCredential(credential);

      setEditForm({
        website: credential.website || "",
        username: credential.username || "",
        password: credential.password || "",
        notes: credential.notes || ""
      });

      if (
        openEdit &&
        (credential.permission === "EDIT" ||
          credential.permission === "FULL")
      ) {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error(
        "Error opening shared credential:",
        error
      );

      if (error.response) {
        alert(
          error.response.data?.message ||
            error.response.data ||
            "Unable to open shared credential"
        );
      } else if (error.request) {
        alert(
          "No response from Spring Boot server.\n\n" +
            "Make sure Spring Boot is running on port 8080."
        );
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setViewLoading(false);
    }
  };

  // ==========================================
  // CHECK EDIT PERMISSION
  // ==========================================

  const canEdit = () => {
    if (!selectedCredential) {
      return false;
    }

    return (
      selectedCredential.permission === "EDIT" ||
      selectedCredential.permission === "FULL"
    );
  };

  // ==========================================
  // START EDITING
  // ==========================================

  const startEditing = () => {
    if (!canEdit()) {
      alert(
        "You only have View permission for this credential."
      );
      return;
    }

    if (!selectedCredential.sharingId) {
      alert("Sharing ID is missing.");
      return;
    }

    setEditForm({
      website: selectedCredential.website || "",
      username: selectedCredential.username || "",
      password: selectedCredential.password || "",
      notes: selectedCredential.notes || ""
    });

    setIsEditing(true);
  };

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================

  const saveChanges = async () => {
    if (!canEdit()) {
      alert(
        "You do not have permission to edit this credential."
      );
      return;
    }

    if (!editForm.website.trim()) {
      alert("Website cannot be empty.");
      return;
    }

    if (!editForm.username.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    if (!selectedCredential?.sharingId) {
      alert(
        "Sharing ID is missing. Please close and reopen the credential."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `https://password-vault-and-credential-management-4n8d.onrender.com/api/sharing/credential/${selectedCredential.sharingId}`,
        {
          website: editForm.website,
          username: editForm.username,
          password: editForm.password,
          notes: editForm.notes,
          userEmail: userEmail
        }
      );

      console.log("Updated credential:", response.data);

      setSelectedCredential((previous) => ({
        ...previous,
        website: editForm.website,
        username: editForm.username,
        password: editForm.password,
        notes: editForm.notes
      }));

      setCredentials((previousCredentials) =>
        previousCredentials.map((item) => {
          if (item.id === selectedCredential.sharingId) {
            return {
              ...item,
              ...response.data
            };
          }

          return item;
        })
      );

      setIsEditing(false);

      alert("Credential updated successfully!");
    } catch (error) {
      console.error(
        "Error updating credential:",
        error
      );

      if (error.response) {
        alert(
          "Update failed (" +
            error.response.status +
            "): " +
            (error.response.data?.message ||
              error.response.data ||
              "Unable to update credential")
        );
      } else if (error.request) {
        alert(
          "No response from Spring Boot server.\n\n" +
            "Make sure Spring Boot is running on port 8080."
        );
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const cancelEditing = () => {
    if (!selectedCredential) {
      return;
    }

    setEditForm({
      website: selectedCredential.website || "",
      username: selectedCredential.username || "",
      password: selectedCredential.password || "",
      notes: selectedCredential.notes || ""
    });

    setIsEditing(false);
  };

  // ==========================================
  // CLOSE POPUP
  // ==========================================

  const closeCredential = () => {
    setSelectedCredential(null);
    setIsEditing(false);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "No expiry";
    }

    return new Date(date).toLocaleString();
  };

  // ==========================================
  // PERMISSION TEXT
  // ==========================================

  const getPermissionText = (permission) => {
    if (permission === "VIEW") {
      return "View Only";
    }

    if (permission === "EDIT") {
      return "View & Edit";
    }

    if (permission === "FULL") {
      return "Full Access";
    }

    return permission || "Not available";
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (item) => {
    if (!item.active) {
      return "Revoked / Expired";
    }

    if (item.expiresAt) {
      const expiry = new Date(item.expiresAt);

      if (expiry < new Date()) {
        return "Expired";
      }
    }

    return "Active";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="received-container">
        <h2 className="received-title">
          📥 Shared Credentials
        </h2>

        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      <div className="received-container">

        <h2 className="received-title">
          📥 Shared Credentials
        </h2>

        <p className="received-email">
          Logged in as:{" "}
          <strong>{userEmail}</strong>
        </p>

        {credentials.length === 0 ? (
          <div className="empty-credentials">
            <h3>No shared credentials</h3>

            <p>
              You don't have any credentials shared
              with you yet.
            </p>
          </div>
        ) : (
          <div className="credentials-list">

            {credentials.map((item) => {
              const itemCanEdit =
                item.permission === "EDIT" ||
                item.permission === "FULL";

              const status = getStatus(item);

              return (
                <div
                  key={item.id}
                  className="credential-card"
                >
                  <h3 className="credential-card-title">
                    🔐 Shared Credential
                  </h3>

                  <p>
                    <strong>Shared By:</strong>{" "}
                    {item.ownerEmail}
                  </p>

                  <p>
                    <strong>Permission:</strong>{" "}
                    {getPermissionText(
                      item.permission
                    )}
                  </p>

                  <p>
                    <strong>Expiry:</strong>{" "}
                    {formatDate(item.expiresAt)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {status}
                    </span>
                  </p>

                  {item.active && (
                    <div className="credential-button-row">

                      {/* VIEW */}
                      <button
                        className="received-view-button"
                        onClick={() =>
                          viewCredential(
                            item.id,
                            false
                          )
                        }
                        disabled={viewLoading}
                      >
                        {viewLoading
                          ? "Opening..."
                          : "👁 View Credential"}
                      </button>

                      {/* EDIT */}
                      {itemCanEdit && (
                        <button
                          className="received-edit-button"
                          onClick={() =>
                            viewCredential(
                              item.id,
                              true
                            )
                          }
                          disabled={viewLoading}
                        >
                          ✏️ Edit Credential
                        </button>
                      )}

                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* ==========================================
          CREDENTIAL POPUP
      ========================================== */}

      {selectedCredential && (
        <div className="credential-overlay">

          <div className="credential-popup">

            <h2 className="popup-title">
              🔐 Shared Credential
            </h2>

            {/* VIEW MODE */}

            {!isEditing && (
              <>
                <div className="credential-detail-box">

                  <p>
                    <strong>Website:</strong>{" "}
                    {selectedCredential.website}
                  </p>

                  <p>
                    <strong>Username:</strong>{" "}
                    {selectedCredential.username}
                  </p>

                  <p>
                    <strong>Password:</strong>{" "}
                    {selectedCredential.password}
                  </p>

                  <p>
                    <strong>Notes:</strong>{" "}
                    {selectedCredential.notes ||
                      "No notes"}
                  </p>

                  <p>
                    <strong>Permission:</strong>{" "}
                    {getPermissionText(
                      selectedCredential.permission
                    )}
                  </p>

                </div>

                <div className="popup-buttons">

                  {canEdit() && (
                    <button
                      onClick={startEditing}
                      className="popup-edit-button"
                    >
                      ✏️ Edit Credential
                    </button>
                  )}

                  <button
                    onClick={closeCredential}
                    className="popup-close-button"
                  >
                    Close
                  </button>

                </div>
              </>
            )}

            {/* EDIT MODE */}

            {isEditing && (
              <>
                <div className="edit-notice">
                  ✏️ You have permission to edit
                  this credential.
                </div>

                <div className="form-group">
                  <label>Website</label>

                  <input
                    type="text"
                    name="website"
                    value={editForm.website}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>

                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="text"
                    name="password"
                    value={editForm.password}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    rows="4"
                  />
                </div>

                <div className="popup-buttons">

                  <button
                    onClick={saveChanges}
                    className="popup-save-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "💾 Save Changes"}
                  </button>

                  <button
                    onClick={cancelEditing}
                    className="popup-cancel-button"
                    disabled={saving}
                  >
                    ❌ Cancel
                  </button>

                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default ReceivedCredentials;