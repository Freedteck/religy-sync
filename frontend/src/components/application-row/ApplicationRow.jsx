import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./ApplicationRow.module.css";
const ApplicationRow = ({
  address,
  name,
  tradition,
  date,
  status,
  onApprove,
  onReject,
  hasView,
  onView,
}) => {
  const badgeClass =
    status === "approved"
      ? styles.badgeApproved
      : status === "rejected"
      ? styles.badgeRejected
      : styles.badgePending;

  return (
    <tr>
      <td>{truncateAddress(address)}</td>
      <td>{tradition}</td>
      <td>{name}</td>
      <td>{date}</td>
      <td>
        <span className={`${styles.badge} ${badgeClass}`}>{status}</span>
      </td>
      <td className={styles.actionButtons}>
        {!hasView ? (
          <>
            {status === "pending" ? (
              <>
                <button
                  className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}
                  onClick={onApprove}
                >
                  Approve
                </button>
                <button
                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                  onClick={onReject}
                >
                  Reject
                </button>
              </>
            ) : status === "approved" ? (
              "Approved"
            ) : (
              "Rejected"
            )}
          </>
        ) : (
          <button
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
            onClick={onView}
          >
            View Application
          </button>
        )}
      </td>
    </tr>
  );
};

export default ApplicationRow;
