import type { KeyboardShortcutMatcher } from './Types'

export const CustomKeyboardShortcuts = Object.freeze([
  {
    id: 'SAVE_SHORTCUT',
    hasModifier: true,
    shiftKey: false,
    key: 's',
  },
  {
    id: 'EDIT_LINK_SHORTCUT',
    hasModifier: true,
    key: 'k',
  },
  {
    id: 'OPEN_LINK_SHORTCUT',
    altKey: true,
    key: 'Enter',
  },
  {
    id: 'INSERT_COMMENT_SHORTCUT',
    hasModifier: true,
    shiftKey: false,
    altKey: true,
    code: 'KeyM',
    displayKey: 'm',
  },
  {
    id: 'OPEN_COMMENT_PANEL_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    altKey: true,
    code: 'KeyA',
    displayKey: 'a',
  },
  {
    id: 'STRIKETHROUGH_TOGGLE_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'KeyS',
    displayKey: 's',
  },
  {
    id: 'INCREASE_FONT_SIZE_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'Period',
    displayKey: '.',
  },
  {
    id: 'DECREASE_FONT_SIZE_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'Comma',
    displayKey: ',',
  },
  {
    id: 'QUOTE_TOGGLE_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'Quote',
    displayKey: '"',
  },
  {
    id: 'CODE_BLOCK_TOGGLE_SHORTCUT',
    hasModifier: true,
    shiftKey: false,
    key: 'e',
  },
  {
    id: 'INCREASE_INDENTATION_SHORTCUT',
    hasModifier: true,
    key: ']',
  },
  {
    id: 'DECREASE_INDENTATION_SHORTCUT',
    hasModifier: true,
    key: '[',
  },
  {
    id: 'NORMAL_TEXT_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit0',
    displayKey: '0',
  },
  {
    id: 'HEADING_1_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit1',
    displayKey: '1',
  },
  {
    id: 'HEADING_2_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit2',
    displayKey: '2',
  },
  {
    id: 'HEADING_3_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit3',
    displayKey: '3',
  },
  {
    id: 'HEADING_4_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit4',
    displayKey: '4',
  },
  {
    id: 'HEADING_5_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit5',
    displayKey: '5',
  },
  {
    id: 'HEADING_6_SHORTCUT',
    hasModifier: true,
    altKey: true,
    code: 'Digit6',
    displayKey: '6',
  },
  {
    id: 'LEFT_ALIGN_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'KeyL',
    displayKey: 'l',
  },
  {
    id: 'CENTER_ALIGN_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'KeyE',
    displayKey: 'e',
  },
  {
    id: 'RIGHT_ALIGN_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'KeyR',
    displayKey: 'r',
  },
  {
    id: 'JUSTIFY_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'KeyJ',
    displayKey: 'j',
  },
  {
    id: 'NUMBERED_LIST_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'Digit7',
    displayKey: '7',
  },
  {
    id: 'BULLET_LIST_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'Digit8',
    displayKey: '8',
  },
  {
    id: 'CHECK_LIST_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'Digit9',
    displayKey: '9',
  },
  {
    id: 'INSERT_TABLE_SHORTCUT',
    hasModifier: true,
    shiftKey: true,
    code: 'KeyK',
    displayKey: 'k',
  },
] as const) satisfies readonly KeyboardShortcutMatcher[]
