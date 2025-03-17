// cases/static/long-classes.expected.tsx
function Component() {
  return (
    <div
      className="
        container flex flex-col
        min-h-screen
        mx-auto px-4 py-8
        text-white font-sans leading-normal tracking-wider
        bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        border border-opacity-20 rounded-xl
        shadow-2xl transition-all cursor-pointer select-none
        items-center justify-center antialiased uppercase backdrop-blur-sm duration-300 ease-in-out hover:scale-105
      "
    >
      Long Class List
    </div>
  );
}
