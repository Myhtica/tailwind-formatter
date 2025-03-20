// always-multi-line/dynamic.tsx
function Component() {
  let isActive = true;
  return (
    <div
      className={`p-4 m-2 ${isActive ? "bg-blue-500" : "bg-gray-300"} text-white`}
    >
      Dynamic classes
    </div>
  );
}
