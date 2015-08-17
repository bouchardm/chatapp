'use strict';

importScripts('/indexdbwrapper.js');

// Affiche une notification
function showNotification(title, body, icon, data) {
    var notificationOptions = {
        body: body,
        icon: icon ? icon : 'images/touch/chrome-touch-icon-192x192.png',
        tag: 'chat-bouchardm-com',
        data: data
    };
    if (self.registration.showNotification) {
        self.registration.showNotification(title, notificationOptions);
        return;
    } else {
        new Notification(title, notificationOptions);
    }
}

// Gestion de l'envoie de notifivation à partir de serveur
self.addEventListener('push', function(event) {
        // on va allez chercher le dernier message puis l'afficher
        var title = 'Nouveau message';
        var message = 'Un beau et nouveau message';

        showNotification(title, message);
});

// Click on the notification
self.addEventListener('notificationclick', function(event) {
        var url = "https://chat.bouchardm.com";
        event.waitUntil(clients.openWindow(url));
});
//# sourceMappingURL=service-worker.js.map