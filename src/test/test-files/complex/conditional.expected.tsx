// cases/complex/conditional.expected.tsx
function Component({
  isActive,
  variant,
  size,
}: {
  isActive: boolean;
  variant: string;
  size: string;
}) {
  const baseClasses = "flex items-center rounded";
  return (
    <button
      className={`
        ${baseClasses}
        ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-black"}
        ${variant === "outline" && "border-2 border-current"}
        ${size === "large" ? "p-6 text-lg" : "p-4 text-base"}
        ${size === "small" && "p-2 text-sm"}
      `}
    >
      Click me
    </button>
  );
}
