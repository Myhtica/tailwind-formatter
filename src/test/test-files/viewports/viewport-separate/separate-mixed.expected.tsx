// viewports/separate-mixed.expected.tsx
const SeparateMixed = () => {
  return (
    <div
      className="
        flex flex-col
        p-4 m-2
        text-sm text-gray-800
        bg-white
        border border-gray-200 rounded-md
        shadow-sm
        items-center justify-center
        md:flex-row md:text-base md:bg-gray-50 md:items-start
        lg:p-6 lg:m-4 lg:rounded-lg lg:shadow-md
      "
    >
      <span
        className="
          inline-block
          w-6 h-6
          mr-2
          md:w-8 md:h-8
          lg:w-10 lg:h-10
        "
      >
        Icon
      </span>
      <p
        className="
          text-center
          md:text-left
          lg:text-lg
        "
      >
        Test content with mixed responsive classes
      </p>
    </div>
  );
};

export default SeparateMixed;
