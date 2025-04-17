<template>
  <div class="notification-container p-4 fixed top-0 right-0 z-50">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification bg-white shadow-lg rounded-lg mb-3 overflow-hidden border border-gray-100 flex transition-all duration-300 transform translate-x-0"
    >
      <div
        :class="`notification-color w-2 ${getNotificationColorClass(notification.type)}`"
      ></div>
      <div class="notification-content p-4 pl-3 flex-grow">
        <div class="flex justify-between items-start">
          <h3 class="font-medium text-gray-900 text-base">
            {{ notification.title }}
          </h3>
          <button
            @click="removeNotification(notification.id)"
            class="text-gray-400 hover:text-gray-600 focus:outline-none ml-4"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 text-sm mt-1">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationSystem",
  data() {
    return {
      notifications: [],
    };
  },
  methods: {
    getNotificationColorClass(type) {
      const colors = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
      };
      return colors[type] || colors.info;
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },
  },
};
</script>
