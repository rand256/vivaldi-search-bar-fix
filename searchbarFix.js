(function() {
	setTimeout(function wait() {
		if (document.getElementById("browser")) {
			run();
		} else {
			setTimeout(wait, 300);
		}
	}, 300);
	function run() {
		var replaced = false,
			isShiftedHE = false,
			typedSearchInput = '',
			typedSelectionStart = null,
			typedSelectionEnd = null;
		const inputNode = document.querySelector('.SearchField .searchfield-input');
		const restoreNode = function(e, setPos, logTitle) {
			console.log('attempt to restore in ', logTitle, 'to', typedSearchInput);
			e.target.value = typedSearchInput;
			e.target.setAttribute('value', typedSearchInput);
			if (setPos) {
				e.target.setSelectionRange(typedSelectionStart,typedSelectionEnd);
			}
		};
		if (!inputNode) {
			console.log("searchbarFix failed, no input node!");
			return;
		}
		inputNode.addEventListener('keyup', function(e) {
			if ((e.keyCode === 35 /* End */ || e.keyCode === 36 /* Home */) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
				if (isShiftedHE) {
					 // if HE press was started when shift key was down (and is already up by this point),
					 // then content is untouched and restoration isn't needed
					 isShiftedHE = false;
					 return true;
				}
				setTimeout(_ => {
					if (!document.querySelector('.SearchField .OmniDropdown .OmniDropdown-Collection') && !replaced) {
						// if there were no search suggestions opened at all, there should be no need to restore,
						// BUT if we already replaced the content, vivaldi will try to re-set it back even when suggestions are already gone
						// so in this case we still need to track it and fix again (and again, and again)
						return;
					}
					// set variables for cursor position appropriately
					if (e.keyCode === 35) {
						typedSelectionStart = typedSelectionEnd = -1; // end for End key
					} else {
						typedSelectionStart = typedSelectionEnd = 0; // start for Home key
					}
					// restore the content that was typed before
					restoreNode(e, true, 'HE-up');
					// mark that we from now on need to start tracking some additional events and
					// restore search bar contents upon those
					replaced = true;
				},50);
			} else if (e.keyCode === 17 /* Ctrl */) {
				if (replaced) {
					setTimeout(_ => restoreNode(e, true, 'Ctrl-up'), 50);
				}
			} else {
				// if input text differs, then assume it's fixed and we don't need restoring anymore
				if (typedSearchInput !== e.target.value) {
					replaced = false;
				}
				typedSearchInput = e.target.value;
				typedSelectionStart = e.target.selectionStart;
				typedSelectionEnd = e.target.selectionEnd;
			}
		});
		inputNode.addEventListener('change', function(e) {
			/*if (replaced) {
				setTimeout(_ => {
					console.log('attempt to restore in change to',typedSearchInput);
					e.target.value = typedSearchInput;
					e.target.setSelectionRange(typedSelectionStart,typedSelectionEnd);
				},50);
			} else {*/
				console.log('updating tSI on change = ',e.target.value);
				typedSearchInput = e.target.value;
			//}
		});
		inputNode.addEventListener('blur', function(e) {
			if (replaced) {
				setTimeout(_ => restoreNode(e, false, 'blur'), 50);
			}
		});
		inputNode.addEventListener('focus', function(e) {
			if (replaced) {
				setTimeout(_ => restoreNode(e, false, 'focus'), 50);
			}
		});
		inputNode.addEventListener('keydown', function(e) {
			if (e.keyCode === 35 /* End */ || e.keyCode === 36 /* Home */) {
				if (e.shiftKey) {
					isShiftedHE = true;
				} else {
					isShiftedHE = false;
				}
			} else if (e.keyCode === 17 /* Ctrl */) {
				if (replaced) {
					setTimeout(_ => restoreNode(e, true, 'Ctrl-down'), 50);
				}
			}
		});
	}
})();
