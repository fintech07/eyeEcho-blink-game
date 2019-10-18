var dmleyeEchoWrapperElement = document.getElementById("dml_eyeEcho_wrapper");

dmleyeEchoWrapperElement.style.transition = "all 0.5s;";

var eyeEcho_banner_cta_active = true;

var eyeEchoCSSid = 'eyeEchoStyleSheet';

let sessionTimeString = (new Date()).getTime();

var eyeEcho_pagehead = document.getElementsByTagName('head')[0];
var eyeEcho_pagelink = document.createElement('link');
eyeEcho_pagelink.id = eyeEchoCSSid;
eyeEcho_pagelink.rel = 'stylesheet';
eyeEcho_pagelink.type = 'text/css';
eyeEcho_pagelink.href = './stylesheets/style.min.css?' + sessionTimeString;
eyeEcho_pagelink.media = 'all';
eyeEcho_pagehead.appendChild(eyeEcho_pagelink);

window.eyeEcho_forcedLanguageCode = typeof window.eyeEcho_forcedLanguageCode != "undefined" ? window.eyeEcho_forcedLanguageCode : "";
window.eyeEcho_hasBanner = typeof window.eyeEcho_hasBanner != "undefined" ? window.eyeEcho_hasBanner : true;
window.eyeEcho_isEmbed = typeof window.eyeEcho_isEmbed != "undefined" ? window.eyeEcho_isEmbed : true;
window.eyeEcho_maxwidth = typeof window.eyeEcho_maxwidth != "undefined" ? window.eyeEcho_maxwidth : "100%";
window.eyeEcho_maxheight = typeof window.eyeEcho_maxheight != "undefined" ? window.eyeEcho_maxheight : window.innerHeight + "px";
window.eyeEcho_bannerwidth = typeof window.eyeEcho_bannerwidth != "undefined" ? window.eyeEcho_bannerwidth : "100%";

window.eyeEcho_banner_cta_title = typeof window.eyeEcho_banner_cta_title != "undefined" ? window.eyeEcho_banner_cta_title : "eyeEcho touch";
window.eyeEcho_banner_cta_text = typeof window.eyeEcho_banner_cta_text != "undefined" ? window.eyeEcho_banner_cta_text : "reawaken your skin with the <b>power of touch</b>";
window.eyeEcho_banner_cta_button = typeof window.eyeEcho_banner_cta_button != "undefined" ? window.eyeEcho_banner_cta_button : "show me how";


dmleyeEchoWrapperElement.style.width = window.eyeEcho_maxwidth;

function logOnLocalHostFrontEnd(inStringBefore, inVariable) {
	inStringBefore = (inStringBefore === undefined) ? '' : inStringBefore;
	if (/localhost/g.test("./js") || /192\.168\.0\./g.test("./js") || /\.ngrok\.io/g.test("./js") || /facemappingconsumer-staging\.herokuapp/g.test("./js")) {
		if (inVariable == undefined) {
			console.log(inStringBefore)
		} else {
			console.log(inStringBefore, inVariable)
		}
	}
}
// GA - START

window.eyeEchoGAsetup = false;

function eyeEchoSendGA(eventName, eventValue) {
	eventValue = (eventValue == undefined) ? "" : eventValue;
	if (window.eyeEchoGAsetup) {
		if (window.ga) {
			window.ga('eyeEcho_gtag.send', 'event', eventName, eventValue);
		} else if (window.gtag) {
			window.gtag('event', eventName, {
				value: eventValue
			});
		} else if (window._gaq) {
			window._gaq.push(['eyeEcho_gtag._trackEvent', eventName, eventValue]);
		}
	}
}

function eyeEchoSetupGA() {
	let pageTitle = "not found";
	pageTitle = window.location.hostname;
	if (window.gtag) {
		window.gtag('config', 'UA-36853599-24', {
			'anonymize_ip': true,
			'page_title': pageTitle,
			'page_location': window.location.href
		});
	} else if (window.ga) {
		window.ga('create', 'UA-36853599-24', 'auto', 'eyeEcho_gtag'); // change with new value!
		window.ga('eyeEcho_gtag.set', 'anonymizeIp', true);
		window.ga('eyeEcho_gtag.send', 'pageview', window.location.href);
	} else if (window._gaq) {
		window._gaq.push(['eyeEcho_gtag._setAccount', 'UA-36853599-24'], ['eyeEcho_gtag._trackPageview']);
	}
	window.eyeEchoGAsetup = true;
}

//eyeEchoSetupGA();

// GA - END

