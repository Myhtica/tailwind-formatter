// cases/responsive/breakpoints.expected.tsx
function Component() {
  return (
    <div
      className="
        grid grid-cols-1
        p-4
        gap-4
        sm:grid-cols-2 sm:p-6 sm:gap-6
        md:grid-cols-3 md:p-8 md:gap-8
        lg:grid-cols-4 lg:p-10 lg:gap-10
        xl:grid-cols-5 xl:p-12 xl:gap-12
        2xl:grid-cols-6 2xl:p-14 2xl:gap-14
      "
    >
      <span
        className="
          text-sm
          sm:text-base
          md:text-lg
          lg:text-xl
          xl:text-2xl
          2xl:text-3xl
        "
      >
        Responsive Text
      </span>
    </div>
  );
}
