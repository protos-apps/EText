// Checks message cookie onload creates a message element and deletes the cookie

window.onload = () => {
    let message = getCookie('message');
    //make element
    if(message !== ''){
        makeMessage(getCookie('message'));
        document.cookie = 'message=';
    }
};


function getCookie(cookiename) {
    // Idk how this works, but I got it off stack overflow and it works
    var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function makeMessage(text){
    let messageElement = document.createElement('div');
    messageElement.id = 'message';
    messageElement.textContent = text;
    let closeButton = document.createElement('a');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', (event) => {deleteMessage();});
    messageElement.appendChild(closeButton);
    document.body.appendChild(messageElement);
}