function getEmbedHtmlData(url, callback) {
	let request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			callback({
				"status": "success",
				"status_code": request.status,
				"data": request.responseText
			});
		} else {
			// We reached our target server, but it returned an error
			callback({
				"status": "success",
				"status_code": request.status,
				"data": "We reached our target server, but it returned an error"
			});
		}
	};

	request.onerror = function () {
		// There was a connection error of some sort
		callback({
			"error": "success",
			"status_code": request.status,
			"data": "Error occured in getting html data"
		});
	};
	request.send();
}

function dmleyeEcho_getScript(source, callback) {
	//console.log('inside get script call');
	var script = document.createElement('script');
	//var prior = document.getElementsByTagName('script')[0];
	script.async = 1;

	script.onload = function (evt) {
		//console.log(source ," ready state: ",evt);
		if (callback !== undefined) {
			callback({
				"status": "success",
				"message": "done"
			});
		}
	};

	script.onerror = function (err) {
		console.log(err)
		callback({
			"status": "error",
			"message": "error in getting script " + source
		});
	}

	script.setAttribute('type', 'text/javascript');

	script.src = source;
	dmleyeEchoWrapperElement.appendChild(script);
	
	console.log(source);
}

function dmleyeEcho_getScript_withAttributes(source, attributeObj, callback) {
	//console.log('inside get script call');
	var script = document.createElement('script');
	//var prior = document.getElementsByTagName('script')[0];
	script.async = 1;

	script.onload = function (evt) {
		//console.log(source ," ready state: ",evt);
		callback({
			"status": "success",
			"message": "done"
		});
	};

	script.onerror = function (err) {
		console.log(err)
		callback({
			"status": "error",
			"message": "error in getting script " + source
		});
	}

	script.setAttribute('type', 'text/javascript');
	try {
		Object.keys(attributeObj).forEach(function (attrKey) {
			script.setAttribute(attrKey, attributeObj[attrKey]);
		});

	} catch (err) {
		console.log(err);
	}

	script.src = source;
	dmleyeEchoWrapperElement.appendChild(script);


}


function eyeEchoOpenApp() {
	if (dmleyeEchoWrapperElement.offsetWidth > 768 && false) {
		dmleyeEchoWrapperElement.innerHTML += '<div id="eyeEcho_body"><div id="eyeEcho_no_desktop_screen"><div id="eyeEcho_no_desktop_screen_logo"></div><div id="eyeEcho_no_desktop_screen_sep_line"></div><h2 id="eyeEcho_no_desktop_screen_headline">hey! we are almost ready to launch eyeEcho touch for desktop.</h2><p id="eyeEcho_no_desktop_screen_still_interested">Still interested?</p><p id="eyeEcho_no_desktop_screen_open_mobile">To preview this widget now, visit <b>www.eyeEchotouch.com</b> from your mobile device</p></div></div>'
		document.getElementById("eyeEcho_no_desktop_screen").style.height = Math.min(dmleyeEchoWrapperElement.offsetWidth * 0.55, window.innerHeight) + "px";
	} else {

		if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/))) {
			setTimeout(function () {
				eyeEchoSendGA("openApp", "Browser Not Supported");
			}, 1000);
			if (!window.eyeEcho_isEmbed) {
				dmleyeEchoWrapperElement.style.height = "100vh";
			}
			dmleyeEchoWrapperElement.innerHTML = '<div id="eyeEcho_browser_not_sup_wrapper"><div id="eyeEcho_browser_error_image"><img src="./js/img/eyeEcho_face_error.svg"/></div><p id="eyeEcho_browser_error_text">We don\'t currently support this browser. Please reopen this page in a different browser, such as <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>.</p></div>';
			//dmleyeEchoWrapperElement.style.background = "url('./js/img/screen2-bg.png') no-repeat center center";
			dmleyeEchoWrapperElement.style.background = "lightblue";
			dmleyeEchoWrapperElement.style.backgroundSize = "cover";
		} else {
			setTimeout(function () {
				eyeEchoSendGA("openApp", "loading full script");
			}, 1000);
			getEmbedHtmlData('./views/eyeEcho.html?' + sessionTimeString, function (res) {

				dmleyeEcho_getScript('./js/variables.js?'+ sessionTimeString);
				dmleyeEcho_getScript('./js/language_controls.js?'+ sessionTimeString);
				dmleyeEcho_getScript('./js/page_controls.js?'+ sessionTimeString);
				dmleyeEcho_getScript('./js/eyeEcho_blink_game.js?'+ sessionTimeString);
				dmleyeEcho_getScript('./js/blink_controls.js?'+ sessionTimeString);

				window.data = res.data;
				if (window.eyeEcho_isEmbed && window.eyeEcho_hasBanner) {
					let eyeEchoBannerElement = document.getElementById("eyeEcho_cta_banner");
					eyeEchoBannerElement.style.opacity = 0;
					
					setTimeout(function () {
						dmleyeEchoWrapperElement.innerHTML = res.data + dmleyeEchoWrapperElement.innerHTML;
						document.getElementById("eyeEcho_body").style.height = window.eyeEcho_maxheight;

						document.getElementById("eyeEcho_cta_banner").style.display = "none";
						dmleyeEchoWrapperElement.style.maxHeight = window.eyeEcho_maxheight;
						dmleyeEchoWrapperElement.style.width = window.eyeEcho_maxwidth;
						dmleyeEchoWrapperElement.style.height = window.eyeEcho_maxheight;
						dmleyeEchoWrapperElement.style.maxHeight = window.eyeEcho_maxheight;

						dmleyeEcho_getScript('./js/script.js?' + sessionTimeString, function () {
							document.getElementById("eyeEcho_body").style.opacity = 1;

						});


					}, 500)

				} else {
					dmleyeEchoWrapperElement.innerHTML = res.data + dmleyeEchoWrapperElement.innerHTML;
					document.getElementById("eyeEcho_body").style.height = window.innerHeight + "px";
					dmleyeEcho_getScript('./js/script.js?' + sessionTimeString, function () {
						document.getElementById("eyeEcho_body").style.opacity = 1;
					});
				}



			})
		}


	}

}

