import { renderSites, loadSites, clearCache} from "./rooms.mjs";

const ROOMS_EVENT_URL = 'https://dartagnan.cg.helmo.be/~p150107/memory/php/quotes.php';

loadSites().then(sites => renderSites(sites));

let eventSource = new EventSource(ROOMS_EVENT_URL);

eventSource.onmessage = function (event) {
    if (event.type === "disturbance") {
        console.log("Type disturbance détecté (event)");
    }
    let citationJson = JSON.parse(event.data);
    let quote = document.getElementById("quote");
    quote.innerHTML = citationJson.quote;
    quote.setAttribute("cite", citationJson.from);
}

document.getElementById('clearBtn').addEventListener('click', () => {
   clearCache();
   loadSites().then(sites => renderSites(sites));
});