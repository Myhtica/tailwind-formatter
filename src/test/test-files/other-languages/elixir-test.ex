defmodule MyApp.LiveView.Dashboard do
  use Phoenix.LiveView
  alias MyApp.Stats

  def mount(_params, _session, socket) do
    if connected?(socket) do
      :timer.send_interval(5000, self(), :update_stats)
    end

    stats = Stats.get_latest()

    {:ok, assign(socket, stats: stats)}
  end

  def handle_info(:update_stats, socket) do
    stats = Stats.get_latest()
    {:noreply, assign(socket, stats: stats)}
  end

  def render(assigns) do
    ~H"""
    <div class="bg-gray-100 min-h-screen p-4 md:p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Dashboard</h1>
          <div class="flex space-x-2">
            <button phx-click="refresh" class="bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Refresh
            </button>
            <button phx-click="export" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 border border-transparent rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Export
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Subscribers</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900"><%= @stats.subscribers %></dd>
              </dl>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">View all</a>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Avg. Open Rate</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900"><%= @stats.open_rate %>%</dd>
              </dl>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">View all</a>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">New Signups</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900"><%= @stats.new_users %></dd>
              </dl>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">View all</a>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Campaigns</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900"><%= @stats.active_campaigns %></dd>
              </dl>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">View all</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
