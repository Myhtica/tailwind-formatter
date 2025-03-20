// src/test/test-files/always-single-line/multiple.tsx
let isActive = true;

<div>
  <span className="p-2 m-1">Short</span>
  <button className="flex p-4 m-2 text-white bg-blue-500 items-center justify-center">
    Long button
  </button>
  <div className={`p-4 ${isActive ? "bg-green-500" : "bg-red-500"}`}>
    Dynamic
  </div>
</div>;
