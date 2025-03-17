// cases/dynamic/conditional.expected.tsx
function Component({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`
        p-4
        text-white
        ${isActive ? "bg-blue-500" : "bg-gray-500"}
      `}
    >
      Content
    </div>
  );
}
