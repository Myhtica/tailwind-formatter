// viewports/separate-categories.expected.tsx
const SeparateCategories = () => {
  return (
    <div
      className="
        flex flex-col
        p-4 m-2 space-y-4
        text-sm font-medium text-gray-800
        bg-white
        border border-gray-200 rounded-md
        shadow-sm
        sm:p-6 sm:m-4 sm:space-y-6 sm:text-base sm:font-semibold sm:bg-gray-50
        md:flex-row md:space-y-0 md:space-x-4 md:text-lg md:rounded-lg md:shadow-md
        lg:p-8 lg:m-6 lg:space-x-6 lg:text-xl lg:font-bold lg:shadow-lg
      "
    >
      <div
        className="
          w-full h-24
          bg-blue-100
          md:w-1/2
          lg:w-1/3
        "
      >
        Box with categories and responsiveness
      </div>
      <div
        className="
          w-full h-24
          bg-green-100
          md:w-1/2
          lg:w-2/3
        "
      >
        Another box with categories and responsiveness
      </div>
    </div>
  );
};

export default SeparateCategories;
