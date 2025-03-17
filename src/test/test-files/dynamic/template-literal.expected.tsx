// cases/dynamic/template-literal.expected.tsx
function Component({ isActive, user }: { isActive: boolean; user: any }) {
  return (
    <div
      className={`
        flex
        bg-gray-100
        ${isActive ? "p-6" : "p-4"}
        ${user.role === "admin" ? "text-red-500" : "text-blue-500"}
      `}
    >
      Dynamic Content
    </div>
  );
}
