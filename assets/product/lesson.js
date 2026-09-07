/* =========================================================================
   Open Psychology Interactives — product layer: the lesson
   -------------------------------------------------------------------------
   The lesson is the unit a lecturer makes and a student receives: a title,
   an introduction, and an ordered list of steps, each an activity from the
   catalogue with instructions, a note, or a question. This file owns the
   shape of that object and everything that moves it around:

     OPI.newLesson()                  an empty lesson
     OPI.validateLesson(lesson)       [] when valid, otherwise messages
     OPI.normaliseLesson(object)      coerce and drop unknown fields
     OPI.encodeLesson(lesson)         Promise<string> for a link fragment
     OPI.decodeLesson(string)         Promise<lesson>, validated
     OPI.lessonUrl(encoded)           the absolute student link
     OPI.draft.load/save/clear        the lecturer's draft in localStorage

   The link carries the lesson itself. A URL fragment is never sent to a
   server, so a lesson link is private by construction, needs no account
   and no storage anywhere, and works wherever the site is hosted. The
   encoding is JSON, deflated with the browser's own CompressionStream and
   written as base64url, prefixed "d."; where the browser lacks
   CompressionStream the JSON goes in uncompressed, prefixed "j.". Both
   forms decode everywhere that can decode at all.

   The same object, validated by the same rules (mirrored in
   scripts/check-lessons.py), is what data/lessons/*.json holds and what a
   later server would store. Nothing in it names a person, a subject or a
   platform: activities are referenced by catalogue coordinates.
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};

  OPI.LESSON_SCHEMA = 1;

  /* Character limits. Generous for real use, tight enough that a link stays
     pasteable and a malicious payload stays small. */
  OPI.LESSON_LIMITS = {
    title: 200, intro: 4000, author: 100, steps: 40,
    instructions: 2000, note: 4000, prompt: 1000
  };

  var EDITIONS = ["original", "simplified"];
  var SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;
  var STEP_TYPES = ["activity", "note", "question"];
  var QUESTION_KINDS = ["short", "long"];

  function text(value, limit) {
    return String(value == null ? "" : value).slice(0, limit);
  }

  OPI.newLesson = function () {
    return { schema: OPI.LESSON_SCHEMA, title: "", intro: "", author: "", steps: [] };
  };

  OPI.newStep = function (type, fields) {
    var step = { type: type };
    if (type === "activity") {
      step.edition = fields.edition; step.module = fields.module; step.tool = fields.tool;
      step.instructions = fields.instructions || "";
    } else if (type === "note") {
      step.text = fields.text || "";
    } else {
      step.prompt = fields.prompt || ""; step.kind = fields.kind || "long";
    }
    return step;
  };

  /** Coerce an untrusted object into a lesson, dropping anything unknown. */
  OPI.normaliseLesson = function (input) {
    var source = input && typeof input === "object" ? input : {};
    var L = OPI.LESSON_LIMITS;
    var lesson = {
      schema: OPI.LESSON_SCHEMA,
      title: text(source.title, L.title),
      intro: text(source.intro, L.intro),
      author: text(source.author, L.author),
      steps: []
    };
    var steps = Array.isArray(source.steps) ? source.steps.slice(0, L.steps) : [];
    steps.forEach(function (raw) {
      if (!raw || typeof raw !== "object") { return; }
      if (raw.type === "activity") {
        lesson.steps.push({
          type: "activity",
          edition: text(raw.edition, 20), module: text(raw.module, 80), tool: text(raw.tool, 80),
          instructions: text(raw.instructions, L.instructions)
        });
      } else if (raw.type === "note") {
        lesson.steps.push({ type: "note", text: text(raw.text, L.note) });
      } else if (raw.type === "question") {
        lesson.steps.push({
          type: "question", prompt: text(raw.prompt, L.prompt),
          kind: QUESTION_KINDS.indexOf(raw.kind) === -1 ? "long" : raw.kind
        });
      }
    });
    return lesson;
  };

  /** Messages describing what is wrong; an empty array means valid. */
  OPI.validateLesson = function (lesson) {
    var problems = [];
    if (!lesson || typeof lesson !== "object") { return ["The lesson is not an object."]; }
    if (lesson.schema !== OPI.LESSON_SCHEMA) { problems.push("Unknown lesson format (schema " + lesson.schema + ")."); }
    if (typeof lesson.title !== "string" || !lesson.title.trim()) { problems.push("The lesson needs a title."); }
    if (!Array.isArray(lesson.steps) || lesson.steps.length === 0) { problems.push("The lesson needs at least one step."); }
    if (Array.isArray(lesson.steps) && lesson.steps.length > OPI.LESSON_LIMITS.steps) {
      problems.push("A lesson can hold at most " + OPI.LESSON_LIMITS.steps + " steps.");
    }
    (Array.isArray(lesson.steps) ? lesson.steps : []).forEach(function (step, index) {
      var n = "Step " + (index + 1);
      if (!step || STEP_TYPES.indexOf(step.type) === -1) { problems.push(n + " has an unknown type."); return; }
      if (step.type === "activity") {
        if (EDITIONS.indexOf(step.edition) === -1) { problems.push(n + ": unknown edition."); }
        if (!SLUG_RE.test(step.module || "")) { problems.push(n + ": invalid module."); }
        if (!SLUG_RE.test(step.tool || "")) { problems.push(n + ": invalid activity."); }
      } else if (step.type === "note") {
        if (!String(step.text || "").trim()) { problems.push(n + ": the note is empty."); }
      } else if (!String(step.prompt || "").trim()) {
        problems.push(n + ": the question has no prompt.");
      }
    });
    return problems;
  };

  /* --------------------------------------------------------------- codec */

  function bytesToBase64Url(bytes) {
    var binary = "";
    for (var i = 0; i < bytes.length; i += 1) { binary += String.fromCharCode(bytes[i]); }
    return global.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function base64UrlToBytes(text) {
    var padded = text.replace(/-/g, "+").replace(/_/g, "/");
    while (padded.length % 4) { padded += "="; }
    var binary = global.atob(padded);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) { bytes[i] = binary.charCodeAt(i); }
    return bytes;
  }

  function pipe(bytes, StreamClass) {
    var stream = new global.Blob([bytes]).stream().pipeThrough(new StreamClass("deflate-raw"));
    return new global.Response(stream).arrayBuffer().then(function (buffer) { return new Uint8Array(buffer); });
  }

  OPI.encodeLesson = function (lesson) {
    var json = JSON.stringify(OPI.normaliseLesson(lesson));
    var bytes = new global.TextEncoder().encode(json);
    if (typeof global.CompressionStream !== "function") {
      return Promise.resolve("j." + bytesToBase64Url(bytes));
    }
    return pipe(bytes, global.CompressionStream).then(function (deflated) {
      return "d." + bytesToBase64Url(deflated);
    });
  };

  OPI.decodeLesson = function (encoded) {
    var text = String(encoded || "");
    var kind = text.slice(0, 2);
    var body = text.slice(2);
    var bytesPromise;
    if (kind === "j.") {
      bytesPromise = Promise.resolve(base64UrlToBytes(body));
    } else if (kind === "d.") {
      if (typeof global.DecompressionStream !== "function") {
        return Promise.reject(new Error("This browser cannot open a compressed lesson link."));
      }
      bytesPromise = pipe(base64UrlToBytes(body), global.DecompressionStream);
    } else {
      return Promise.reject(new Error("This is not a lesson link."));
    }
    return bytesPromise.then(function (bytes) {
      var lesson = OPI.normaliseLesson(JSON.parse(new global.TextDecoder().decode(bytes)));
      var problems = OPI.validateLesson(lesson);
      if (problems.length) { throw new Error(problems.join(" ")); }
      return lesson;
    });
  };

  /** The absolute student link for an encoded lesson. */
  OPI.lessonUrl = function (encoded) {
    var player = new global.URL(OPI.fromSiteRoot("lessons/index.html"), global.location.href);
    player.hash = "l=" + encoded;
    player.search = "";
    return player.href;
  };

  /* --------------------------------------------------------------- draft */

  var DRAFT_KEY = "opi.lesson.draft.v1";

  OPI.draft = {
    load: function () {
      try {
        var raw = global.localStorage.getItem(DRAFT_KEY);
        return raw ? OPI.normaliseLesson(JSON.parse(raw)) : null;
      } catch (error) { return null; }
    },
    save: function (lesson) {
      try {
        global.localStorage.setItem(DRAFT_KEY, JSON.stringify(OPI.normaliseLesson(lesson)));
        return true;
      } catch (error) { return false; }
    },
    clear: function () {
      try { global.localStorage.removeItem(DRAFT_KEY); } catch (error) { /* nothing to clear */ }
    }
  };
}(window));
