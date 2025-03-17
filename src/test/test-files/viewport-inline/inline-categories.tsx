// viewports/inline-categories.tsx
const InlineCategories = () => {
  return (
    <div className="flex sm:flex-row md:flex-col lg:flex-row p-4 sm:p-6 md:p-8 lg:p-10 m-2 sm:m-4 md:m-6 lg:m-8 space-y-2 sm:space-y-0 sm:space-x-2 md:space-y-4 md:space-x-0 lg:space-y-0 lg:space-x-4 text-sm sm:text-base md:text-lg lg:text-xl font-normal sm:font-medium md:font-semibold lg:font-bold bg-white sm:bg-gray-50 md:bg-gray-100 lg:bg-gray-200 border sm:border-2 md:border-4 lg:border-8 border-gray-200 sm:border-gray-300 md:border-gray-400 lg:border-gray-500 rounded sm:rounded-md md:rounded-lg lg:rounded-xl shadow sm:shadow-md md:shadow-lg lg:shadow-xl">
      <div className="w-full sm:w-1/2 md:w-full lg:w-1/3 h-16 sm:h-20 md:h-24 lg:h-32 bg-blue-100 sm:bg-blue-200 md:bg-blue-300 lg:bg-blue-400">
        Box with inline categorized responsive classes
      </div>
    </div>
  );
};

export default InlineCategories;
