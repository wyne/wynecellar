define([
    "stackmob"
], function(StackMob) {
    StackMob.init({
        publicKey: "4762736f-56c2-4de1-a520-cf1610ed8ff2",
        apiVersion: 0
    });

    // Return initialized StackMob object for use throughout the app
    return StackMob;
});