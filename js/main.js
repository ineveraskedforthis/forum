var reply_buttons = document.querySelectorAll(".reply-button");
reply_buttons.forEach(function (item) {
    var id = parseInt(item.id.split("-")[2]);
    item.onclick = function () {
        var field = document.getElementById('message-area');
        if (field == null) {
            field = document.getElementById('new-thread-message-area');
        }
        if (field != null)
            field.value = field.value + ">>" + id + " ";
    };
});
