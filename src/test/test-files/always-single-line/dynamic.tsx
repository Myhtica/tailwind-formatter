// src/test/test-files/always-single-line/dynamic.tsx
let isActive = true;

<div className={`p-4 m-2 ${isActive ? "bg-blue-500" : "bg-gray-500"} text-lg`}>
  Dynamic example
</div>;
