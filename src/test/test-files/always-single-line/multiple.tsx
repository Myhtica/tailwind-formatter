// src/test/test-files/always-single-line/multiple.tsx
let isActive = true;

<div>
  <span className="p-2 m-1">Short</span>
  <button className="flex items-center justify-center p-4 m-2 text-white bg-blue-500">
    Long button
  </button>
  <div className={`${isActive ? "bg-green-500" : "bg-red-500"} p-4`}>
    Dynamic
  </div>
</div>;
