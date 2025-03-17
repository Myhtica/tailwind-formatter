// cases/mixed/complex.expected.tsx
function Component({
  isActive,
  isMobile,
}: {
  isActive: boolean;
  isMobile: boolean;
}) {
  return (
    <div
      className={`
        flex
        p-4
        md:block md:p-6
        lg:grid lg:p-8
        ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-black"}
        ${isMobile ? "text-sm" : "text-base"}
      `}
    >
      Complex Content
    </div>
  );
}
