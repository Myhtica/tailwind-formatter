// src/test/test-files/threshold/dynamic.tsx
let isActive = true;

<div
  className={`p-4 m-2 ${isActive ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"} text-lg font-bold`}
>
  Dynamic over threshold
</div>;
