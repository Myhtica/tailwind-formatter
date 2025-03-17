// cases/static/multiple-elements.expected.tsx
function Component() {
  return (
    <div
      className="
        bg-white
        rounded-lg
        shadow-md
      "
    >
      <header
        className="
          p-4
          text-lg font-bold
          border-b
        "
      >
        Header Content
      </header>
      <main
        className="
          p-6 space-y-4
          bg-gray-50
        "
      >
        <section
          className="
            flex
            items-center justify-between
          "
        >
          <h2
            className="
              text-xl font-semibold text-gray-800
            "
          >
            Section Title
          </h2>
          <button
            className="
              px-4 py-2
              text-white
              bg-blue-500
              rounded
            "
          >
            Action
          </button>
        </section>
      </main>
      <footer
        className="
          p-4
          text-sm text-gray-600
          border-t
        "
      >
        Footer Content
      </footer>
    </div>
  );
}
