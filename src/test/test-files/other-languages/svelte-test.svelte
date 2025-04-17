<script>
  import { fade, fly } from 'svelte/transition';
  
  export let tabs = ['Dashboard', 'Analytics', 'Reports', 'Settings'];
  let activeTab = 'Dashboard';
  
  function setActiveTab(tab) {
    activeTab = tab;
  }
</script>

<div class="w-full p-4 bg-gray-50">
  <div class="max-w-4xl mx-auto">
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex -mb-px space-x-8">
        {#each tabs as tab}
          <button 
            on:click={() => setActiveTab(tab)} 
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 ease-out
            {activeTab === tab 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            {tab}
          </button>
        {/each}
      </nav>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      {#if activeTab === 'Dashboard'}
        <div transition:fade>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
          <p class="text-gray-600 mb-6">Welcome to your dashboard. Here's a summary of your recent activity.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 class="font-medium text-blue-800 mb-1">Total Users</h3>
              <p class="text-2xl font-bold text-blue-900">1,234</p>
            </div>
            <div class="bg-green-50 p-4 rounded-md border border-green-100">
              <h3 class="font-medium text-green-800 mb-1">Revenue</h3>
              <p class="text-2xl font-bold text-green-900">$12,345</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-md border border-purple-100">
              <h3 class="font-medium text-purple-800 mb-1">Conversion</h3>
              <p class="text-2xl font-bold text-purple-900">5.67%</p>
            </div>
          </div>
        </div>
      {:else}
        <div transition:fly={{ y: 20, duration: 300 }}>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">{activeTab}</h2>
          <p class="text-gray-600">Content for {activeTab} tab goes here.</p>
        </div>
      {/if}
    </div>
  </div>
</div>