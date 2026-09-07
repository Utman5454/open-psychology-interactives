/* =========================================================================
   Open Psychology Interactives — product layer: Markdown renderer
   -------------------------------------------------------------------------
   Renders the project's teaching notes (and other Markdown the product layer
   shows) as HTML, in the browser, with no dependency.

   It covers what the 150 teaching-notes files actually use, which was
   measured before this was written: headings (# to ####), paragraphs,
   bulleted and numbered lists with one level of nesting, block quotes,
   pipe tables, horizontal rules, fenced code blocks, and inline bold,
   italic, code and links. Nothing else is attempted, and anything it does
   not understand is shown as text rather than dropped.

   Safety: the source is HTML-escaped in full before any markup is added,
   so a note cannot inject elements, and link destinations are limited to
   http(s), mailto and relative paths. Raw HTML in the source is shown as
   text. The notes are the project's own files, but the same renderer will
   show lecturer-written text in lessons, where this matters.

   Usage:

       OPI.renderMarkdown(text)                        -> HTML string
       OPI.renderMarkdown(text, { shift: 1 })          -> headings moved down a level
       OPI.renderMarkdown(text, { dropTitle: true })   -> a leading h1 removed
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeHref(url) {
    var trimmed = url.trim();
    if (/^(https?:|mailto:)/i.test(trimmed)) { return trimmed; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) { return null; }  // any other scheme
    return trimmed;  // relative or fragment
  }

  /* ------------------------------------------------------------- inline */

  // Code spans are lifted out first and put back last, so nothing inside
  // them is treated as markup. The placeholder uses a control character that
  // cannot occur in the escaped source.
  var CODE_MARK = "";

  function inline(text) {
    var codes = [];
    var out = text.replace(/`([^`\n]+)`/g, function (_, code) {
      codes.push("<code>" + code + "</code>");
      return CODE_MARK + (codes.length - 1) + CODE_MARK;
    });
    out = out.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, function (whole, label, url) {
      var href = safeHref(url.replace(/&amp;/g, "&"));
      if (!href) { return whole; }
      var external = /^https?:/i.test(href);
      return '<a href="' + escapeHtml(href) + '"' + (external ? ' rel="noopener"' : "") + ">" + label + "</a>";
    });
    // Bold may contain an italic word: **normal, not *t*.**
    out = out.replace(/\*\*((?:[^*\n]|\*[^*\n]+\*)+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
    out = out.replace(/(^|[^\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>");
    return out.replace(/(\d+)/g, function (_, index) { return codes[Number(index)]; });
  }

  /* -------------------------------------------------------------- blocks */

  var LIST_RE = /^(\s*)([-*]|\d+[.)])\s+(.*)$/;
  var HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
  var TABLE_SEP_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
  // The source is escaped before parsing, so a quote marker reads "&gt;".
  var QUOTE_RE = /^\s*&gt;/;
  var BLANK_RE = /^\s*$/;
  var FENCE_RE = /^```/;

  function renderTable(lines) {
    function cells(line) {
      return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|")
        .map(function (c) { return inline(c.trim()); });
    }
    var html = '<div class="table-scroll"><table><thead><tr>';
    cells(lines[0]).forEach(function (cell) { html += '<th scope="col">' + cell + "</th>"; });
    html += "</tr></thead><tbody>";
    for (var i = 2; i < lines.length; i += 1) {
      html += "<tr>";
      cells(lines[i]).forEach(function (cell) { html += "<td>" + cell + "</td>"; });
      html += "</tr>";
    }
    return html + "</tbody></table></div>";
  }

  function listType(marker) { return /^\d/.test(marker) ? "ol" : "ul"; }

  /** Render list lines, one level of nesting. An item's text is gathered
      in full before inlining, so emphasis may span a wrapped line. */
  function renderList(lines) {
    var top = lines[0].match(LIST_RE);
    var baseIndent = top[1].length;
    var tag = listType(top[2]);
    var html = "<" + tag + ">";
    var open = false;
    var text = [];
    var nested = [];

    function closeItem() {
      if (!open) { return; }
      html += "<li>" + inline(text.join(" "));
      if (nested.length) { html += renderList(nested); nested = []; }
      html += "</li>";
      open = false;
      text = [];
    }

    lines.forEach(function (line) {
      var m = line.match(LIST_RE);
      if (m && m[1].length <= baseIndent) {
        closeItem();
        text.push(m[3]);
        open = true;
      } else if (m) {
        nested.push(line.slice(baseIndent));
      } else if (nested.length) {
        nested.push(line);
      } else {
        text.push(line.trim());  // continuation of a wrapped item
      }
    });
    closeItem();
    return html + "</" + tag + ">";
  }

  function isListLine(line) {
    return LIST_RE.test(line) || /^\s{2,}\S/.test(line);
  }

  /** Collect one block of a given kind starting at `from`; returns [lines, next]. */
  function takeWhile(lines, from, test) {
    var taken = [];
    var i = from;
    while (i < lines.length && test(lines[i])) { taken.push(lines[i]); i += 1; }
    return [taken, i];
  }

  function takeList(lines, from) {
    var result = takeWhile(lines, from, function (l) { return !BLANK_RE.test(l) && isListLine(l); });
    var list = result[0];
    var i = result[1];
    // A blank line followed by an indented list line continues the list.
    while (i + 1 < lines.length && BLANK_RE.test(lines[i]) && LIST_RE.test(lines[i + 1]) &&
           lines[i + 1].match(LIST_RE)[1].length > 0) {
      var more = takeWhile(lines, i + 1, function (l) { return !BLANK_RE.test(l) && isListLine(l); });
      list = list.concat(more[0]);
      i = more[1];
    }
    return [list, i];
  }

  function isParagraphLine(line) {
    return !BLANK_RE.test(line) && !HEADING_RE.test(line) && !FENCE_RE.test(line) &&
      !QUOTE_RE.test(line) && !LIST_RE.test(line);
  }

  function render(source, shift) {
    var lines = source.replace(/\r\n?/g, "\n").split("\n");
    var html = [];
    var i = 0;
    var taken;

    while (i < lines.length) {
      var line = lines[i];

      if (BLANK_RE.test(line)) { i += 1; continue; }

      if (FENCE_RE.test(line)) {
        taken = takeWhile(lines, i + 1, function (l) { return !FENCE_RE.test(l); });
        html.push("<pre><code>" + taken[0].join("\n") + "</code></pre>");
        i = taken[1] + 1;
        continue;
      }

      var heading = line.match(HEADING_RE);
      if (heading) {
        var h = Math.min(6, heading[1].length + shift);
        html.push("<h" + h + ">" + inline(heading[2]) + "</h" + h + ">");
        i += 1;
        continue;
      }

      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { html.push("<hr>"); i += 1; continue; }

      if (QUOTE_RE.test(line)) {
        taken = takeWhile(lines, i, function (l) { return QUOTE_RE.test(l); });
        var inner = taken[0].map(function (l) { return l.replace(/^\s*&gt;\s?/, ""); }).join("\n");
        html.push("<blockquote>" + render(inner, shift) + "</blockquote>");
        i = taken[1];
        continue;
      }

      if (/\|/.test(line) && i + 1 < lines.length && TABLE_SEP_RE.test(lines[i + 1])) {
        taken = takeWhile(lines, i, function (l) { return /\|/.test(l) && !BLANK_RE.test(l); });
        html.push(renderTable(taken[0]));
        i = taken[1];
        continue;
      }

      if (LIST_RE.test(line)) {
        taken = takeList(lines, i);
        html.push(renderList(taken[0]));
        i = taken[1];
        continue;
      }

      taken = takeWhile(lines, i, isParagraphLine);
      html.push("<p>" + inline(taken[0].map(function (l) { return l.trim(); }).join(" ")) + "</p>");
      i = taken[1];
    }
    return html.join("\n");
  }

  /**
   * @param {string} text  Markdown source.
   * @param {{shift?: number, dropTitle?: boolean}} [options]
   *   `shift` moves every heading down that many levels; `dropTitle`
   *   removes a leading h1, for a document shown under a page that already
   *   names it.
   * @returns {string} HTML.
   */
  OPI.renderMarkdown = function (text, options) {
    var shift = (options && options.shift) || 0;
    var source = String(text || "");
    if (options && options.dropTitle) {
      source = source.replace(/^\s*#\s[^\n]*\n?/, "");
    }
    return render(escapeHtml(source), shift);
  };

  OPI.escapeHtml = escapeHtml;
}(window));
