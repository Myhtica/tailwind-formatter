// cases/dynamic/conditional.tsx
function Component({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`p-4 ${isActive ? "bg-blue-500" : "bg-gray-500"} text-white`}
    >
      Content
    </div>
  );
}