function eyeEchoMakeBanner() {
	let bannerWidth;
	if (window.eyeEcho_bannerwidth.indexOf("%") > -1) {
		bannerWidth = dmleyeEchoWrapperElement.offsetWidth * Number(window.eyeEcho_bannerwidth.replace("%", "")) / 100;
	} else {
		bannerWidth = Number(window.eyeEcho_bannerwidth.replace("px", "").replace("%", ""));
	}



	if (bannerWidth > 500) {
		dmleyeEchoWrapperElement.innerHTML += '<div id="eyeEcho_cta_banner" onclick="changeToApp();"><div id="eyeEcho_banner_inner_part">' +
			'<div id="eyeEcho_banner_content"><div id="eyeEcho_banner_logo"></div><h2 id="eyeEcho_banner_cta_title">' + eyeEcho_banner_cta_title + '</h2><div id="eyeEcho_banner_sep"></div><p id="eyeEcho_banner_cta_text">' + window.eyeEcho_banner_cta_text + '</p><p id="eyeEcho_banner_cta_button">' + window.eyeEcho_banner_cta_button + '</p></div></div></div>'

		document.getElementById("eyeEcho_cta_banner").style.backgroundImage = "url('./js/img/eyeEcho-touch-pdp.jpg')";

	} else {

		dmleyeEchoWrapperElement.innerHTML += '<div id="eyeEcho_cta_banner" onclick="changeToApp();"><div id="eyeEcho_banner_inner_part">' +
			'<div id="eyeEcho_banner_content"><div id="eyeEcho_banner_logo"></div><h2 id="eyeEcho_banner_cta_title">' + eyeEcho_banner_cta_title + '</h2><div id="eyeEcho_banner_sep"></div><p id="eyeEcho_banner_cta_text">' + window.eyeEcho_banner_cta_text + '</p><p id="eyeEcho_banner_cta_button">' + window.eyeEcho_banner_cta_button + '</p></div></div></div>'

		document.getElementById("eyeEcho_cta_banner").style.backgroundImage = "url('./js/img/eyeEcho-touch-mobile-image.jpg')";
		document.getElementById("eyeEcho_cta_banner").style.height = (dmleyeEchoWrapperElement.offsetWidth * 1197 / 700) + "px";
	}

}

function changeToApp() {
	if (eyeEcho_banner_cta_active) {

		eyeEchoOpenApp()
		eyeEcho_banner_cta_active = false;
	}
}


// global functions


window.eyeEchoSetCookie = function (cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

window.eyeEchoReadCookie = function (cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

// start app/banner

if (window.location.search.indexOf("eyeEcho_hid") > -1) {
	window.eyeEcho_hasBanner = false;
}

if (!window.eyeEcho_isEmbed || !window.eyeEcho_hasBanner) {
	eyeEchoOpenApp()

} else {
	eyeEchoMakeBanner();
}