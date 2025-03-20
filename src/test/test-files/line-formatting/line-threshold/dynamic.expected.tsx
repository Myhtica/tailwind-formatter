let isActive = true;

<div
  className={`
    p-4 m-2
    text-lg font-bold
    ${isActive ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"}
  `}
>
  Dynamic over threshold
</div>;
