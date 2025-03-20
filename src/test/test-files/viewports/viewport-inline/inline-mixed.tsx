// viewports/inline-mixed.tsx
const InlineMixed = () => {
  return (
    <div className="flex sm:flex-row md:flex-col lg:flex-row items-center sm:items-start md:items-end lg:items-center justify-center sm:justify-start md:justify-end lg:justify-between p-4 sm:p-6 md:p-8 lg:p-10 text-sm sm:text-base md:text-lg lg:text-xl">
      <span className="w-6 sm:w-8 md:w-10 lg:w-12 h-6 sm:h-8 md:h-10 lg:h-12 mr-2 sm:mr-3 md:mr-4 lg:mr-5">
        Icon with mixed inline responsive classes
      </span>
    </div>
  );
};

export default InlineMixed;
