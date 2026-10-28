/**
 * Name of the cookie that stores the users view mode choice
 */
const darkModeCookieName = "dark_mode";

/**
 * Set cookie value
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

/**
 * Get cookie value
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for(const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if(cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

/**
 * Turns dark mode on or off
 * @param {boolean} isDark
 */
function setDarkMode(isDark) {
    const body = document.body;
    const darkSwitch = document.querySelector(".view-mode-switch.dark");
    const lightSwitch = document.querySelector(".view-mode-switch.light");

    if(isDark) {
        body.classList.add("is-dark");
        darkSwitch.classList.remove("active");
        lightSwitch.classList.add("active");
    } else {
        body.classList.remove("is-dark");
        lightSwitch.classList.remove("active");
        darkSwitch.classList.add("active");
    }

    setCookie(darkModeCookieName, isDark ? "1" : "0", 365);
}

// Apply the saved choice when the page loads
setDarkMode(getCookie(darkModeCookieName) === "1");

// Switch view mode on icon click
document.querySelectorAll(".view-mode-switch").forEach(viewModeSwitch => {
    viewModeSwitch.addEventListener("click", function() {
        setDarkMode(!document.body.classList.contains("is-dark"));
    });
});
