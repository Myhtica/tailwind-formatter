// viewports/inline-mixed.expected.tsx
const InlineMixed = () => {
  return (
    <div
      className="
        flex sm:flex-row md:flex-col lg:flex-row
        p-4 sm:p-6 md:p-8 lg:p-10
        text-sm sm:text-base md:text-lg lg:text-xl
        items-center justify-center sm:items-start sm:justify-start md:items-end md:justify-end lg:items-center lg:justify-between
      "
    >
      <span
        className="
          w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12
          mr-2 sm:mr-3 md:mr-4 lg:mr-5
        "
      >
        Icon with mixed inline responsive classes
      </span>
    </div>
  );
};

export default InlineMixed;
