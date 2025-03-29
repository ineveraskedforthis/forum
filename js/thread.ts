var thread_id : string;
var last_post_id : string;

async function get_posts() {

    try {
        const params = new URLSearchParams();
        params.append("thread", thread_id);
        params.append("last_post", last_post_id);

        let url = window.location.origin + `/fetch_posts/?${params}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
    }

        const text = await response.text();

        let thread = document.getElementsByClassName("thread").item(0)
        if (thread) {
            thread.innerHTML = text
            window.scrollTo(0, document.body.scrollHeight);
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
        }
    } catch (error) {
        console.error(error.message);
    }
}


window.onload = () => {
    window.scrollTo(0, document.body.scrollHeight);
    let fetch_posts_button = document.getElementById("fetch_posts");
    if (fetch_posts_button) {
        fetch_posts_button.onclick = (e) => {
            e.preventDefault();
            get_posts().then(
                () => {
                    console.log("posts fetched")
                }
            )
        }
    } else {
        alert("Invalid page, no fetch posts button")
    }
}

