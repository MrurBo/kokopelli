// --- Toggle debug via ?debug=1 or localStorage.ga_debug = "1"
const DEBUG =
    /[?&]debug=1\b/.test(location.search) ||
    localStorage.getItem("ga_debug") === "1";

// Optional helpers to flip it on/off from console:
// localStorage.setItem('ga_debug','1'); location.reload();
// localStorage.removeItem('ga_debug'); location.reload();

window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

gtag("js", new Date());
// If supported, this marks all events as debug (we also add per-event below)
gtag("config", "G-3KP42Y69SS", { debug_mode: DEBUG });

// Wrapper to send events with optional debug + console logging
function track(eventName, params = {}) {
    const payload = {
        ...params,
        ...(DEBUG ? { debug_mode: true } : {}),
    };

    if (DEBUG) {
        // Pretty console logging
        console.groupCollapsed(`[GA4] ${eventName}`);
        console.table(payload.items || [payload]);
        console.log(payload);
        console.groupEnd();
    }

    gtag("event", eventName, payload);
}

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.startsWith("/products/")) {
        const parts = window.location.pathname.split("/");
        const productId = parts[parts.length - 1] || "(unknown)";
        const productName = document.title;
        const priceEl = document.querySelector("[data-price]");
        const productPrice = priceEl ? Number(priceEl.dataset.price) : 25;

        // Product view
        track("view_item", {
            items: [
                {
                    id: productId,
                    name: productName,
                    category: "products",
                    price: productPrice,
                },
            ],
        });

        // Clicks
        const whatsapp = document.getElementById("whatsapp-link");
        if (whatsapp) {
            whatsapp.addEventListener("click", function () {
                track("select_item", {
                    items: [
                        {
                            id: productId,
                            name: productName,
                            category: "products",
                            price: productPrice,
                            channel: "whatsapp",
                        },
                    ],
                });
            });
        }

        const instagram = document.getElementById("instagram-link");
        if (instagram) {
            instagram.addEventListener("click", function () {
                track("select_item", {
                    items: [
                        {
                            id: productId,
                            name: productName,
                            category: "products",
                            price: productPrice,
                            channel: "instagram",
                        },
                    ],
                });
            });
        }
    }
});
