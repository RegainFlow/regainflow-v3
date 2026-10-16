/**
 * The blog's reading-mode key, shared by the toggle and the pre-paint script on
 * the post page. Its own key, not the gov one — see `ReadingModeToggle`.
 */
export const READ_THEME_KEY = "rf-read-theme";

/**
 * Resolves the reading mode before first paint: a saved choice wins, and with
 * none the reader's OS setting decides. The research favours a light ground
 * for long reads and NN/g says to let the reader choose (`docs/blogs_seo/
 * blog_ui_ux.md`, Part 3.1); following `prefers-color-scheme` does both, and a
 * reader on a dark OS still gets the house look.
 *
 * Runs inline as the `.rf-read` wrapper's first child, so it sees the wrapper
 * and nothing below it has rendered yet — the same pattern as
 * `app/gov/layout.tsx`. Storage is read in its own `try` so a blocked
 * `localStorage` still falls through to the OS setting. The key is the only
 * interpolation, and it is a constant.
 */
export const READ_THEME_SCRIPT = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(READ_THEME_KEY)})}catch(e){}var el=document.currentScript.parentElement;if(t==="light"||(t!=="dark"&&window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches))el.dataset.theme="light"})()`;
