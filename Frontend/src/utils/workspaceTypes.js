export const WORKSPACE_TYPES = [
  { key: "hotdesk", label: "Hot Desk", icon: "🪑", desc: "Shared open seating, pay by the day" },
  { key: "dedicated", label: "Dedicated Desk", icon: "🖥️", desc: "Your own fixed desk, monthly" },
  { key: "cabin", label: "Private Cabin", icon: "🚪", desc: "Enclosed space for individuals or small teams" },
  { key: "meeting", label: "Meeting Room", icon: "🗓️", desc: "Book by the hour for calls & clients" },
  { key: "managed", label: "Managed Office", icon: "🏢", desc: "Fully managed office for larger teams" },
];

export const getTypeInfo = (key) =>
  WORKSPACE_TYPES.find((t) => t.key === key) || WORKSPACE_TYPES[0];