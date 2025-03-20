// viewports/inline-multiple.expected.tsx
const InlineMultiple = () => {
  return (
    <div
      className="
        p-4 m-2 sm:p-6 sm:m-4 md:p-8 md:m-6 lg:p-10 lg:m-8 xl:p-12 xl:m-10 2xl:p-16 2xl:m-12
        bg-blue-500 sm:bg-blue-400 md:bg-blue-300 lg:bg-blue-200 xl:bg-blue-100 2xl:bg-blue-50
      "
    >
      Test content with multiple breakpoints inline
    </div>
  );
};

export default InlineMultiple;
