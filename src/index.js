import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./index.css";

/**
 * Available layouts
 * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
 */
import layout from "simple-keyboard-layouts/build/layouts/arabic";

let qwertyLayout = {
  default: [
    "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} q w e r t y u i o p [ ] \\",
    "{lock} a s d f g h j k l ; ' {enter}",
    "{shift} z x c v b n m , . / {shift}",
    ".com @ {space}"
  ],
  shift: [
    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
    "{tab} Q W E R T Y U I O P { } |",
    '{lock} A S D F G H J K L : " {enter}',
    "{shift} Z X C V B N M < > ? {shift}",
    ".com @ {space}"
  ]
};

let arabicLayout = {
  default: [
    "\u0630 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} \u0636 \u0635 \u062B \u0642 \u0641 \u063A \u0639 \u0647 \u062E \u062D \u062C \u062F \\",
    "{lock} \u0634 \u0633 \u064A \u0628 \u0644 \u0627 \u062A \u0646 \u0645 \u0643 \u0637 {enter}",
    "{shift} \u0626 \u0621 \u0624 \u0631 \u0644\u0627 \u0649 \u0629 \u0648 \u0632 \u0638 {shift}",
    ".com @ {space}"
  ],
  shift: [
    "\u0651 ! @ # $ % ^ & * ) ( _ + {bksp}",
    "{tab} \u064E \u064B \u064F \u064C \u0644\u0625 \u0625 \u2018 \u00F7 \u00D7 \u061B < > |",
    '{lock} \u0650 \u064D ] [ \u0644\u0623 \u0623 \u0640 \u060C / : " {enter}',
    "{shift} ~ \u0652 } { \u0644\u0622 \u0622 \u2019 , . \u061F {shift}",
    ".com @ {space}"
  ]
};

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  layout: arabicLayout,
  debug: true
});

console.log(layout);

/**
 * Update simple-keyboard when input is changed directly
 */
document.querySelector(".input").addEventListener("input", event => {
  keyboard.setInput(event.target.value);
});

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === "{shift}" || button === "{lock}") handleShift();
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}

/**
 * Handle keyboard press
 */
document.addEventListener("keydown", event => {
  highlightButton(event);
});

document.addEventListener("keyup", event => {
  unhighlightButton(event);
});

function highlightButton(event) {
  let physicalKeyboardKeyName = keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(
    event
  );

  let qwertyLayoutIndexes = getLayoutKeyIndex(
    physicalKeyboardKeyName,
    qwertyLayout
  );

  if (qwertyLayoutIndexes) {
    let { rIndex, bIndex } = qwertyLayoutIndexes;

    console.log("buttonIndexes", rIndex, bIndex);

    let layoutKeyName = findLayoutKeyByIndex(rIndex, bIndex, arabicLayout);

    let buttonElement = getButtonInLayout(layoutKeyName);

    if (!buttonElement) {
      console.log("Could not find button in layout", layoutKeyName);
      return false;
    }

    buttonElement.style.background = "#9ab4d0";
    buttonElement.style.color = "white";

    /**
     * Trigger press
     */
    buttonElement.onpointerdown();
    buttonElement.onpointerup();
  }
}

function unhighlightButton(event) {
  let physicalKeyboardKeyName = keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(
    event
  );

  let qwertyLayoutIndexes = getLayoutKeyIndex(
    physicalKeyboardKeyName,
    qwertyLayout
  );

  if (qwertyLayoutIndexes) {
    let { rIndex, bIndex } = qwertyLayoutIndexes;

    let layoutKeyName = findLayoutKeyByIndex(rIndex, bIndex, arabicLayout);

    let buttonElement = getButtonInLayout(layoutKeyName);

    if (!buttonElement) {
      console.log("Could not find button in layout", layoutKeyName);
      return false;
    }

    buttonElement.removeAttribute("style");
  }
}

function getButtonInLayout(layoutKeyName) {
  let buttonElement =
    keyboard.getButtonElement(layoutKeyName) ||
    keyboard.getButtonElement(`{${layoutKeyName}}`);

  return buttonElement;
}

function getLayoutKeyIndex(layoutKey, layout) {
  const run = () => {
    let layoutName = keyboard.options.layoutName;
    layout[layoutName].forEach((row, rIndex) => {
      let rowButtons = row.split(" ");

      rowButtons.forEach((button, bIndex) => {
        if (button === layoutKey) {
          throw {
            rIndex,
            bIndex
          };
        }
      });
    });
  };

  try {
    run();
    return false;
  } catch (res) {
    return res;
  }
}

function findLayoutKeyByIndex(rIndex, bIndex, layout) {
  let layoutName = keyboard.options.layoutName;
  let row = layout[layoutName][rIndex];

  if (row) {
    let rowButtons = row.split(" ");
    return rowButtons[bIndex];
  }
}
