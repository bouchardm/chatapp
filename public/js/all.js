// ==UserScript==
// @name          Drag to Resize
// @namespace 	  http://kylej.name/
// @description	  Drag to resize images, based on code in the RES.
// @author        Kabaka
// @include       *
// @exclude       http://www.chess.com/*
// @exclude       http://chess.com/*
// ==/UserScript==

/*
 * Drag to Resize - Drag images to resize them no matter where you are.
 *
 * The image resizing code was extracted from honestbleeps's
 * (steve@honestbleeps.com) Reddit Enhancement Suite, a GPL
 * Greasemonkey script. The idea was, as far as I know, all his. What
 * I've done is duplicated that feature in this script and started
 * adding on things to make it useful in different contexts.
 *
 * Because it now runs everywhere, it will likely break some web
 * sites. And it definitely opens up doors for some silliness such as
 * making images hilariously gigantic. If this script causes you to
 * lose data, money, or time, don't hold me responsible!
 *
 *
 * Instructions:
 *
 *   To resize an image, hold the left mouse button and drag. Down and to the
 *   right will expand. Up and to the left will shrink. Images aligned to the
 *   right will expand in an unusual way. Sorry.
 *
 *   To reset an image to original size, right-click it.
 *
 *   To make an image fit the screen (by height), double-click.
 *
 *   To drag an image without resizing (as if the script were not installed),
 *   hold control (or command on Mac) and drag.
 *
 *
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var imageData = Array();

/*
 * Find all img elements on the page and feed them to makeImageZoomable().
 * Also, record the image's original width in imageData[] in case the user
 * wants to restore size later.
 */
function findAllImages() {
  var imgs = document.getElementsByTagName('img');

  for (i = 0; i < imgs.length; ++i) {
    // We will populate this as the user interacts with the image, if they
    // do at all.
    imageData[i]         = {};
    imageData[i].resized = false;

    imgs[i].dragToResizeId = i;

    makeImageZoomable(imgs[i]);
  }

}

/*
 * Calculate the drag size for the event. This is taken directly from
 * honestbleeps's Reddit Enhancement Suite.
 *
 * @param mousedown e or mousemove event.
 * @return Size for image resizing.
 */
function getDragSize(e) {
  return (p = Math.pow)(p(e.clientX - (rc = e.target.getBoundingClientRect()).left, 2) + p(e.clientY - rc.top, 2), .5);
}

/*
 * Get the viewport's vertical size. This should work in most browsers. We'll
 * use this when making images fit the screen by height.
 *
 * @return int Viewport size.
 */
function getHeight() {
  return window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
}

/*
 * Get the imageData entry for the given event's target.
 *
 * @return Object
 */
function getImageData(e) {
  return imageData[e.target.dragToResizeId];
}

/*
  * Try to stop propagation of an event.
  *
  * @param event e Event to stop.
  * @return false
  */
function stopEvent(e) {
  e.preventDefault();
  e.returnValue = false;
  e.stopPropagation();

  return false;
}

/*
 * Set up events for the given img element to make it zoomable via
 * drag to zoom. Most of this is taken directly from honestbleeps's
 * Reddit Enhancement Suite. Event functions are currently written
 * inline. For readability, I may move them. But the code is small
 * enough that I don't yet care.
 *
 * @param Object imgElement Image element.
 */
