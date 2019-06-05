if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', {scope: '/'}).catch(e => console.log(e));
}

let promptEvent;

// Show install button if there's a promptEvent
// and the install button has been loaded.
function refresh() {
	const installButton = document.getElementById("install");
	if (!installButton) return;
	if (promptEvent) {
		installButton.hidden = false;
		installButton.addEventListener("click", install);
	}
	else {
		installButton.hidden = true;
		installButton.removeEventListener("click", install);
	}
}

// in case beforeinstallprompt was called before the content loaded.
window.addEventListener("DOMContentLoaded", e => {
	refresh();
})

window.addEventListener("beforeinstallprompt", e => {
	e.preventDefault();
	console.log("beforeinstallprompt")
	promptEvent = e;
	refresh();
});

function install() {
	console.log("huihu")
	promptEvent.prompt();
	promptEvent.userChoice.then(choice => {
		console.log(choice);
		if (choice.outcome !== "dismissed") {
			promptEvent = undefined;
		}
		refresh();
	});
}

window.addEventListener("appinstalled", e => {
	console.log("app installed");
});
