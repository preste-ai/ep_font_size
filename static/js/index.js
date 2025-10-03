"use strict";

const shared = require("./shared");

// Bind the event handler to the toolbar buttons
exports.postAceInit = (hookName, context) => {
  const hs = $("#font-size, select.size-selection");
  hs.on("change", function () {
    const value = $(this).val();
    const intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      context.ace.callWithAce(
        (ace) => {
          ace.ace_doInsertsizes(intValue);
        },
        "insertsize",
        true
      );
      hs.val("6");
    }
  });

  $(".font_size").hover(() => {
    $(".submenu > .size-selection").attr("size", 6);
    $(".submenu > #font-size").attr("size", 6);
  });

  $(".font-size-icon").click(() => {
    $("#font-size").toggle();
  });
};

exports.aceAttribsToClasses = (hookName, context) => {
  if (context.key === "font-size") {
    return [`font-size:${context.value}`];
  }
  return [];
};

exports.aceCreateDomLine = (hookName, context) => {
  const classes = context.cls.split(" ");
  const fontSizeClass = classes.find((cls) => cls.startsWith("font-size:"));
  if (!fontSizeClass) return [];
  const size = fontSizeClass.split(":")[1];
  if (!shared.sizes.includes(size)) return [];
  return [
    {
      extraOpenTags: "",
      extraCloseTags: "",
      cls: fontSizeClass,
    },
  ];
};

exports.aceInitialized = (hookName, context) => {
  context.editorInfo.ace_doInsertsizes = (level) => {
    const { rep, documentAttributeManager } = context;
    if (!(rep.selStart && rep.selEnd)) return;
    if (level >= 0 && shared.sizes[level] === undefined) return;

    // Remove all existing font-size attributes before applying new one
    shared.sizes.forEach((size) => {
      documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
        ["font-size", ""],
      ]);
    });

    if (level >= 0) {
      const newSize = ["font-size", shared.sizes[level]];
      documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
        newSize,
      ]);
    }
  };
};

exports.aceEditorCSS = () => ["ep_font_size/static/css/size.css"];

exports.postToolbarInit = (hookName, context) => {
  context.toolbar.registerCommand("fontSize", (buttonName, toolbar, item) => {
    $("#font-size").toggle();
  });
};
