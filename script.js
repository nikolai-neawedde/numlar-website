function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

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
        <a class="research-card" href="projects.html">
            <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(item.title || "")}</h3>
            <p>${escapeHtml(item.abstract || "")}</p>
            <span class="card-arrow">→</span>
        </a>
    `).join("");
}

loadResearch();
