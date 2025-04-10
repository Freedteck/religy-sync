// Avatar.jsx
import { useMemo } from "react";

const generateColor = (address) => {
  // Simple hash function to generate a color from an address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex color
  const color = `#${(hash & 0xffffff).toString(16).padStart(6, "0")}`;
  return color;
};

const getInitials = (address) => {
  // Get first and last character of the address (excluding 0x prefix if present)
  const cleanAddress = address.startsWith("0x") ? address.slice(2) : address;
  return `${cleanAddress.charAt(0)}${cleanAddress.charAt(
    cleanAddress.length - 1
  )}`.toUpperCase();
};

const Avatar = ({ address, size = 40 }) => {
  const bgColor = useMemo(() => generateColor(address), [address]);
  const initials = useMemo(() => getInitials(address), [address]);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontSize: `${size / 2.5}px`,
        fontWeight: "bold",
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
