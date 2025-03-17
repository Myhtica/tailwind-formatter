// src/test/test-files/threshold/mixed.tsx
let isActive = true;

<div>
  <span className="p-2 m-1">Under threshold</span>
  <button className="flex items-center justify-center p-4 m-2 text-white bg-blue-500 hover:bg-blue-600 rounded">
    Over threshold
  </button>
  <div className={`${isActive ? "bg-green-500" : ""} p-4`}>
    Under threshold dynamic
  </div>
</div>;