function makeImageZoomable(imgElement) {
  dragTargetData = {};

  imgElement.addEventListener('mousedown', function(e) {
    /*
     * This is so we can support the command key on Mac. The combination of OS
     * and browser changes how the key is passed to JavaScript. So we're just
     * going to catch all of them. This means we'll also be catching meta keys
     * for other systems. Oh well! Patches are welcome.
     */
    if (e.ctrlKey != 0 || (e.metaKey != null && e.metaKey != 0))
      return true;

    if (e.button !== 0)
      return false;

    // Store some data about the image in case we want to restore size later.

    var myImageData = getImageData(e);

    if (myImageData.position ==  null) {
      myImageData.zIndex   = e.target.style.zIndex;
      myImageData.width    = e.target.style.width;
      myImageData.height   = e.target.style.height;
      myImageData.position = e.target.style.position;
    }

    dragTargetData.image_width = e.target.width;
    dragTargetData.dragSize    = getDragSize(e);

    e.preventDefault();
  }, true);


  // Reset image to original size and unlock for future events.
  imgElement.addEventListener('contextmenu', function(e) {
    var myImageData = getImageData(e);

    if (!myImageData.resized)
      return true;

    myImageData.resized = false;

    e.target.style.zIndex    = myImageData.zIndex;
    e.target.style.maxWidth  = e.target.style.width  = myImageData.width;
    e.target.style.maxHeight = e.target.style.height = myImageData.height;
    e.target.style.position  = myImageData.position;

    return stopEvent(e);
  }, true);

  // Expand image to fill screen.
  imgElement.addEventListener('dblclick', function(e) {
    if (e.ctrlKey != 0 || (e.metaKey != null && e.metaKey != 0))
      return true;

    var myImageData = getImageData(e);

    if (myImageData.resized) {
      // If we've already resized it, we have to set this back to the
      // original value. Otherwise, the max size image will keep the
      // original width. Dunno why!
      e.target.style.maxWidth = e.target.style.width = myImageData.width;
    }

    e.target.style.position  = "fixed";
    e.target.style.zIndex    = 1000;
    e.target.style.top       = 0;
    e.target.style.left      = 0;
    e.target.style.maxWidth  = e.target.style.width = "auto";
    e.target.style.maxHeight = e.target.style.height = getHeight() + "px";

    myImageData.resized = true;

    // Most browsers will want to save the image or something. Prevent that.

    return stopEvent(e);
  }, true);

  imgElement.addEventListener('mousemove', function(e) {
    if (!dragTargetData.dragSize)
      return true;

    e.target.style.maxWidth =
      e.target.style.width  =
      ((getDragSize(e)) * dragTargetData.image_width / dragTargetData.dragSize) + "px";

    e.target.style.maxHeight = '';
    e.target.style.height    = 'auto';
    e.target.style.zIndex    = 1000; // Make sure the image is on top.

    if (e.target.style.position == '') {
      e.target.style.position = 'relative';
    }

    getImageData(e).resized = true;
  }, false);

  imgElement.addEventListener('mouseout', function(e) {
    dragTargetData.dragSize = false;

    return !getImageData(e).resized;
  }, false);

  imgElement.addEventListener('mouseup', function(e) {
    dragTargetData.dragSize = false;

    return !getImageData(e).resized;
  }, true);

  imgElement.addEventListener('click', function(e) {
    if (e.ctrlKey != 0 || (e.metaKey != null && e.metaKey != 0))
      return true;

    dragTargetData.dragSize = false;

    if (getImageData(e).resized === false)
      return true;

    return stopEvent(e);
  }, false);
}

findAllImages();
document.addEventListener('dragstart', function() {return false}, false);

new Vue({
    el: '#messages',
    data: {
        messages: []
    },
    ready: function() {
        this.setupPusher();
        this.getMessages();
    },
    methods: {
        setupPusher: function() {
            var pusher = new Pusher('d85a864817e808027400', {
                encrypted: true
            });
            var channel = pusher.subscribe('messages');
            channel.bind('App\\Events\\MessageSent', this.addMessage);
        },
        addMessage: function(message) {
            this.messages.push(message.message);
        },
        getMessages: function() {
            this.$http.get('/messages', function(messages) {
                this.$set('messages', messages);
            });
        },
        deleteAll: function(e) {
            this.$http.get('/messages/clean', function(messages) {
                this.messages = []
            });
            e.preventDefault();
        },
        isImgLink: function(text) {
            return(text.match(/\.(jpeg|jpg|gif|png)$/) != null);
        },
        makeImageZoomable: function(img) {
            imageData[img.path[0]]         = {};
            imageData[img.path[0]].resized = false;
            img.path[0].dragToResizeId = img.path[0];
            makeImageZoomable(img.path[0]);
        }
    }
});

$('#message-form').submit(function() {
    // submit the form
    $(this).ajaxSubmit();
    $('#message-form #message-field').clearFields();
    $('#message-field').focus();
    // return false to prevent normal browser submit and page navigation
    return false;
});

