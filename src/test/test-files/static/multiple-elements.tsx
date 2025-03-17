// cases/static/multiple-elements.tsx
function Component() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <header className="text-lg font-bold border-b p-4">Header Content</header>
      <main className="p-6 space-y-4 bg-gray-50">
        <section className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Section Title</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Action
          </button>
        </section>
      </main>
      <footer className="border-t p-4 text-sm text-gray-600">
        Footer Content
      </footer>
    </div>
  );
}
