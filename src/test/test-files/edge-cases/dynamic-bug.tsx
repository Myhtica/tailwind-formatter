// cases/edge-case/dynamic-bug.tsx BUG: REGEX DOES NOT MATCH
let isActive = true;
<div
  className={`p-4 m-2 ${isActive ? "bg-blue-500" : "bg-gray-300"} text-white`}
>
  Dynamic classes
</div>;
