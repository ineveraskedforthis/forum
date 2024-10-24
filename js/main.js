// window.onload = () => window.scrollTo(0, document.body.scrollHeight);
var reply_buttons = document.querySelectorAll(".reply-button");
reply_buttons.forEach(function (item) {
    var id = parseInt(item.id.split("-")[2]);
    item.onclick = function () {
        var field = document.getElementById('message-area');
        if (field == null)
            alert("no message field");
        else
            field.value = field.value + ">>" + id;
    };
});
