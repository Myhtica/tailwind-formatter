// cases/responsive/breakpoints.tsx
function Component() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6 md:grid-cols-3 md:gap-8 md:p-8 lg:grid-cols-4 lg:gap-10 lg:p-10 xl:grid-cols-5 xl:gap-12 xl:p-12 2xl:grid-cols-6 2xl:gap-14 2xl:p-14">
      <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
        Responsive Text
      </span>
    </div>
  );
}
