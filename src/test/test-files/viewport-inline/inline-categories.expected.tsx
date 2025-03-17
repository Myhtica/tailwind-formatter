// viewports/inline-categories.expected.tsx
const InlineCategories = () => {
  return (
    <div
      className="
        flex sm:flex-row md:flex-col lg:flex-row
        p-4 m-2 space-y-2 sm:p-6 sm:m-4 sm:space-y-0 sm:space-x-2 md:p-8 md:m-6 md:space-y-4 md:space-x-0 lg:p-10 lg:m-8 lg:space-y-0 lg:space-x-4
        text-sm font-normal sm:text-base sm:font-medium md:text-lg md:font-semibold lg:text-xl lg:font-bold
        bg-white sm:bg-gray-50 md:bg-gray-100 lg:bg-gray-200
        border border-gray-200 sm:border-2 sm:border-gray-300 sm:rounded-md md:border-4 md:border-gray-400 md:rounded-lg lg:border-8 lg:border-gray-500 lg:rounded-xl
        sm:shadow-md md:shadow-lg lg:shadow-xl
        rounded shadow
      "
    >
      <div
        className="
          w-full h-16 sm:w-1/2 sm:h-20 md:w-full md:h-24 lg:w-1/3 lg:h-32
          bg-blue-100 sm:bg-blue-200 md:bg-blue-300 lg:bg-blue-400
        "
      >
        Box with inline categorized responsive classes
      </div>
    </div>
  );
};

export default InlineCategories;
