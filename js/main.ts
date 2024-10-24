// window.onload = () => window.scrollTo(0, document.body.scrollHeight);

let reply_buttons = document.querySelectorAll(".reply-button")

reply_buttons.forEach((item) => {
    let id = parseInt(item.id.split("-")[2]);
    (item as HTMLElement).onclick = () =>  {
        let field = document.getElementById('message-area') as HTMLTextAreaElement
        if (field == null) {
            field = document.getElementById('new-thread-message-area') as HTMLTextAreaElement
        }
        if (field != null) field.value = field.value + ">>" + id + " "
    }
})