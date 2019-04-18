import { factory as ButtonFactory } from './button.js';

export default function(in_document, in_elementToFullScreen, in_elementToAttachButton, in_buttonStyle){
	const button = ButtonFactory(in_document, in_elementToAttachButton, "full", function(){
		if (null !== in_document.fullScreenElement){
			openFullscreen();
		} else {
			closeFullscreen();
		}
	}, in_buttonStyle);

	/* View in fullscreen, document.fullScreenElement is non-null when full screen */
	function openFullscreen() {
		if (in_elementToFullScreen.requestFullscreen) {
			in_elementToFullScreen.requestFullscreen();
		} else if (in_elementToFullScreen.mozRequestFullScreen) { /* Firefox */
			in_elementToFullScreen.mozRequestFullScreen();
		} else if (in_elementToFullScreen.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			in_elementToFullScreen.webkitRequestFullscreen();
		} else if (in_elementToFullScreen.msRequestFullscreen) { /* IE/Edge */
			in_elementToFullScreen.msRequestFullscreen();
		}
		return;
	}

	/* Close fullscreen */
	function closeFullscreen() {
		if (in_document.exitFullscreen) {
			in_document.exitFullscreen();
		} else if (in_document.mozCancelFullScreen) { /* Firefox */
			in_document.mozCancelFullScreen();
		} else if (in_document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			in_document.webkitExitFullscreen();
		} else if (in_document.msExitFullscreen) { /* IE/Edge */
			in_document.msExitFullscreen();
		}
		return;
	}

	return;
}
