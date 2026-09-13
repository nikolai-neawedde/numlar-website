function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}


// =========================
// Research listing
// =========================

async function loadResearch() {
    const list = document.getElementById("research-list");

    if (!list) return;

    const { data, error } = await supabaseClient
        .from("research")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false });

    if (error) {
        console.error("Supabase error:", error);
        list.innerHTML = "<p>Unable to load research.</p>";
        return;
    }

    if (!data || data.length === 0) {
        list.innerHTML = "<p>No published research yet.</p>";
        return;
    }

    list.innerHTML = data.map((item, index) => `
    <a
        class="research-card"
        href="research-project.html?slug=${encodeURIComponent(item.slug || "")}"
    >
        <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(item.title || "")}</h3>
        <p>${escapeHtml(item.abstract || "")}</p>
        <span class="card-arrow">→</span>
    </a>
`).join("");
}


// =========================
// Individual research project
// =========================

async function loadResearchProject() {

    const titleElement = document.getElementById("research-title");

    if (!titleElement) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) {
        titleElement.textContent = "Research project not found";
        return;
    }

    const { data, error } = await supabaseClient
        .from("research")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (error || !data) {

        console.error("Research project error:", error);

        titleElement.textContent = "Research project not found";

        document.getElementById("research-abstract").textContent =
            "The requested research project could not be found.";

        return;
    }

    document.title = `${data.title} | Numlar`;

    document.getElementById("research-title").textContent =
        data.title || "";

    document.getElementById("research-category").textContent =
        (data.category || "RESEARCH").toUpperCase();

    document.getElementById("research-abstract").textContent =
        data.abstract || "";

    document.getElementById("research-meta-category").textContent =
        data.category || "—";

    document.getElementById("research-date").textContent =
        data.date || "—";

    document.getElementById("research-status").textContent =
        data.status || "—";

    document.getElementById("research-full-abstract").textContent =
        data.abstract || "";

    document.getElementById("research-content-text").textContent =
        data.content || "";
}


// =========================
// Start
// =========================

loadResearch();
loadResearchProject();
