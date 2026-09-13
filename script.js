function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}


// ========================================
// RESEARCH LIST
// ========================================

async function loadResearch() {
    const list = document.getElementById("research-list");

    if (!list) return;

    const { data, error } = await supabaseClient
        .from("research")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false });

    if (error) {
        console.error("Supabase research error:", error);
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
            <span class="card-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${escapeHtml(item.title || "")}
            </h3>

            <p>
                ${escapeHtml(item.abstract || "")}
            </p>

            <span class="card-arrow">→</span>
        </a>
    `).join("");
}


// ========================================
// INDIVIDUAL RESEARCH PROJECT
// ========================================

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

        const abstractElement =
            document.getElementById("research-abstract");

        if (abstractElement) {
            abstractElement.textContent =
                "The requested research project could not be found.";
        }

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


// ========================================
// PROJECT LIST
// ========================================

async function loadProjects() {

    const list = document.getElementById("project-list");

    if (!list) return;

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: false });

    if (error) {
        console.error("Supabase project error:", error);
        list.innerHTML = "<p>Unable to load projects.</p>";
        return;
    }

    if (!data || data.length === 0) {
        list.innerHTML = "<p>No published projects yet.</p>";
        return;
    }

    list.innerHTML = data.map((item, index) => `
        <a
            class="project-row"
            href="project.html?slug=${encodeURIComponent(item.slug || "")}"
        >
            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>

            <div>
                <p class="project-type">
                    ${escapeHtml(item.category || "PROJECT")}
                </p>

                <h2>
                    ${escapeHtml(item.title || "")}
                </h2>

                <p>
                    ${escapeHtml(item.description || "")}
                </p>
            </div>

            <strong>→</strong>
        </a>
    `).join("");
}


// ========================================
// INDIVIDUAL PROJECT
// ========================================

async function loadProject() {

    const titleElement = document.getElementById("project-title");

    if (!titleElement) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) {
        titleElement.textContent = "Project not found";
        return;
    }

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (error || !data) {

        console.error("Project error:", error);

        titleElement.textContent = "Project not found";

        const descriptionElement =
            document.getElementById("project-description");

        if (descriptionElement) {
            descriptionElement.textContent =
                "The requested project could not be found.";
        }

        return;
    }

    document.title = `${data.title} | Numlar`;

    document.getElementById("project-title").textContent =
        data.title || "";

    document.getElementById("project-category").textContent =
        (data.category || "PROJECT").toUpperCase();

    document.getElementById("project-description").textContent =
        data.description || "";

    document.getElementById("project-meta-category").textContent =
        data.category || "—";

    document.getElementById("project-date").textContent =
        data.date || "—";

    document.getElementById("project-status").textContent =
        data.status || "—";

    document.getElementById("project-full-description").textContent =
        data.description || "";

    document.getElementById("project-content-text").textContent =
        data.content || "";
}


// ========================================
// START
// ========================================

loadResearch();
loadResearchProject();

loadProjects();
loadProject();
