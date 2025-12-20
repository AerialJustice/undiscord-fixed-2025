// ==UserScript==
// @name            Undiscord (Fixed by Aerial - 12/21/2025)
// @description     Delete all messages in a Discord channel or DM
// @version         5.3.0
// @author          AerialJustice
// @homepageURL     https://github.com/AerialJustice/undiscord-fixed-2025
// @supportURL      https://github.com/AerialJustice/undiscord-fixed-2025/discussions
// @supportURL      https://github.com/victornpb/undiscord/discussions
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @namespace       https://github.com/AerialJustice/undiscord-fixed-2025
// @icon            https://victornpb.github.io/undiscord/images/icon128.png
// @contributionURL https://linktr.ee/diamondapp
// @grant           GM_download
// ==/UserScript==
(function() {
    'use strict';

    /* rollup-plugin-baked-env */
    const VERSION = "5.3.0";

    var themeCss = (`
/*
  UNDISCORD STANDALONE THEME
*/
:root {
  --u-bg: #313338;           /* Main Chat Background */
  --u-sidebar-bg: #2b2d31;   /* Sidebar Background */
  --u-header-bg: #2b2d31;    /* Header/Toolbar Background */
  --u-header-text: #f2f3f5;  /* Header Title */
  --u-text: #dbdee1;         /* Main Text */
  --u-desc: #949ba4;         /* Descriptions */
  --u-label: #b5bac1;        /* Labels */
  --u-border: #1e1f22;       /* Borders */
  --u-input-bg: #1e1f22;     /* Input Fields */
  --u-btn-bg: #4e5058;       /* Default Buttons */
  --u-btn-color: #ffffff;    /* Button Text */
  --u-scroll-thumb: #1a1b1e; /* Scrollbar */
}

/* MAIN WINDOW */
#undiscord.browser {
    box-shadow: 0 0 0 1px var(--u-border), 0 2px 10px 0 rgba(0,0,0,0.2);
    border: none;
    overflow: hidden;
}
#undiscord.container,
#undiscord .container {
    background-color: var(--u-bg);
    border-radius: 8px;
    box-sizing: border-box;
    cursor: default;
    flex-direction: column;
}

/* MINIMIZED MODE (COMPACT) */
#undiscord.minimized {
    height: auto !important;
    min-height: 0 !important;
    transition: height 0.2s ease;
    overflow: hidden;
    background-color: var(--u-header-bg) !important; /* Force Dark Header Color */
    box-shadow: none !important; /* Optional: Looks cleaner without shadow when minimized */
}

/* HIDE THESE when minimized */
#undiscord.minimized .sidebar,
#undiscord.minimized .logarea,
#undiscord.minimized .footer,
#undiscord.minimized .resize-handle {
    display: none !important;
}

/* KEEP THESE VISIBLE but auto-height */
#undiscord.minimized .window-body,
#undiscord.minimized .main {
    height: auto !important;
    flex-grow: 0 !important;
    min-height: 0 !important;
}

/* HEADER */
#undiscord .header {
    background-color: var(--u-header-bg);
    height: 48px;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    display: flex;
    color: var(--u-header-text);
    cursor: grab;
    border-bottom: 1px solid var(--u-border);

    /* FIX: Force full width */
    width: 100%;
    box-sizing: border-box;
}
#undiscord .header .icon { color: #b5bac1; margin-right: 8px; flex-shrink: 0; width: 24; height: 24; cursor: pointer; }
#undiscord .header .icon:hover { color: #dbdee1; }
#undiscord .header h3 { font-size: 16px; line-height: 20px; font-weight: 600; font-family: var(--font-display); color: var(--u-header-text); flex-shrink: 0; margin-right: 16px; }
#undiscord .spacer { flex-grow: 1; }
#undiscord .header .vert-divider { width: 1px; height: 24px; background-color: var(--u-border); margin-right: 16px; flex-shrink: 0; }

/* STATUS TEXT IN HEADER */
#undiscord .status-text {
    color: #dbdee1;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 15px;
    font-family: Consolas, monospace;
    opacity: 1;
    display: none; /* Default Hidden */
}
#undiscord.minimized .status-text { display: inline-block; } /* Show when minimized */
#undiscord .status-text.active { color: #00b0f4; }

/* COLORED STATS & FOOTER FIXES */
.stat-box { display: inline-block; white-space: pre; }
.stat-progress { width: auto; text-align: left; }
.stat-elapsed { color: #00b0f4; font-weight: 600; margin-left: 8px; white-space: nowrap; } /* Cyan */
.stat-remaining { color: #faa61a; font-weight: 600; margin-left: 8px; white-space: nowrap; } /* Orange */

/* VALUE BADGES (For Sliders) */
.value-badge {
    display: inline-block;
    background-color: #111;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-family: Consolas, monospace;
    margin-left: 8px;
    vertical-align: middle;
}

/* CATEGORY TITLES (Summary) - CYAN */
#undiscord summary { color: #00b0f4; font-size: 16px; font-weight: 500; line-height: 20px; position: relative; overflow: hidden; margin-bottom: 2px; padding: 6px 10px; cursor: pointer; white-space: nowrap; text-overflow: ellipsis; border-radius: 4px; flex-shrink: 0; }

/* TEXT & LABELS */
#undiscord legend,
#undiscord label { color: var(--u-label); font-size: 12px; line-height: 16px; font-weight: 600; text-transform: uppercase; cursor: default; font-family: var(--font-display); margin-bottom: 8px; }
#undiscord .sectionDescription { margin-bottom: 16px; color: var(--u-desc); font-size: 14px; line-height: 20px; font-weight: 400; }
#undiscord a { color: #00b0f4; text-decoration: none; }
#undiscord a:hover { text-decoration: underline; }

/* INPUTS */
#undiscord .multiInput { display: flex; align-items: center; font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--u-text); background-color: var(--u-input-bg); border: none; transition: border-color 0.2s ease-in-out 0s; }
#undiscord .multiInput :first-child { flex-grow: 1; }
#undiscord .multiInput button:last-child { margin-right: 4px; }

/* INPUT WRAPPER & PREFIX */
#undiscord .input-wrapper { display: flex; align-items: center; font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--u-text); background-color: var(--u-input-bg); border: none; transition: border-color 0.2s ease-in-out 0s; padding-left: 10px; padding-right: 10px; }
#undiscord .prefix { color: #72767d; font-weight: 600; font-size: 12px; margin-right: 8px; white-space: nowrap; font-family: var(--font-display); text-transform: uppercase; margin-top: 1px; }

#undiscord input[type="text"],
#undiscord input[type="search"],
#undiscord input[type="password"],
#undiscord input[type="datetime-local"],
#undiscord input[type="number"],
#undiscord input[type="range"] { background-color: transparent; border: none; border-radius: 4px; box-sizing: border-box; color: var(--u-text); font-size: 16px; height: 40px; padding: 10px 0; transition: border-color .2s ease-in-out; width: 100%; }
#undiscord input:focus { outline: none; }

#undiscord fieldset { margin-top: 16px; }
#undiscord .divider,
#undiscord hr { border: none; margin-bottom: 24px; padding-bottom: 4px; border-bottom: 1px solid var(--u-border); }

/* BUTTONS */
#undiscord .btn,
#undiscord button { position: relative; display: flex; justify-content: center; align-items: center; box-sizing: border-box; background: none; border: none; border-radius: 3px; font-size: 14px; font-weight: 500; line-height: 16px; padding: 2px 16px; user-select: none; width: 60px; height: 32px; min-width: 60px; min-height: 32px; color: var(--u-btn-color); background-color: var(--u-btn-bg); transition: background-color .17s ease; cursor: pointer; }
#undiscord button:hover { background-color: #6d6f78; }
#undiscord button:disabled { opacity: 0.5; cursor: not-allowed; }
#undiscord .sizeMedium { width: 96px; height: 38px; min-width: 96px; min-height: 38px; }
#undiscord .sizeMedium.icon { width: 38px; min-width: 38px; }
#undiscord .danger { background-color: #da373c; }
#undiscord .danger:hover { background-color: #a1282c; }
#undiscord .positive { background-color: #23a559; }

/* SCROLLBAR */
#undiscord .scroll::-webkit-scrollbar { width: 8px; height: 8px; }
#undiscord .scroll::-webkit-scrollbar-corner { background-color: transparent; }
#undiscord .scroll::-webkit-scrollbar-thumb { background-clip: padding-box; border: 2px solid transparent; border-radius: 4px; background-color: var(--u-scroll-thumb); min-height: 40px; }
#undiscord .scroll::-webkit-scrollbar-track { border-color: transparent; background-color: transparent; border: 2px solid transparent; }

/* UTILS */
#undiscord sup { vertical-align: top; }
#undiscord .info { font-size: 12px; line-height: 16px; padding: 8px 10px; color: var(--u-desc); }
#undiscord .col { display: flex; flex-direction: column; }
#undiscord .row { display: flex; flex-direction: row; align-items: center; }
#undiscord .mb1 { margin-bottom: 8px; }

/* LOGS */
#undiscord .log { margin-bottom: 0.25em; font-family: Consolas, monospace; }
#undiscord .log-debug { color: #f2f3f5; }
#undiscord .log-info { color: #00b0f4; }
#undiscord .log-verb { color: #949ba4; }
#undiscord .log-warn { color: #faa61a; }
#undiscord .log-limited { color: #ff00d4; }
#undiscord .log-error { color: #f04747; }
#undiscord .log-success { color: #23a559; }

/* STREAMER MODE */
#undiscord.redact .priv { display: none !important; }
#undiscord.redact x:not(:active) { color: transparent !important; background-color: var(--u-btn-bg) !important; cursor: default; user-select: none; border-radius: 3px; }
#undiscord.redact x:hover { position: relative; }
#undiscord.redact x:hover::after { content: "Redacted information (Streamer mode: ON)"; position: absolute; display: inline-block; top: -32px; left: -20px; padding: 4px; width: 150px; font-size: 8pt; text-align: center; white-space: pre-wrap; background-color: #111; box-shadow: 0 4px 8px rgba(0,0,0,0.5); color: #fff; border-radius: 5px; pointer-events: none; z-index: 1000; }
#undiscord.redact [priv] { -webkit-text-security: disc !important; }
#undiscord :disabled { display: none; }
`);

var mainCss = (`
/**** Undiscord Button ****/
#undicord-btn {
    position: relative;
    width: 24px;
    height: 24px;
    margin: 0 8px;
    cursor: pointer;
    color: #23a559; /* DEFAULT: GREEN (Closed) */
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
#undicord-btn progress {
    position: absolute;
    top: 23px;
    left: -4px;
    height: 12px;
    display: none;
}

/* RUNNING STATE: RED */
#undicord-btn.running { color: #da373c !important; }

#undicord-btn.running progress { display: block; }
/**** Undiscord Interface ****/
#undiscord {
    position: fixed;
    z-index: 100;
    top: 58px;
    right: 10px;
    display: flex;
    flex-direction: column;
    width: 800px;
    height: 80vh;

    min-width: 720px;

    max-width: 100vw;
    min-height: 448px;
    max-height: 100vh;
    color: var(--u-text);
    border-radius: 4px;
    background-color: var(--u-bg);
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
    will-change: top, left, width, height;
}
#undiscord .header .icon { cursor: pointer; }
#undiscord .window-body { height: calc(100% - 48px); }

/* SIDEBAR WIDTH (Fixed) */
#undiscord .sidebar {
    overflow: hidden scroll;
    overflow-y: auto;
    width: 240px;
    min-width: 240px; /* FIX: Prevent shrinking */
    height: 100%;
    max-height: 100%;
    padding: 8px;
    background-color: var(--u-sidebar-bg);
    flex-shrink: 0;
}

#undiscord .sidebar legend,
#undiscord .sidebar label { display: block; width: 100%; }

/* MAIN WINDOW WIDTH */
#undiscord .main {
    display: flex;
    max-width: calc(100% - 240px);
    background-color: var(--u-bg);
    flex-grow: 1;
    min-width: 0;
}

#undiscord.hide-sidebar .sidebar { display: none; }
#undiscord.hide-sidebar .main { max-width: 100%; }

/* LOG AREA (Wrap Text - Aggressive) */
#undiscord #logArea {
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 0.75rem;
    overflow: auto;
    padding: 10px;
    user-select: text;
    flex-grow: 1;
    cursor: auto;
    white-space: pre-wrap;
    word-break: break-all; /* FIX: Force wrap even on long tokens */
}

/* FIX: Use hardcoded --u-header-bg */
#undiscord .tbar {
    padding: 8px;
    background-color: var(--u-header-bg);
    width: 100%;
    min-width: 100%; /* Force background stretch */
    box-sizing: border-box;
}

#undiscord .tbar button { margin-right: 4px; margin-bottom: 4px; }
#undiscord .footer { cursor: se-resize; padding-right: 40px; }

#undiscord .footer #progressPercent { padding: 0 1em; font-size: small; color: var(--u-desc); flex-grow: 1; }
.resize-handle { position: absolute; bottom: -15px; right: -15px; width: 30px; height: 30px; transform: rotate(-45deg); background: repeating-linear-gradient(0, var(--u-border), var(--u-border) 1px, transparent 2px, transparent 4px); cursor: nwse-resize; }
/**** Elements ****/
#undiscord summary { font-size: 16px; font-weight: 500; line-height: 20px; position: relative; overflow: hidden; margin-bottom: 2px; padding: 6px 10px; cursor: pointer; white-space: nowrap; text-overflow: ellipsis; color: #00b0f4; border-radius: 4px; flex-shrink: 0; }
#undiscord fieldset { padding-left: 8px; }
#undiscord legend a { float: right; text-transform: initial; }

/* PROGRESS BAR FIX (Static Width) */
#undiscord progress {
    height: 8px;
    margin-top: 4px;
    width: 100%;
}

#undiscord .importJson { display: flex; flex-direction: row; }
#undiscord .importJson button { margin-left: 5px; width: fit-content; }
`);

    var dragCss = (`
[name^="grab-"] { position: absolute; --size: 6px; --corner-size: 16px; --offset: -1px; z-index: 9; }
[name^="grab-"]:hover{ background: rgba(128,128,128,0.1); }
[name="grab-t"] { top: 0px; left: var(--corner-size); right: var(--corner-size); height: var(--size); margin-top: var(--offset); cursor: ns-resize; }
[name="grab-r"] { top: var(--corner-size); bottom: var(--corner-size); right: 0px; width: var(--size); margin-right: var(--offset);
  cursor: ew-resize; }
[name="grab-b"] { bottom: 0px; left: var(--corner-size); right: var(--corner-size); height: var(--size); margin-bottom: var(--offset); cursor: ns-resize; }
[name="grab-l"] { top: var(--corner-size); bottom: var(--corner-size); left: 0px; width: var(--size); margin-left: var(--offset); cursor: ew-resize; }
[name="grab-tl"] { top: 0px; left: 0px; width: var(--corner-size); height: var(--corner-size); margin-top: var(--offset); margin-left: var(--offset); cursor: nwse-resize; }
[name="grab-tr"] { top: 0px; right: 0px; width: var(--corner-size); height: var(--corner-size); margin-top: var(--offset); margin-right: var(--offset); cursor: nesw-resize; }
[name="grab-br"] { bottom: 0px; right: 0px; width: var(--corner-size); height: var(--corner-size); margin-bottom: var(--offset); margin-right: var(--offset); cursor: nwse-resize; }
[name="grab-bl"] { bottom: 0px; left: 0px; width: var(--corner-size); height: var(--corner-size); margin-bottom: var(--offset); margin-left: var(--offset); cursor: nesw-resize; }
`);

    var buttonHtml = (`
<div id="undicord-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages with Undiscord">
    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
        <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
    </svg>
    <progress></progress>
</div>
`);

    var undiscordTemplate = (`
<div id="undiscord" class="browser container redact" style="display:none;">
    <div class="header">
        <svg class="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
            <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
        </svg>
        <h3>Undiscord</h3>
        <div class="vert-divider"></div>
        <span id="status" class="status-text"> Ready</span>
        <div class="spacer"></div>

        <!-- MINIMIZE BUTTON -->
        <div id="btnMinimize" class="icon" aria-label="Minimize" role="button" tabindex="0">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M6 11H18V13H6z"></path></svg>
        </div>
        <div id="hide" class="icon" aria-label="Close" role="button" tabindex="0">
            <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
            </svg>
        </div>
    </div>
    <div class="window-body" style="display: flex; flex-direction: row;">
        <div class="sidebar scroll">
            <details open>
                <summary>General <a href="https://github.com/victornpb/undiscord/wiki" title="Wiki" target="_blank" rel="noopener noreferrer" style="float: right;">How to</a></summary>

                <div class="multiInput mb1" style="margin-top: 15px;">
                    <div class="input-wrapper">
                        <span class="prefix">AUTHOR ID:</span>
                        <input class="input" id="authorId" type="text" priv>
                    </div>
                    <button id="getAuthor">me</button>
                </div>

                <div class="multiInput mb1">
                    <div class="input-wrapper">
                        <span class="prefix">SERVER ID:</span>
                        <input class="input" id="guildId" type="text" priv>
                    </div>
                    <button id="getGuild">current</button>
                </div>

                <div class="multiInput mb1">
                    <div class="input-wrapper">
                        <span class="prefix">CHANNEL ID:</span>
                        <input class="input" id="channelId" type="text" priv>
                    </div>
                    <button id="getChannel">current</button>
                </div>

                <div class="sectionDescription" style="margin-bottom: 8px;">
                    <label class="row"><input id="includeNsfw" type="checkbox">This is a NSFW channel</label>
                </div>

                <div class="multiInput mb1">
                    <div class="input-wrapper">
                        <span class="prefix">TOKEN:</span>
                        <input class="input" id="token" type="text" autocomplete="dont" priv>
                    </div>
                    <button id="getToken">fill</button>
                </div>
                <hr>
            </details>
            <details>
                <summary>Time Delays</summary>
                <fieldset>
                    <legend>Search delay<div id="searchDelayValue" class="value-badge"></div></legend>
                    <div class="input-wrapper"><input id="searchDelay" type="range" value="15000" step="100" min="100" max="60000"></div>
                    <div class="sectionDescription">This setting controls the initial delay for searching DC's message index and places them into a batch before the delete process begins. Default delay is 15000ms, which is usually safe.</div>
                </fieldset>
                <fieldset>
                    <legend>Delete delay<div id="deleteDelayValue" class="value-badge"></div></legend>
                    <div class="input-wrapper"><input id="deleteDelay" type="range" value="1100" step="50" min="50" max="10000"></div>
                    <div class="sectionDescription">This setting controls the delay for how quickly messages get deleted. Default is 1100ms (1.1 seconds), which is usually safe.<br /><br />If you hit the API's rate limiter, this delay will auto increase to a safe point (usually 1224ms). If that doesn't help (multiple API warnings in pink) I suggest to stop the process, refresh the browser window and start the process again after 60 seconds.</div>
                </fieldset>
            </details>
            <hr>
            <details>
                <summary>Filter</summary>
                <fieldset>
                    <legend>Search <a href="{{WIKI}}/filters" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper"><input id="search" type="text" placeholder="Containing text" priv></div>
                    <div class="sectionDescription">Only delete messages that contain the text</div>
                    <div class="sectionDescription"><label><input id="hasLink" type="checkbox">has: link</label></div>
                    <div class="sectionDescription"><label><input id="hasFile" type="checkbox">has: file</label></div>
                    <div class="sectionDescription"><label><input id="includePinned" type="checkbox">Include pinned</label></div>
                </fieldset>
                <hr>
                <fieldset>
                    <legend>Pattern <a href="{{WIKI}}/pattern" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="sectionDescription">Delete messages that match the regular expression</div>
                    <div class="input-wrapper"><span class="info">/</span><input id="pattern" type="text" placeholder="regular expression" priv><span class="info">/</span></div>
                </fieldset>
            </details>
            <details>
                <summary>Messages interval</summary>
                <fieldset>
                    <legend>Interval of messages <a href="{{WIKI}}/messageId" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="multiInput mb1">
                        <div class="input-wrapper"><input id="minId" type="text" placeholder="After a message" priv></div>
                        <button id="pickMessageAfter">Pick</button>
                    </div>
                    <div class="multiInput">
                        <div class="input-wrapper"><input id="maxId" type="text" placeholder="Before a message" priv></div>
                        <button id="pickMessageBefore">Pick</button>
                    </div>
                    <div class="sectionDescription">Specify an interval to delete messages.</div>
                </fieldset>
            </details>
            <details>
                <summary>Date interval</summary>
                <fieldset>
                    <legend>After date <a href="{{WIKI}}/dateRange" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper mb1"><input id="minDate" type="datetime-local" title="Messages posted AFTER this date"></div>
                    <legend>Before date <a href="{{WIKI}}/dateRange" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper"><input id="maxDate" type="datetime-local" title="Messages posted BEFORE this date"></div>
                    <div class="sectionDescription">Delete messages that were posted between the two dates.</div>
                    <div class="sectionDescription">* Filtering by date doesn't work if you use the "Messages interval".</div>
                </fieldset>
            </details>
            <hr>
            <details>
                <summary>Logs</summary>
                <div class="sectionDescription">
                    <label><input id="autoLog" type="checkbox"> Auto Save & Clear</label>
                    <div class="sectionDescription" style="margin-left: 20px;">Saves your logs to a directory and clears the log window every hour to stop lag over long runs. Doesn't clear the log window if stopped prematurely or in less than an hour run.</div>
                </div>
                <div class="sectionDescription">
                    <label style="margin-left: 20px;"><input id="saveMessagesOnlyLog" type="checkbox"> Messages Only</label>
                    <div class="sectionDescription" style="margin-left: 40px;">Strips out the clutter and saves just the deleted messages without the noise. Make sure Auto Save & Clear is also ticked.</div>
                </div>
                <div class="sectionDescription">
                    <label><input id="autoSave" type="checkbox"> Auto Save</label>
                    <div class="sectionDescription" style="margin-left: 20px;">Saves your log at the end of the session or when you stop it. Same as the above option, except it doesn't clear the log window for you.</div>
                </div>
                <div class="sectionDescription">
                    <label style="margin-left: 20px;"><input id="saveMessagesOnlySave" type="checkbox"> Messages Only</label>
                    <div class="sectionDescription" style="margin-left: 40px;">Strips out the clutter and saves just the deleted messages without the noise. Make sure Auto Save is also ticked.</div>
                </div>
                <div class="sectionDescription">
                    <label><input id="autoClear" type="checkbox"> Auto Clear</label>
                    <div class="sectionDescription" style="margin-left: 20px;">Just clears your log window every hour to prevent lag.</div>
                </div>
                <div class="input-wrapper">
                    <button id="btnLogClear" class="sizeMedium" style="width: 100px;">Clear Log</button>
                    <div class="sectionDescription" style="margin-top: 5px; margin-left: 10px;">Manually clears the log window.</div>
                </div>
            </details>
            <hr>
            <details>
                <summary>Wipe Archive</summary>
                <fieldset>
                    <legend>Import index.json <a href="{{WIKI}}/importJson" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper"><input type="file" id="importJsonInput" accept="application/json,.json" style="width:100%";></div>
                    <div class="sectionDescription"><br>After requesting your data from discord, you can import it here.<br>Select the "messages/index.json" file from the discord archive.</div>
                </fieldset>
            </details>
            <hr>
            <div class="info">Undiscord {{VERSION}} - AerialJustice</div>
        </div>
        <div class="main col">
            <div class="tbar col">
                <div class="row">
                    <button id="toggleSidebar" class="sizeMedium icon">☰</button>
                    <button id="start" class="sizeMedium danger" title="Start the deletion process">▶︎ Delete</button>
                    <button id="stop" class="sizeMedium" title="Stop the deletion process" disabled>🛑 Stop</button>
                    <button id="copy" class="sizeMedium">Copy log</button>
                    <button id="clear" class="sizeMedium">Clear log</button>
                    <label class="row" title="Hide sensitive information on your screen for taking screenshots"><input id="redact" type="checkbox" checked> Streamer mode</label>
                </div>
                <div class="row">
                    <progress id="progressBar" style="display:none;"></progress>
                </div>
            </div>
            <pre id="logArea" class="logarea scroll">
<div id="guide-container" style="margin-top: -25px;">
    <div style="height: 20px; padding-top: 6px;"><--- Click this button to autofill.</div>
    <div style="height: 20px; padding-top: 2px;"><--- Open a Server or DM, then click this button. Everytime you click another DM,<br />click this again to update the Server and Channel fields.</div>
    <div style="height: 20px; padding-top: 2px;"><--- If not a DM (Ex: on a Server), enter the channel first, then click this<br /> button after clicking the Server ID button above. Remember to click this for<br /> each new server/dm/channel you want to delete from.</div>
    <div style="height: 35px; padding-top: 32px;"><--- If Auto isn't working, click this button and try again. Otherwise leave it blank.</div><div style="color: #f04747; margin-top: 0px; line-height: 1.3;"><b>WARNING!</b> Careful with your auth token! If anyone has access to it,<br />they can post as you in any server without having access to your account.<br />If you think you were compromised, change your Discord password,<br />which resets your token.</div>
</div>
<center style="margin-top: 30px;">
    <div>Star <a href="{{HOME}}" target="_blank">this project</a> on GitHub!</div>
    <div><a href="{{HOME}}/discussions" target="_blank">Issues or help</a></div>
</center>
            </pre>
            <div class="tbar footer row">
                <div id="progressPercent"></div>
                <span class="spacer"></span>
                <label><input id="autoScroll" type="checkbox" checked> Auto scroll</label>
                <div class="resize-handle"></div>
            </div>
        </div>
    </div>
</div>
`);

    const log = {
        debug() {
            return logFn ? logFn('debug', arguments) : console.debug.apply(console, arguments);
        },
        info() {
            return logFn ? logFn('info', arguments) : console.info.apply(console, arguments);
        },
        verb() {
            return logFn ? logFn('verb', arguments) : console.log.apply(console, arguments);
        },
        warn() {
            return logFn ? logFn('warn', arguments) : console.warn.apply(console, arguments);
        },
        error() {
            return logFn ? logFn('error', arguments) : console.error.apply(console, arguments);
        },
        success() {
            return logFn ? logFn('success', arguments) : console.info.apply(console, arguments);
        },
        limited() {
            return logFn ? logFn('limited', arguments) : console.warn.apply(console, arguments);
        },
    };

    var logFn; // custom console.log function
    const setLogFn = (fn) => {
        logFn = fn;
    };

    // Helpers
    const wait = async ms => new Promise(done => setTimeout(done, ms));
    const msToHMS = s => `${s / 3.6e6 | 0}h ${(s % 3.6e6) / 6e4 | 0}m ${(s % 6e4) / 1000 | 0}s`;
    const escapeHTML = html => String(html).replace(/[&<"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '"': '&quot;',
        '\'': '&#039;'
    })[m]);
    const redact = str => `<x>${escapeHTML(str)}</x>`;
    const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
    const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10));
    const toSnowflake = (date) => /:/.test(date) ? ((new Date(date).getTime() - 1420070400000) * Math.pow(2, 22)) : date;
    const replaceInterpolations = (str, obj, removeMissing = false) => str.replace(/\{\{([\w_]+)\}\}/g, (m, key) => obj[key] || (removeMissing ? '' : m));

    // HELPER: Auto-Save Log with Folder Support
    function saveLog(saveMessagesOnly = false) {
        let text = ui.logArea.innerText;
        if (saveMessagesOnly) {
            const lines = text.split('\n').filter(line => /^\s*\[\d+\/\d+\]\s/.test(line.trim()));
            text = lines.join('\n').trim();
        }
        // Windows-Safe Timestamp (yyyy-mm-dd_hh-mm-ss)
        const now = new Date();
        const timestamp = now.getFullYear() + "-" +
                         ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
                         ("0" + now.getDate()).slice(-2) + "_" +
                         ("0" + now.getHours()).slice(-2) + "-" +
                         ("0" + now.getMinutes()).slice(-2) + "-" +
                         ("0" + now.getSeconds()).slice(-2);

        let filename = `Undiscord_Logs/undiscord_log_${timestamp}.txt`;
        if (saveMessagesOnly) {
            filename = `Undiscord_Logs/undiscord_messages_${timestamp}.txt`;
        }

        if (typeof GM_download !== 'undefined') {
            console.log("[Undiscord] Using GM_download to save to folder: " + filename);
            GM_download({
                url: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
                name: filename,
                saveAs: false,
                onerror: (err) => {
                    console.error("[Undiscord] GM_download failed:", err);
                    // Fallback if permission error
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
                    a.download = filename;
                    a.click();
                }
            });
        } else {
            console.warn("[Undiscord] GM_download NOT found. Using fallback (Root folder only).");
            const blob = new Blob([text], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
        }
    }

    const PREFIX = '[UNDISCORD]';

    /**
     * Delete all messages in a Discord channel or DM
     * @original author: Victornpb <https://www.github.com/victornpb>
     * @updated: https://github.com/AerialJustice/undiscord-fixed-2025
     * @see https://github.com/victornpb/undiscord
     */
    class UndiscordCore {

        options = {
            authToken: null, // Your authorization token
            authorId: null, // Author of the messages you want to delete
            guildId: null, // Server were the messages are located
            channelId: null, // Channel were the messages are located
            minId: null, // Only delete messages after this, leave blank do delete all
            maxId: null, // Only delete messages before this, leave blank do delete all
            content: null, // Filter messages that contains this text content
            hasLink: null, // Filter messages that contains link
            hasFile: null, // Filter messages that contains file
            includeNsfw: null, // Search in NSFW channels
            includePinned: null, // Delete messages that are pinned
            pattern: null, // Only delete messages that match the regex (insensitive)
            searchDelay: null, // Delay each time we fetch for more messages
            deleteDelay: null, // Delay between each delete operation
            maxAttempt: 2, // Attempts to delete a single message if it fails
            askForConfirmation: true,
            autoLog: false,
            saveMessagesOnlyLog: false,
            autoSave: false,
            saveMessagesOnlySave: false,
            autoClear: false,
        };

        state = {
            running: false,
            delCount: 0,
            failCount: 0,
            systemCount: 0, // Track undeletable system messages
            grandTotal: 0,
            offset: 0,
            iterations: 0,
            lastLogTime: 0,

            _systemMessageIds: new Set(),

            _seachResponse: null,
            _messagesToDelete: [],
            _skippedMessages: [],
        };

        stats = {
            startTime: new Date(), // start time
            throttledCount: 0, // how many times you have been throttled
            throttledTotalTime: 0, // the total amount of time you spent being throttled
            lastPing: null, // the most recent ping
            avgPing: null, // average ping used to calculate the estimated remaining time
            etr: 0,
        };

        // events
        onStart = undefined;
        onProgress = undefined;
        onStop = undefined;

        resetState() {
            this.state = {
                running: false,
                delCount: 0,
                failCount: 0,
                grandTotal: 0,
                offset: 0,
                iterations: 0,
                lastLogTime: Date.now(),

                _systemMessageIds: new Set(), // Reset unique set

                _seachResponse: null,
                _messagesToDelete: [],
                _skippedMessages: [],
            };

            this.options.askForConfirmation = true;
        }

        /** Automate the deletion process of multiple channels */
        async runBatch(queue) {
            if (this.state.running) return log.error('Already running!');

            log.info(`Runnning batch with queue of ${queue.length} jobs`);
            for (let i = 0; i < queue.length; i++) {
                const job = queue[i];
                log.info('Starting job...', `(${i + 1}/${queue.length})`);

                // set options
                this.options = {
                    ...this.options, // keep current options
                    ...job, // override with options for that job
                };

                await this.run(true);
                if (!this.state.running) break;

                log.info('Job ended.', `(${i + 1}/${queue.length})`);
                this.resetState();
                this.options.askForConfirmation = false;
                this.state.running = true; // continue running
            }

            log.info('Batch finished.');
            this.state.running = false;
        }

        /** Start the deletion process */
        async run(isJob = false) {
            if (this.state.running && !isJob) return log.error('Already running!');

            this.state.running = true;
            this.stats.startTime = new Date();
            this.state.lastLogTime = Date.now();

            // BATCHING VARIABLES
            let messageBuffer = [];
            const BATCH_SIZE = 50;
            const SCAN_DELAY = 4000;

            // LOOP PREVENTION
            let cleanSweepCount = 0;

            // TIMING VARIABLE
            let cooldownOverride = null;

            log.success(`\nStarted at ${this.stats.startTime.toLocaleString()}`);
            log.debug(
                `authorId = "${redact(this.options.authorId)}"`,
                `guildId = "${redact(this.options.guildId)}"`,
                `channelId = "${redact(this.options.channelId)}"`,
                `minId = "${redact(this.options.minId)}"`,
                `maxId = "${redact(this.options.maxId)}"`,
                `hasLink = ${!!this.options.hasLink}`,
                `hasFile = ${!!this.options.hasFile}`,
            );

            if (this.onStart) this.onStart(this.state, this.stats);

            do {
                this.state.iterations++;
                cooldownOverride = null;

                // AUTO SAVE & CLEAR LOGIC
                const now = Date.now();
                if (now - this.state.lastLogTime > 3600000) { // 1 Hour
                    if (this.options.autoLog) {
                        saveLog(this.options.saveMessagesOnlyLog);
                        ui.logArea.innerHTML = '';
                        log.info('Auto-Saved log and cleared screen to prevent lag.');
                    } else if (this.options.autoClear) {
                        ui.logArea.innerHTML = '';
                        log.info('Auto-Cleared log screen to prevent lag.');
                    }
                    this.state.lastLogTime = now;
                }

                log.verb('Fetching messages...');
                // Search messages
                await this.search();

                // Process results
                await this.filterResponse();

                // HANDLE SKIPPED/SYSTEM MESSAGES (Track Unique IDs)
                if (this.state._skippedMessages.length > 0) {
                    this.state._skippedMessages.forEach(msg => this.state._systemMessageIds.add(msg.id));
                    log.verb(`Found ${this.state._skippedMessages.length} status messages (Calls/Pins) - Skipping.`);
                }

                // FIX: EXPAND GRAND TOTAL DYNAMICALLY
                const currentProcessed = this.state.delCount + this.state.failCount + this.state._systemMessageIds.size;
                if (currentProcessed > this.state.grandTotal) {
                    this.state.grandTotal = currentProcessed;
                }

                // UPDATE UI NOW
                if (this.onProgress) this.onProgress(this.state, this.stats);

                // Add newly found messages to our buffer
                const foundMessages = this.state._messagesToDelete;
                if (foundMessages.length > 0) {
                    messageBuffer.push(...foundMessages);
                    log.info(`Buffer: Found ${foundMessages.length} new. Total in batch: ${messageBuffer.length}/${BATCH_SIZE}`);
                    cleanSweepCount = 0;
                }

                // DECISION: Scan more? or Delete now?
                const apiHasMore = this.state._seachResponse.messages.length > 0;

                if (messageBuffer.length < BATCH_SIZE && apiHasMore) {
                    // --- SCANNING MODE ---
                    this.printStats();
                    this.state.offset += this.state._seachResponse.messages.length;
                    log.verb(`Buffering... Waiting ${SCAN_DELAY}ms to scan next page...`);
                    await wait(SCAN_DELAY);
                    continue;
                }

                log.verb(
                    `Grand total: ${this.state.grandTotal}`,
                    `(Buffered for Delete: ${messageBuffer.length})`,
                    `offset: ${this.state.offset}`
                );

                this.calcEtr();
                log.verb(`Estimated time remaining: ${msToHMS(this.stats.etr)}`);

                // --- DELETE MODE ---
                if (messageBuffer.length > 0) {
                    this.state._messagesToDelete = messageBuffer;

                    if (await this.confirm() === false) {
                        this.state.running = false;
                        break;
                    }

                    await this.deleteMessagesFromList();

                    // Reset
                    messageBuffer = [];
                    this.state.offset = 0;
                } else if (apiHasMore) {
                    // Found nothing deletable, crawling forward
                    this.state.offset += this.state._seachResponse.messages.length;
                    log.verb('Nothing to delete in current buffer, checking deeper...');
                } else {
                    // API returned empty.
                    const totalInIndex = this.state._seachResponse.total_results || 0;

                    if (totalInIndex > 0 && cleanSweepCount < 2) {
                        log.warn(`API says ${totalInIndex} messages remain, but returned 0. Discord Indexing lag? Retrying...`);
                        this.state.offset = 0;
                        cleanSweepCount++;
                        cooldownOverride = null;
                    } else if (cleanSweepCount >= 2) {
                        log.success('Scan complete. No more messages found.');
                        this.state.running = false;
                        break;
                    } else {
                        log.info('End of results reached. Resetting offset to 0 to double-check...');
                        this.state.offset = 0;
                        cleanSweepCount++;
                        cooldownOverride = 3000;
                    }
                }

                // wait before next page
                const finalWait = cooldownOverride !== null ? cooldownOverride : this.options.searchDelay;
                log.verb(`Cooling down... Waiting ${(finalWait / 1000).toFixed(2)}s...`);
                await wait(finalWait);

            } while (this.state.running);

            this.stats.endTime = new Date();
            log.success(`Ended at ${this.stats.endTime.toLocaleString()}! Total time: ${msToHMS(this.stats.endTime.getTime() - this.stats.startTime.getTime())}`);
            this.printStats();

            log.debug(`Deleted ${this.state.delCount} messages, ${this.state.failCount} failed.`);

            const uniqueSystemCount = this.state._systemMessageIds.size;
            if (uniqueSystemCount > 0) {
                log.info(`${uniqueSystemCount} status messages (Calls/Pins) were found and ignored.`);
            }

            // FINAL HEADER UPDATE
            const statusEl = document.getElementById('status');
            if (statusEl) {
                statusEl.innerText = `Done. Deleted ${this.state.delCount} msgs.`;
                statusEl.classList.add('active'); // Keep it blue
            }

            // AUTO SAVE END OF SESSION
            // Save if the explicit Auto Save is on, OR if Auto Log (hourly) is on
            if (this.options.autoSave || this.options.autoLog) {
                log.info('Auto-saving log (Session Ended)...');
                const messagesOnly = this.options.autoSave ? this.options.saveMessagesOnlySave : this.options.saveMessagesOnlyLog;
                saveLog(messagesOnly);
            }

            if (this.onStop) this.onStop(this.state, this.stats);
        }

        stop() {
            this.state.running = false;
            if (this.onStop) this.onStop(this.state, this.stats);
        }

        /** Calculate the estimated time remaining based on the current stats */
        calcEtr() {
            // 1. How many items left?
            const remainingItems = this.state.grandTotal - this.state.delCount;
            // 2. How many batches of 50 is that?
            const batchesLeft = Math.ceil(remainingItems / 50);
            // 3. Time per batch = (50 items * deleteDelay) + Search Delay + (Scan Buffer Delay * 2 approx)
            const timePerBatch = (50 * this.options.deleteDelay) + this.options.searchDelay + 6000;
            this.stats.etr = batchesLeft * timePerBatch;
        }

        /** Ask for confirmation in the beggining process */
        async confirm() {
            if (!this.options.askForConfirmation) return true;

            log.verb('Waiting for your confirmation...');
            const preview = this.state._messagesToDelete.map(m => `${m.author.username}#${m.author.discriminator}: ${m.attachments.length ? '[ATTACHMENTS]' : m.content}`).join('\n');

            const answer = await ask(
                `Do you want to delete ~${this.state.grandTotal} messages? (Estimated time: ${msToHMS(this.stats.etr)})` +
                '(The actual number of messages may be less, depending if you\'re using filters to skip some messages)' +
                '\n\n---- Preview ----\n' +
                preview
            );

            if (!answer) {
                log.error('Aborted by you!');
                return false;
            } else {
                log.verb('OK');
                this.options.askForConfirmation = false; // do not ask for confirmation again on the next request
                return true;
            }
        }

        async search() {
            let API_SEARCH_URL;
            if (this.options.guildId === '@me') API_SEARCH_URL = `https://discord.com/api/v9/channels/${this.options.channelId}/messages/`; // DMs
            else API_SEARCH_URL = `https://discord.com/api/v9/guilds/${this.options.guildId}/messages/`; // Server

            let resp;
            try {
                this.beforeRequest();
                resp = await fetch(API_SEARCH_URL + 'search?' + queryString([
                    ['author_id', this.options.authorId || undefined],
                    ['channel_id', (this.options.guildId !== '@me' ? this.options.channelId : undefined) || undefined],
                    ['min_id', this.options.minId ? toSnowflake(this.options.minId) : undefined],
                    ['max_id', this.options.maxId ? toSnowflake(this.options.maxId) : undefined],
                    ['sort_by', 'timestamp'],
                    ['sort_order', 'desc'],
                    ['offset', this.state.offset],
                    ['has', this.options.hasLink ? 'link' : undefined],
                    ['has', this.options.hasFile ? 'file' : undefined],
                    ['content', this.options.content || undefined],
                    ['include_nsfw', this.options.includeNsfw ? true : undefined],
                ]), {
                    headers: {
                        'Authorization': this.options.authToken,
                    }
                });
                this.afterRequest();
            } catch (err) {
                this.state.running = false;
                log.error('Search request threw an error:', err);
                throw err;
            }

            // not indexed yet
            if (resp.status === 202) {
                let w = (await resp.json()).retry_after * 1000;
                w = w || this.options.searchDelay; // Fix retry_after 0
                this.stats.throttledCount++;
                this.stats.throttledTotalTime += w;
                log.warn(`This channel isn't indexed yet. Waiting ${w}ms for discord to index it...`);
                await wait(w);
                return await this.search();
            }

            if (!resp.ok) {
                // searching messages too fast
                if (resp.status === 429) {
                    let w = (await resp.json()).retry_after * 1000;
                    w = w || this.options.searchDelay; // Fix retry_after 0

                    this.stats.throttledCount++;
                    this.stats.throttledTotalTime += w;

                    // FIX: Ensure we are modifying the options, not the non-existent stats. -Aerial
                    if (w > this.options.searchDelay) {
                        this.options.searchDelay = w;
                        log.limited(`Being rate limited by the API for ${w}ms! Increasing search delay...`);
                    } else {
                        log.limited(`Being rate limited by the API for ${w}ms! Keeping current search delay.`);
                    }

                    this.printStats();
                    log.verb(`Cooling down for ${w * 2}ms before retrying...`);

                    await wait(w * 2);
                    return await this.search();
                } else {
                    this.state.running = false;
                    log.error(`Error searching messages, API responded with status ${resp.status}!\n`, await resp.json());
                    throw resp;
                }
            }
            const data = await resp.json();
            this.state._seachResponse = data;
            console.log(PREFIX, 'search', data);
            return data;
        }

        async filterResponse() {
            const data = this.state._seachResponse;

            // the search total will decrease as we delete stuff
            const total = data.total_results;
            if (total > this.state.grandTotal) this.state.grandTotal = total;

            // search returns messages near the the actual message, only get the messages we searched for.
            const discoveredMessages = data.messages.map(convo => convo.find(message => message.hit === true));

            // we can only delete some types of messages, system messages are not deletable. -ayubun
            let messagesToDelete = discoveredMessages;

            messagesToDelete = messagesToDelete.filter(msg =>
                msg.type === 0 || // Standard Text Message
                msg.type === 46 || // Polls
                (msg.type >= 6 && msg.type <= 19) // Systems, Pins, Replies (Excludes 20/21)
            );

            messagesToDelete = messagesToDelete.filter(msg => msg.pinned ? this.options.includePinned : true);

            // custom filter of messages
            try {
                const regex = new RegExp(this.options.pattern, 'i');
                messagesToDelete = messagesToDelete.filter(msg => regex.test(msg.content));
            } catch (e) {
                log.warn('Ignoring RegExp because pattern is malformed!', e);
            }

            // create an array containing everything we skipped. (used to calculate offset for next searches)
            const skippedMessages = discoveredMessages.filter(msg => !messagesToDelete.find(m => m.id === msg.id));

            this.state._messagesToDelete = messagesToDelete;
            this.state._skippedMessages = skippedMessages;

            console.log(PREFIX, 'filterResponse', this.state);
        }

        async deleteMessagesFromList() {
            for (let i = 0; i < this.state._messagesToDelete.length; i++) {
                const message = this.state._messagesToDelete[i];
                if (!this.state.running) return log.error('Stopped by you!');

                // FIX: DYNAMIC GRAND TOTAL (Delete Phase)
                const currentProgress = this.state.delCount + 1;
                if (currentProgress > this.state.grandTotal) {
                    this.state.grandTotal = currentProgress;
                }

                // RANDOM JITTER: Add 0-30% extra delay
                const jitter = Math.floor(Math.random() * (this.options.deleteDelay * 0.3));
                const totalWait = this.options.deleteDelay + jitter;

                log.debug(
                    `[${currentProgress}/${this.state.grandTotal}] ` +
                    `<sup>${new Date(message.timestamp).toLocaleString()}</sup> ` +
                    `<b>${redact(message.author.username + '#' + message.author.discriminator)}</b>` +
                    `: <i>${redact(message.content).replace(/\n/g, '↵')}</i>` +
                    (message.attachments.length ? redact(JSON.stringify(message.attachments)) : '')
                );

                // Delete a single message (with retry)
                let attempt = 0;
                while (attempt < this.options.maxAttempt) {
                    const result = await this.deleteMessage(message);

                    if (result === 'RETRY') {
                        attempt++;
                        log.verb(`Retrying in ${this.options.deleteDelay}ms... (${attempt}/${this.options.maxAttempt})`);
                        await wait(this.options.deleteDelay);
                    } else break;
                }

                this.calcEtr();
                if (this.onProgress) this.onProgress(this.state, this.stats);

                await wait(totalWait);
            }
        }

        async deleteMessage(message) {
            const API_DELETE_URL = `https://discord.com/api/v9/channels/${message.channel_id}/messages/${message.id}`;
            let resp;
            try {
                this.beforeRequest();
                resp = await fetch(API_DELETE_URL, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': this.options.authToken,
                    },
                });
                this.afterRequest();
            } catch (err) {
                // no response error (e.g. network error)
                log.error('Delete request throwed an error:', err);
                log.verb('Related object:', redact(JSON.stringify(message)));
                this.state.failCount++;
                return 'FAILED';
            }

            if (!resp.ok) {
                if (resp.status === 429) {
                    // deleting messages too fast
                    const w = (await resp.json()).retry_after * 1224; // 1000
                    this.stats.throttledCount++;
                    this.stats.throttledTotalTime += w;

                    // FIX: Only increase delay, never decrease it to prevent speeding up
                    if (w > this.options.deleteDelay) {
                        this.options.deleteDelay = w; // increase delay
                        log.limited(`Being rate limited by the API for ${w}ms! Adjusted delete delay to ${this.options.deleteDelay}ms.`);
                    } else {
                        log.limited(`Being rate limited by the API for ${w}ms! Keeping current delay of ${this.options.deleteDelay}ms.`);
                    }

                    this.printStats();
                    log.verb(`Cooling down for ${w * 2}ms before retrying...`);
                    await wait(w * 2);
                    return 'RETRY';
                } else {
                    const body = await resp.text();

                    try {
                        const r = JSON.parse(body);

                        if (resp.status === 400 && r.code === 50083) {
                            // 400 can happen if the thread is archived (code=50083)
                            log.warn('Error deleting message (Thread is archived). Will increment offset so we don\'t search this in the next page...');
                            this.state.offset++;
                            this.state.failCount++;
                            return 'FAIL_SKIP'; // Failed but we will skip it next time
                        }

                        // FIX: Treat 404 as success (it's already gone)
                        if (resp.status === 404) {
                            this.state.delCount++;
                            return 'OK';
                        }

                        log.error(`Error deleting message, API responded with status ${resp.status}!`, r);
                        log.verb('Related object:', redact(JSON.stringify(message)));
                        this.state.failCount++;
                        return 'FAILED';
                    } catch (e) {
                        log.error(`Fail to parse JSON. API responded with status ${resp.status}!`, body);
                    }
                }
            }

            this.state.delCount++;
            return 'OK';
        }

        #beforeTs = 0; // used to calculate latency
        beforeRequest() {
            this.#beforeTs = Date.now();
        }
        afterRequest() {
            this.stats.lastPing = (Date.now() - this.#beforeTs);
            this.stats.avgPing = this.stats.avgPing > 0 ? (this.stats.avgPing * 0.9) + (this.stats.lastPing * 0.1) : this.stats.lastPing;
        }

        printStats() {
            log.verb(
                `Delete delay: ${this.options.deleteDelay}ms, Search delay: ${this.options.searchDelay}ms`,
                `Last Ping: ${this.stats.lastPing}ms, Average Ping: ${this.stats.avgPing | 0}ms`,
            );
            log.verb(
                `Rate Limited: ${this.stats.throttledCount} times.`,
                `Total time throttled: ${msToHMS(this.stats.throttledTotalTime)}.`
            );
        }
    }

    const MOVE = 0;
    const RESIZE_T = 1;
    const RESIZE_B = 2;
    const RESIZE_L = 4;
    const RESIZE_R = 8;
    const RESIZE_TL = RESIZE_T + RESIZE_L;
    const RESIZE_TR = RESIZE_T + RESIZE_R;
    const RESIZE_BL = RESIZE_B + RESIZE_L;
    const RESIZE_BR = RESIZE_B + RESIZE_R;

    /**
     * Make an element draggable/resizable
     * @author Victor N. wwww.vitim.us
     */
    class DragResize {
        constructor({
            elm,
            moveHandle,
            options
        }) {
            this.options = defaultArgs({
                enabledDrag: true,
                enabledResize: true,
                minWidth: 200,
                maxWidth: Infinity,
                minHeight: 100,
                maxHeight: Infinity,
                dragAllowX: true,
                dragAllowY: true,
                resizeAllowX: true,
                resizeAllowY: true,
                draggingClass: 'drag',
                useMouseEvents: true,
                useTouchEvents: true,
                createHandlers: true,
            }, options);
            Object.assign(this, options);
            options = undefined;

            elm.style.position = 'fixed';

            this.drag_m = new Draggable(elm, moveHandle, MOVE, this.options);

            if (this.options.createHandlers) {
                this.el_t = createElement('div', {
                    name: 'grab-t'
                }, elm);
                this.drag_t = new Draggable(elm, this.el_t, RESIZE_T, this.options);
                this.el_r = createElement('div', {
                    name: 'grab-r'
                }, elm);
                this.drag_r = new Draggable(elm, this.el_r, RESIZE_R, this.options);
                this.el_b = createElement('div', {
                    name: 'grab-b'
                }, elm);
                this.drag_b = new Draggable(elm, this.el_b, RESIZE_B, this.options);
                this.el_l = createElement('div', {
                    name: 'grab-l'
                }, elm);
                this.drag_l = new Draggable(elm, this.el_l, RESIZE_L, this.options);
                this.el_tl = createElement('div', {
                    name: 'grab-tl'
                }, elm);
                this.drag_tl = new Draggable(elm, this.el_tl, RESIZE_TL, this.options);
                this.el_tr = createElement('div', {
                    name: 'grab-tr'
                }, elm);
                this.drag_tr = new Draggable(elm, this.el_tr, RESIZE_TR, this.options);
                this.el_br = createElement('div', {
                    name: 'grab-br'
                }, elm);
                this.drag_br = new Draggable(elm, this.el_br, RESIZE_BR, this.options);
                this.el_bl = createElement('div', {
                    name: 'grab-bl'
                }, elm);
                this.drag_bl = new Draggable(elm, this.el_bl, RESIZE_BL, this.options);
            }
        }
    }

    class Draggable {
        constructor(targetElm, handleElm, op, options) {
            Object.assign(this, options);
            options = undefined;

            this._targetElm = targetElm;
            this._handleElm = handleElm;

            let vw = window.innerWidth;
            let vh = window.innerHeight;
            let initialX, initialY, initialT, initialL, initialW, initialH;

            const clamp = (value, min, max) => value < min ? min : value > max ? max : value;

            const moveOp = (x, y) => {
                const deltaX = (x - initialX);
                const deltaY = (y - initialY);
                const t = clamp(initialT + deltaY, 0, vh - initialH);
                const l = clamp(initialL + deltaX, 0, vw - initialW);
                this._targetElm.style.top = t + 'px';
                this._targetElm.style.left = l + 'px';
            };

            const resizeOp = (x, y) => {
                x = clamp(x, 0, vw);
                y = clamp(y, 0, vh);
                const deltaX = (x - initialX);
                const deltaY = (y - initialY);
                const resizeDirX = (op & RESIZE_L) ? -1 : 1;
                const resizeDirY = (op & RESIZE_T) ? -1 : 1;
                const deltaXMax = (this.maxWidth - initialW);
                const deltaXMin = (this.minWidth - initialW);
                const deltaYMax = (this.maxHeight - initialH);
                const deltaYMin = (this.minHeight - initialH);
                const t = initialT + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax) * resizeDirY;
                const l = initialL + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax) * resizeDirX;
                const w = initialW + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax);
                const h = initialH + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax);
                if (op & RESIZE_T) { // resize ↑
                    this._targetElm.style.top = t + 'px';
                    this._targetElm.style.height = h + 'px';
                }
                if (op & RESIZE_B) { // resize ↓
                    this._targetElm.style.height = h + 'px';
                }
                if (op & RESIZE_L) { // resize ←
                    this._targetElm.style.left = l + 'px';
                    this._targetElm.style.width = w + 'px';
                }
                if (op & RESIZE_R) { // resize →
                    this._targetElm.style.width = w + 'px';
                }
            };

            let operation = op === MOVE ? moveOp : resizeOp;

            function dragStartHandler(e) {
                const touch = e.type === 'touchstart';
                if ((e.buttons === 1 || e.which === 1) || touch) {
                    e.preventDefault();
                    const x = touch ? e.touches[0].clientX : e.clientX;
                    const y = touch ? e.touches[0].clientY : e.clientY;
                    initialX = x;
                    initialY = y;
                    vw = window.innerWidth;
                    vh = window.innerHeight;
                    initialT = this._targetElm.offsetTop;
                    initialL = this._targetElm.offsetLeft;
                    initialW = this._targetElm.clientWidth;
                    initialH = this._targetElm.clientHeight;
                    if (this.useMouseEvents) {
                        document.addEventListener('mousemove', this._dragMoveHandler);
                        document.addEventListener('mouseup', this._dragEndHandler);
                    }
                    if (this.useTouchEvents) {
                        document.addEventListener('touchmove', this._dragMoveHandler, {
                            passive: false
                        });
                        document.addEventListener('touchend', this._dragEndHandler);
                    }
                    this._targetElm.classList.add(this.draggingClass);
                }
            }

            function dragMoveHandler(e) {
                e.preventDefault();
                let x, y;
                const touch = e.type === 'touchmove';
                if (touch) {
                    const t = e.touches[0];
                    x = t.clientX;
                    y = t.clientY;
                } else { //mouse
                    // If the button is not down, dispatch a "fake" mouse up event, to stop listening to mousemove
                    // This happens when the mouseup is not captured (outside the browser)
                    if ((e.buttons || e.which) !== 1) {
                        this._dragEndHandler();
                        return;
                    }
                    x = e.clientX;
                    y = e.clientY;
                }
                // perform drag / resize operation
                operation(x, y);
            }

            function dragEndHandler(e) {
                if (this.useMouseEvents) {
                    document.removeEventListener('mousemove', this._dragMoveHandler);
                    document.removeEventListener('mouseup', this._dragEndHandler);
                }
                if (this.useTouchEvents) {
                    document.removeEventListener('touchmove', this._dragMoveHandler);
                    document.removeEventListener('touchend', this._dragEndHandler);
                }
                this._targetElm.classList.remove(this.draggingClass);
            }

            // We need to bind the handlers to this instance
            this._dragStartHandler = dragStartHandler.bind(this);
            this._dragMoveHandler = dragMoveHandler.bind(this);
            this._dragEndHandler = dragEndHandler.bind(this);

            this.enable();
        }

        /** Turn on the drag and drop of the instance */
        enable() {
            this.destroy(); // prevent events from getting bound twice
            if (this.useMouseEvents) {
                this._handleElm.addEventListener('mousedown', this._dragStartHandler);
            }
            if (this.useTouchEvents) {
                this._handleElm.addEventListener('touchstart', this._dragStartHandler, {
                    passive: false
                });
            }
        }

        /** Teardown all events bound to the document and elements. You can resurrect this instance by calling enable() */
        destroy() {
            this._targetElm.classList.remove(this.draggingClass);
            if (this.useMouseEvents) {
                this._handleElm.removeEventListener('mousedown', this._dragStartHandler);
                document.removeEventListener('mousemove', this._dragMoveHandler);
                document.removeEventListener('mouseup', this._dragEndHandler);
            }
            if (this.useTouchEvents) {
                this._handleElm.removeEventListener('touchstart', this._dragStartHandler);
                document.removeEventListener('touchmove', this._dragMoveHandler);
                document.removeEventListener('touchend', this._dragEndHandler);
            }
        }
    }

    function createElement(tag = 'div', attrs, parent) {
        const elm = document.createElement(tag);
        if (attrs) Object.entries(attrs).forEach(([k, v]) => elm.setAttribute(k, v));
        if (parent) parent.appendChild(elm);
        return elm;
    }

    function defaultArgs(defaults, options) {
        function isObj(x) {
            return x !== null && typeof x === 'object';
        }

        function hasOwn(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        }
        if (isObj(options)) {
            for (let prop in defaults) {
                if (hasOwn(defaults, prop) && hasOwn(options, prop) && options[prop] !== undefined) {
                    if (isObj(defaults[prop])) defaultArgs(defaults[prop], options[prop]);
                    else defaults[prop] = options[prop];
                }
            }
        }
        return defaults;
    }

    function createElm(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
    }

    function insertCss(css) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    }

    const messagePickerCss = `
body.undiscord-pick-message [data-list-id="chat-messages"] {
  background-color: var(--background-secondary-alt);
  box-shadow: inset 0 0 0px 2px var(--button-outline-brand-border);
}

body.undiscord-pick-message [id^="message-content-"]:hover {
  cursor: pointer;
  cursor: cell;
  background: var(--background-message-automod-hover);
}
body.undiscord-pick-message [id^="message-content-"]:hover::after {
  position: absolute;
  top: calc(50% - 11px);
  left: 4px;
  z-index: 1;
  width: 65px;
  height: 22px;
  line-height: 22px;
  font-family: var(--font-display);
  background-color: var(--button-secondary-background);
  color: var(--header-secondary);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  border-radius: 3px;
  content: 'This 👉';
}
body.undiscord-pick-message.before [id^="message-content-"]:hover::after {
  content: 'Before 👆';
}
body.undiscord-pick-message.after [id^="message-content-"]:hover::after {
  content: 'After 👇';
}
`;

    const messagePicker = {
        init() {
            insertCss(messagePickerCss);
        },
        grab(auxiliary) {
            return new Promise((resolve, reject) => {
                document.body.classList.add('undiscord-pick-message');
                if (auxiliary) document.body.classList.add(auxiliary);

                function clickHandler(e) {
                    const message = e.target.closest('[id^="message-content-"]');
                    if (message) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        if (auxiliary) document.body.classList.remove(auxiliary);
                        document.body.classList.remove('undiscord-pick-message');
                        document.removeEventListener('click', clickHandler);
                        try {
                            resolve(message.id.match(/message-content-(\d+)/)[1]);
                        } catch (e) {
                            resolve(null);
                        }
                    }
                }
                document.addEventListener('click', clickHandler);
            });
        }
    };
    window.messagePicker = messagePicker;

    function getToken() {
        window.dispatchEvent(new Event('beforeunload'));
        const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
        try {
            return JSON.parse(LS.token);
        } catch {
            log.info('Could not automatically detect Authorization Token in local storage!');
            log.info('Attempting to grab token using webpack');
            return (window.webpackChunkdiscord_app.push([
                [''], {},
                e => {
                    window.m = [];
                    for (let c in e.c) window.m.push(e.c[c]);
                }
            ]), window.m).find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken();
        }
    }

    function getAuthorId() {
        const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
        return JSON.parse(LS.user_id_cache);
    }

    function getGuildId() {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) return m[1];
        else alert('Could not find the Guild ID!\nPlease make sure you are on a Server or DM.');
    }

    function getChannelId() {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) return m[2];
        else alert('Could not find the Channel ID!\nPlease make sure you are on a Channel or DM.');
    }

    function fillToken() {
        try {
            return getToken();
        } catch (err) {
            log.verb(err);
            log.error('Could not automatically detect Authorization Token!');
            log.info('Please make sure Undiscord is up to date');
            log.debug('Alternatively, you can try entering a Token manually in the "Advanced Settings" section.');
        }
        return '';
    }

    // -------------------------- User interface ------------------------------- //

    // links
    const HOME = 'https://github.com/victornpb/undiscord';
    const WIKI = 'https://github.com/victornpb/undiscord/wiki';

    const undiscordCore = new UndiscordCore();
    messagePicker.init();

    const ui = {
        undiscordWindow: null,
        undiscordBtn: null,
        logArea: null,
        autoScroll: null,

        // progress handler
        progressMain: null,
        progressIcon: null,
        percent: null,
    };
    const $ = s => ui.undiscordWindow.querySelector(s);

    function initUI() {
        insertCss(themeCss);
        insertCss(mainCss);
        insertCss(dragCss);

        const undiscordUI = replaceInterpolations(undiscordTemplate, {
            VERSION,
            HOME,
            WIKI,
        });
        ui.undiscordWindow = createElm(undiscordUI);
        document.body.appendChild(ui.undiscordWindow);

        // enable drag and resize on undiscord window
        new DragResize({
            elm: ui.undiscordWindow,
            moveHandle: $('.header')
        });

        // create undiscord Trash icon
        ui.undiscordBtn = createElm(buttonHtml);
        ui.undiscordBtn.onclick = toggleWindow;

        function mountBtn() {
            let anchor = document.querySelector('[aria-label="Inbox"]') || document.querySelector('[aria-label="Help"]');
            if (anchor) {
                const buttonContainer = anchor.closest('[role="button"]') || anchor.closest('.clickable_') || anchor;
                const toolbar = buttonContainer.parentElement;
                if (toolbar && !toolbar.contains(ui.undiscordBtn)) {
                    try {
                        toolbar.insertBefore(ui.undiscordBtn, buttonContainer);
                    } catch (e) {
                        toolbar.appendChild(ui.undiscordBtn);
                    }
                }
            }
        }
        mountBtn();

        // watch for changes and re-mount button if necessary
        const discordElm = document.body;
        let observerThrottle = null;
        const observer = new MutationObserver((_mutationsList, _observer) => {
            if (observerThrottle) return;
            observerThrottle = setTimeout(() => {
                observerThrottle = null;
                if (!document.body.contains(ui.undiscordBtn)) mountBtn();
            }, 3000);
        });
        observer.observe(discordElm, {
            attributes: false,
            childList: true,
            subtree: true
        });

        function toggleWindow() {
            if (ui.undiscordWindow.style.display !== 'none') {
                ui.undiscordWindow.style.display = 'none';
                // CLOSE STATE -> GREEN (#23a559)
                ui.undiscordBtn.style.color = '#23a559';
            } else {
                ui.undiscordWindow.style.display = '';
                // OPEN STATE -> ORANGE (#faa61a)
                ui.undiscordBtn.style.color = '#faa61a';
            }
        }

        // cached elements
        ui.logArea = $('#logArea');
        ui.autoScroll = $('#autoScroll');
        ui.progressMain = $('#progressBar');
        ui.progressIcon = ui.undiscordBtn.querySelector('progress');
        ui.percent = $('#progressPercent');

        // register event listeners
        $('#hide').onclick = toggleWindow;

        // MINIMIZE BUTTON
        $('#btnMinimize').onclick = () => {
            const win = ui.undiscordWindow;
            win.classList.toggle('minimized');
        };

        $('#toggleSidebar').onclick = () => ui.undiscordWindow.classList.toggle('hide-sidebar');
        $('button#start').onclick = startAction;
        $('button#stop').onclick = stopAction;
        $('button#clear').onclick = () => {
            ui.logArea.innerHTML = '';
        };
        $('button#getAuthor').onclick = () => {
            $('input#authorId').value = getAuthorId();
        };
        $('button#getGuild').onclick = () => {
            const guildId = $('input#guildId').value = getGuildId();
            if (guildId === '@me') $('input#channelId').value = getChannelId();
        };
        $('button#getChannel').onclick = () => {
            $('input#channelId').value = getChannelId();
            $('input#guildId').value = getGuildId();
        };
        $('#redact').onchange = () => {
            const b = ui.undiscordWindow.classList.toggle('redact');
            if (b) alert('This mode will attempt to hide personal information, so you can screen share / take screenshots.\nAlways double check you are not sharing sensitive information!');
        };
        $('#pickMessageAfter').onclick = async () => {
            alert('Select a message on the chat.\nThe message below it will be deleted.');
            toggleWindow();
            const id = await messagePicker.grab('after');
            if (id) $('input#minId').value = id;
            toggleWindow();
        };
        $('#pickMessageBefore').onclick = async () => {
            alert('Select a message on the chat.\nThe message above it will be deleted.');
            toggleWindow();
            const id = await messagePicker.grab('before');
            if (id) $('input#maxId').value = id;
            toggleWindow();
        };
        $('button#getToken').onclick = () => {
            $('input#token').value = fillToken();
        };

        // COPY BUTTON LOGIC
        $('button#copy').onclick = () => {
            const logText = ui.logArea.innerText;
            navigator.clipboard.writeText(logText);

            // Visual feedback
            const btn = $('button#copy');
            const originalText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => {
                btn.innerText = originalText;
            }, 1500);
        };

        // AUTO LOG TOGGLE
        $('#autoLog').onchange = (e) => {
            undiscordCore.options.autoLog = e.target.checked;
        };
        // SAVE MESSAGES ONLY FOR AUTO LOG
        $('#saveMessagesOnlyLog').onchange = (e) => {
            undiscordCore.options.saveMessagesOnlyLog = e.target.checked;
        };
        // AUTO SAVE TOGGLE
        $('#autoSave').onchange = (e) => {
            undiscordCore.options.autoSave = e.target.checked;
        };
        // SAVE MESSAGES ONLY FOR AUTO SAVE
        $('#saveMessagesOnlySave').onchange = (e) => {
            undiscordCore.options.saveMessagesOnlySave = e.target.checked;
        };
        // AUTO CLEAR TOGGLE
        $('#autoClear').onchange = (e) => {
            undiscordCore.options.autoClear = e.target.checked;
        };

        // MANUAL CLEAR LOG BUTTON (In Logs section)
        $('button#btnLogClear').onclick = () => {
            ui.logArea.innerHTML = '';
        };

        // sync delays
        $('input#searchDelay').onchange = (e) => {
            const v = parseInt(e.target.value);
            if (v) undiscordCore.options.searchDelay = v;
        };
        $('input#deleteDelay').onchange = (e) => {
            const v = parseInt(e.target.value);
            if (v) undiscordCore.options.deleteDelay = v;
        };

        $('input#searchDelay').addEventListener('input', (event) => {
            $('div#searchDelayValue').textContent = event.target.value + ' ms';
        });
        $('input#deleteDelay').addEventListener('input', (event) => {
            $('div#deleteDelayValue').textContent = event.target.value + ' ms';
        });

        // SET DEFAULT BADGE VALUES (New Code)
        $('div#searchDelayValue').textContent = $('input#searchDelay').value + ' ms';
        $('div#deleteDelayValue').textContent = $('input#deleteDelay').value + ' ms';

        // import json
        const fileSelection = $('input#importJsonInput');
        fileSelection.onchange = async () => {
            const files = fileSelection.files;
            if (files.length === 0) return log.warn('No file selected.');
            const channelIdField = $('input#channelId');
            const guildIdField = $('input#guildId');
            guildIdField.value = '@me';
            $('input#authorId').value = getAuthorId();
            try {
                const file = files[0];
                const text = await file.text();
                const json = JSON.parse(text);
                const channelIds = Object.keys(json);
                channelIdField.value = channelIds.join(',');
                log.info(`Loaded ${channelIds.length} channels.`);
            } catch (err) {
                log.error('Error parsing file!', err);
            }
        };

        // redirect console logs
        setLogFn(printLog);

        setupUndiscordCore();

        // Force initial icon color
        ui.undiscordBtn.style.color = '#23a559';
    }

    function printLog(type = '', args) {
        ui.logArea.insertAdjacentHTML('beforeend', `<div class="log log-${type}">${Array.from(args).map(o => typeof o === 'object' ? JSON.stringify(o, o instanceof Error && Object.getOwnPropertyNames(o)) : o).join('\t')}</div>`);
        if (ui.autoScroll.checked) ui.logArea.querySelector('div:last-child').scrollIntoView(false);
        if (type === 'error') console.error(PREFIX, ...Array.from(args));
    }

    function setupUndiscordCore() {

        undiscordCore.onStart = (state, stats) => {
            console.log(PREFIX, 'onStart', state, stats);
            $('#start').disabled = true;
            $('#stop').disabled = false;

            ui.undiscordBtn.classList.add('running');
            ui.progressMain.style.display = 'block';
            ui.percent.style.display = 'block';
        };

        undiscordCore.onProgress = (state, stats) => {
            let max = state.grandTotal;
            const systemCount = state._systemMessageIds.size;
            const value = state.delCount + state.failCount + systemCount;
            max = Math.max(max, value, 0);

            // CALC STATS
            const percent = value >= 0 && max ? Math.round(value / max * 100) + '%' : '0%';
            const elapsed = msToHMS(Date.now() - stats.startTime.getTime());
            const remaining = msToHMS(stats.etr);

            // CREATE HTML (Using fixed-width spans from CSS)
            const barHtml = `
            <span class="stat-box stat-progress">${percent} (${value}/${max})</span>
            <span class="stat-box stat-elapsed">Elapsed: ${elapsed}</span>
            <span class="stat-box stat-remaining">Remaining: ${remaining}</span>
        `;

            // Update Footer
            ui.percent.innerHTML = barHtml;

            // Update Header Status (The "Gray Gap")
            const statusEl = document.getElementById('status');
            if (statusEl) {
                // Only update if the script is running, so we don't overwrite "Scan complete"
                if (state.running) {
                    statusEl.innerHTML = barHtml;
                }
            }

            // Progress Bar
            ui.progressIcon.value = value;
            ui.progressMain.value = value;

            if (max) {
                ui.progressIcon.setAttribute('max', max);
                ui.progressMain.setAttribute('max', max);
            } else {
                ui.progressIcon.removeAttribute('value');
                ui.progressMain.removeAttribute('value');
            }

            // Sync Delays
            const searchDelayInput = $('input#searchDelay');
            searchDelayInput.value = undiscordCore.options.searchDelay;
            $('div#searchDelayValue').textContent = undiscordCore.options.searchDelay + 'ms';

            const deleteDelayInput = $('input#deleteDelay');
            deleteDelayInput.value = undiscordCore.options.deleteDelay;
            $('div#deleteDelayValue').textContent = undiscordCore.options.deleteDelay + 'ms';
        };

        undiscordCore.onStop = (state, stats) => {
            console.log(PREFIX, 'onStop', state, stats);
            $('#start').disabled = false;
            $('#stop').disabled = true;
            ui.undiscordBtn.classList.remove('running');
            ui.progressMain.style.display = 'none';
            ui.percent.style.display = 'none';
        };
    }

    async function startAction() {
        console.log(PREFIX, 'startAction');
        // general
        const authorId = $('input#authorId').value.trim();
        const guildId = $('input#guildId').value.trim();
        const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/);
        const includeNsfw = $('input#includeNsfw').checked;
        // filter
        const content = $('input#search').value.trim();
        const hasLink = $('input#hasLink').checked;
        const hasFile = $('input#hasFile').checked;
        const includePinned = $('input#includePinned').checked;
        const pattern = $('input#pattern').value;
        // message interval
        const minId = $('input#minId').value.trim();
        const maxId = $('input#maxId').value.trim();
        // date range
        const minDate = $('input#minDate').value.trim();
        const maxDate = $('input#maxDate').value.trim();
        //advanced
        const searchDelay = parseInt($('input#searchDelay').value.trim());
        const deleteDelay = parseInt($('input#deleteDelay').value.trim());

        // token
        const authToken = $('input#token').value.trim() || fillToken();
        if (!authToken) return; // get token already logs an error.

        // validate input
        if (!guildId) return log.error('You must fill the "Server ID" field!');

        // clear logArea
        ui.logArea.innerHTML = '';

        undiscordCore.resetState();
        undiscordCore.options = {
            ...undiscordCore.options,
            authToken,
            authorId,
            guildId,
            channelId: channelIds.length === 1 ? channelIds[0] : undefined, // single or multiple channel
            minId: minId || minDate,
            maxId: maxId || maxDate,
            content,
            hasLink,
            hasFile,
            includeNsfw,
            includePinned,
            pattern,
            searchDelay,
            deleteDelay,
            autoLog: $('input#autoLog').checked,
            saveMessagesOnlyLog: $('input#saveMessagesOnlyLog').checked,
            autoSave: $('input#autoSave').checked,
            saveMessagesOnlySave: $('input#saveMessagesOnlySave').checked,
            autoClear: $('input#autoClear').checked,
            // maxAttempt: 2,
        };
        if (channelIds.length > 1) {
            const jobs = channelIds.map(ch => ({
                guildId: guildId,
                channelId: ch,
            }));

            try {
                await undiscordCore.runBatch(jobs);
            } catch (err) {
                log.error('CoreException', err);
            }
        }
        // single channel
        else {
            try {
                await undiscordCore.run();
            } catch (err) {
                log.error('CoreException', err);
                undiscordCore.stop();
            }
        }
    }

    function stopAction() {
        console.log(PREFIX, 'stopAction');
        undiscordCore.stop();
    }

    // ---- END Undiscord ----

    initUI();

})();