$('#message-field').focus();
var isPushEnabled = false;

window.addEventListener('load', function() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.addEventListener('click', function() {
        if (isPushEnabled) {
            unsubscribe();
        } else {
            subscribe();
        }
    });

    // Check that service workers are supported, if so, progressively
    // enhance and add push messaging support, otherwise continue without it.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(initialiseState);
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }
});


// Once the service worker is registered set the initial state
function initialiseState() {
    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        console.warn('Push messaging isn\'t supported.');
        return;
    }

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                // Enable any UI which subscribes / unsubscribes from
                // push messages.
                var pushButton = document.querySelector('.js-push-button');
                pushButton.disabled = false;

                if (!subscription) {
                    // We aren't subscribed to push, so set UI
                    // to allow the user to enable push
                    return;
                }

                // Keep your server in sync with the latest subscriptionId
                sendSubscriptionToServer(subscription);

                // Set your UI to show they have subscribed for
                // push messages
                pushButton.textContent = 'Disable Push Messages';
                isPushEnabled = true;
            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
    });
}

function subscribe() {
    // Disable the button so it can't be changed while
    // we process the permission request
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription) {
                // The subscription was successful
                isPushEnabled = true;
                pushButton.textContent = 'Disable Push Messages';
                pushButton.disabled = false;

                // TODO: Send the subscription subscription.endpoint
                // to your server and save it to send a push message
                // at a later date
                return sendSubscriptionToServer(subscription);
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    // The user denied the notification permission which
                    // means we failed to subscribe and the user will need
                    // to manually change the notification permission to
                    // subscribe to push messages
                    window.Demo.debug.log('Permission for Notifications was denied');
                    pushButton.disabled = true;
                } else {
                    // A problem occurred with the subscription, this can
                    // often be down to an issue or lack of the gcm_sender_id
                    // and / or gcm_user_visible_only
                    window.Demo.debug.log('Unable to subscribe to push.', e);
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                }
            });
    });
}

function unsubscribe() {
    var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // To unsubscribe from push messaging, you need get the
        // subscription object, which you can call unsubscribe() on.
        serviceWorkerRegistration.pushManager.getSubscription().then(
            function(pushSubscription) {
                // Check we have a subscription to unsubscribe
                if (!pushSubscription) {
                    // No subscription object, so set the state
                    // to allow the user to subscribe to push
                    isPushEnabled = false;
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                    return;
                }

                // TODO: Make a request to your server to remove
                // the users data from your data store so you
                // don't attempt to send them push messages anymore

                // We have a subscription, so call unsubscribe on it
                pushSubscription.unsubscribe().then(function(successful) {
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                    isPushEnabled = false;
                }).catch(function(e) {
                    // We failed to unsubscribe, this can lead to
                    // an unusual state, so may be best to remove
                    // the users data from your data store and
                    // inform the user that you have done so

                    console.log('Unsubscription error: ', e);
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                });
            }).catch(function(e) {
                console.error('Error thrown while unsubscribing from push messaging.', e);
            });
    });
}

// This method handles the removal of subscriptionId
// in Chrome 44 by concatenating the subscription Id
// to the subscription endpoint
function endpointWorkaround(pushSubscription) {
    // Make sure we only mess with GCM
    if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
        return pushSubscription.endpoint;
    }

    var mergedEndpoint = pushSubscription.endpoint;
    // Chrome 42 + 43 will not have the subscriptionId attached
    // to the endpoint.
    if (pushSubscription.subscriptionId &&
        pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
        // Handle version 42 where you have separate subId and Endpoint
        mergedEndpoint = pushSubscription.endpoint + '/' +
            pushSubscription.subscriptionId;
    }
    return mergedEndpoint;
}

// Send the subscription to the server, so after it can send notification
function sendSubscriptionToServer(subscription) {
    //console.log(subscription);
    $.ajax({
        url: "subscription",
        context: document.body,
        method: 'POST',
        data: {
            'endpoint': subscription.endpoint
        }
    }).done(function(data) {
        console.log(data);
    });
}

self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var title = 'Yay a message.';
    var body = 'We have received a push message.';
    var icon = '/images/icon-192x192.png';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );
});


//# sourceMappingURL=all.js.map