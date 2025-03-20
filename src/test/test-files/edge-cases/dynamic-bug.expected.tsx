let isActive = true;
<div
  className={`
    p-4 m-2
    text-white
    ${isActive ? "bg-blue-500" : "bg-gray-300"}
  `}
>
  Dynamic classes
</div>;
