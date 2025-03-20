// viewports/separate-mixed.tsx
const SeparateMixed = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 m-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm md:flex-row md:items-start md:text-base md:bg-gray-50 lg:p-6 lg:m-4 lg:rounded-lg lg:shadow-md">
      <span className="inline-block w-6 h-6 mr-2 md:w-8 md:h-8 lg:w-10 lg:h-10">
        Icon
      </span>
      <p className="text-center md:text-left lg:text-lg">
        Test content with mixed responsive classes
      </p>
    </div>
  );
};

export default SeparateMixed;
