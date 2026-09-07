/* =========================================================================
   Open Psychology Interactives — product layer: catalogue loader
   -------------------------------------------------------------------------
   Reads the two published catalogues and presents the 150 activities as one
   list with one shape, so the library, the activity page and the lesson
   builder never have to know that the editions are indexed differently.

   This is the product layer's only view of the content layer. It reads
   data/catalogue.json and data/catalogue-simplified.json exactly as they
   are; it never writes, and nothing in the content layer depends on it.

   Usage:

       <script src="../assets/product/catalogue.js" defer></script>

       OPI.loadCatalogues().then(function (catalogue) {
         catalogue.activities   // Activity[], in module order then teaching order
         catalogue.modules      // [{ slug, name, number }]
         catalogue.byKey[key]   // Activity by OPI.activityKey(...)
       });

   An Activity:

       {
         key:        "original/research-methods/08-sampling-distribution-pvalue-simulator",
         edition:    "original" | "simplified",
         moduleSlug: "research-methods",
         module:     "Research Methods",
         toolSlug:   "08-sampling-distribution-pvalue-simulator",
         title, summary, teachingJob,
         path:       "modules/research-methods/tools/08-.../index.html"   (site-relative)
         notesPath:  "modules/research-methods/tools/08-.../teaching-notes.md",
         minutes, difficulty, topics[], interactionTypes[], learningObjectives[],
         band:       "short" | "medium" | "long",
         twinKey:    key of the paired activity in the other edition, or null,
         order:      position within its module and edition
       }

   Paths are site-relative. Resolve them with OPI.fromSiteRoot(path), which
   uses the page's data-site-root attribute exactly as assets/js/main.js does.

   Needs fetch(), so it needs an HTTP origin. On file:// it rejects with a
   clear reason and the page shows its static message instead.
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};

  OPI.EDITIONS = {
    original: { label: "Full-length", plural: "full-length activities", minutes: "15 to 30 minutes" },
    simplified: { label: "Simplified", plural: "Simplified Edition activities", minutes: "5 to 7 minutes" }
  };

  /* Duration bands for filtering. The catalogues carry 5 to 7 minutes for
     the Simplified Edition and 15 to 30 for the originals, so three bands
     separate the two editions and split the originals in half. */
  OPI.BANDS = {
    short: { label: "Up to 10 minutes", test: function (m) { return m <= 10; } },
    medium: { label: "15 to 20 minutes", test: function (m) { return m > 10 && m <= 20; } },
    long: { label: "25 to 30 minutes", test: function (m) { return m > 20; } }
  };

  function siteRoot() {
    var root = global.document.body.getAttribute("data-site-root") || "./";
    return root.replace(/\/*$/, "/");
  }

  /** Resolve a site-relative path from the current page. */
  OPI.fromSiteRoot = function (path) {
    return siteRoot() + String(path || "").replace(/^\/+/, "");
  };

  OPI.activityKey = function (edition, moduleSlug, toolSlug) {
    return edition + "/" + moduleSlug + "/" + toolSlug;
  };

  function bandOf(minutes) {
    var names = Object.keys(OPI.BANDS);
    for (var i = 0; i < names.length; i += 1) {
      if (OPI.BANDS[names[i]].test(minutes)) { return names[i]; }
    }
    return "long";
  }

  function fetchJson(path) {
    return global.fetch(OPI.fromSiteRoot(path), { cache: "no-cache" }).then(function (response) {
      if (!response.ok) { throw new Error(path + " returned " + response.status); }
      return response.json();
    });
  }

  function directoryOf(pagePath) {
    return pagePath.replace(/[^/]*$/, "");
  }

  function normaliseOriginal(module, tool, order) {
    var path = tool.path || ("modules/" + tool.moduleSlug + "/tools/" + tool.toolSlug + "/index.html");
    return {
      key: OPI.activityKey("original", tool.moduleSlug, tool.toolSlug),
      edition: "original",
      moduleSlug: tool.moduleSlug,
      module: tool.module || module.module,
      toolSlug: tool.toolSlug,
      title: tool.title || "",
      summary: tool.summary || "",
      teachingJob: tool.readmeTopic || "",
      path: path,
      notesPath: directoryOf(path) + "teaching-notes.md",
      minutes: Number(tool.estimatedMinutes) || 0,
      band: bandOf(Number(tool.estimatedMinutes) || 0),
      difficulty: tool.difficulty || "",
      topics: tool.topics || [],
      interactionTypes: tool.interactionTypes || [],
      learningObjectives: tool.learningObjectives || [],
      accessibilityNotes: tool.accessibilityNotes || "",
      privacy: tool.privacy || "",
      dataStatus: tool.dataStatus || "",
      simulationNotes: tool.simulationNotes || "",
      twinKey: null,
      order: order
    };
  }

  function normaliseSimplified(module, activity, order) {
    var path = activity.path || ("simplified/modules/" + activity.moduleSlug + "/tools/" + activity.toolSlug + "/index.html");
    return {
      key: OPI.activityKey("simplified", activity.moduleSlug, activity.toolSlug),
      edition: "simplified",
      moduleSlug: activity.moduleSlug,
      module: activity.module || module.module,
      toolSlug: activity.toolSlug,
      title: activity.title || "",
      summary: activity.summary || "",
      teachingJob: activity.teachingJob || "",
      path: path,
      notesPath: directoryOf(path) + "teaching-notes.md",
      minutes: Number(activity.estimatedMinutes) || 0,
      band: bandOf(Number(activity.estimatedMinutes) || 0),
      difficulty: activity.difficulty || "",
      topics: activity.topics || [],
      interactionTypes: activity.interactionTypes || [],
      learningObjectives: activity.learningObjectives || [],
      accessibilityNotes: activity.accessibilityNotes || "",
      privacy: activity.privacy || "",
      dataStatus: "",
      simulationNotes: activity.scopeNote || "",
      twinKey: OPI.activityKey("original", activity.moduleSlug, activity.pairedWith || activity.toolSlug),
      order: order
    };
  }

  function build(original, simplified) {
    var modules = [];
    var activities = [];
    var byKey = {};

    (original.modules || []).forEach(function (module, index) {
      modules.push({ slug: module.moduleSlug, name: module.module, number: index + 1, summary: module.summary || "" });
      (module.tools || []).forEach(function (tool, order) {
        if (tool.status !== "published") { return; }
        var activity = normaliseOriginal(module, tool, order);
        activities.push(activity);
        byKey[activity.key] = activity;
      });
    });

    (simplified.modules || []).forEach(function (module) {
      (module.activities || []).forEach(function (entry, order) {
        if (entry.status !== "published") { return; }
        var activity = normaliseSimplified(module, entry, order);
        activities.push(activity);
        byKey[activity.key] = activity;
        var twin = byKey[activity.twinKey];
        if (twin) { twin.twinKey = activity.key; } else { activity.twinKey = null; }
      });
    });

    // Module order, then edition (original first), then teaching order.
    var moduleIndex = {};
    modules.forEach(function (module, index) { moduleIndex[module.slug] = index; });
    activities.sort(function (a, b) {
      return (moduleIndex[a.moduleSlug] - moduleIndex[b.moduleSlug]) ||
        (a.edition === b.edition ? 0 : (a.edition === "original" ? -1 : 1)) ||
        (a.order - b.order);
    });

    return { modules: modules, activities: activities, byKey: byKey };
  }

  var cached = null;

  /** Load both catalogues once and return the merged view. */
  OPI.loadCatalogues = function () {
    if (cached) { return cached; }
    if (global.location.protocol === "file:" || typeof global.fetch !== "function") {
      return Promise.reject(new Error("The library needs to be served over HTTP; it cannot read the catalogue from a file:// address."));
    }
    cached = Promise.all([fetchJson("data/catalogue.json"), fetchJson("data/catalogue-simplified.json")])
      .then(function (results) { return build(results[0], results[1]); });
    cached.catch(function () { cached = null; });
    return cached;
  };

  /** Fetch a site-relative text file (used for teaching notes). */
  OPI.fetchText = function (path) {
    return global.fetch(OPI.fromSiteRoot(path), { cache: "no-cache" }).then(function (response) {
      if (!response.ok) { throw new Error(path + " returned " + response.status); }
      return response.text();
    });
  };
}(window));
