let isActive = true;

<div>
  <span className="p-2 m-1">Under threshold</span>
  <button
    className="
      flex
      p-4 m-2
      text-white
      bg-blue-500
      items-center justify-center hover:bg-blue-600 rounded
    "
  >
    Over threshold
  </button>
  <div className={`p-4 ${isActive ? "bg-green-500" : ""}`}>
    Under threshold dynamic
  </div>
</div>;
