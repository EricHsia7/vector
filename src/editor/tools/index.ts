import { elementType } from '../../graphic/attributes';
import { addPathElement, modifyAddingPathElement, settleAddingPathElement } from './path';
import { addShapeElement, modifyAddingShapeElement, settleAddingShapeElement } from './shape';

const editorElement: HTMLElement = document.querySelector('.css_editor');
const editorCanvasElement: HTMLCanvasElement = editorElement.querySelector('.css_editor_canvas');
const toolbarElement: HTMLElement = editorElement.querySelector('.css_editor_toolbar');
const toolbarButtonElements: HTMLElement = toolbarElement.querySelectorAll('.css_editor_toolbar_button');

export type tools = 'shape' | 'path' | 'move' | 'select';

let currentCursorX: number = 0;
let currentCursorY: number = 0;
let currentTouchPointIdentifier: number = 0;

export let currentTool: tools = 'shape';
export let selectedElements: Array<string> = [];

export function initializeTools(): void {
  const eventsSet = [
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    ['mousedown', 'mousemove', 'mouseup', 'mouseout']
  ];

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const events = isTouchDevice ? eventsSet[0] : eventsSet[1];

  // Event listeners
  editorCanvasElement.addEventListener(events[0], (event) => {
    event.preventDefault(); // Prevent scrolling

    if (isTouchDevice) {
      const touch = event.touches[0];
      currentCursorX = touch.clientX;
      currentCursorY = touch.clientY;
      currentTouchPointIdentifier = touch.identifier * 1;
    } else {
      currentCursorX = event.offsetX;
      currentCursorY = event.offsetY;
    }

    switch (currentTool) {
      case 'shape':
        addShapeElement(currentCursorX, currentCursorY);
        break;
      case 'path':
        addPathElement(currentCursorX, currentCursorY);
        break;
      default:
        break;
    }
  });

  editorCanvasElement.addEventListener(events[1], (event) => {
    event.preventDefault(); // Prevent scrolling
    if (isTouchDevice) {
      var touches: [] = [];
      for (var t in event.touches) {
        if (event.touches.hasOwnProperty(t) && typeof event.touches[t] === 'object') {
          touches.push(event.touches[t]);
        }
      }
      const touch = touches.filter((p) => p.identifier === currentTouchPointIdentifier)[0];
      if (touch) {
        currentCursorX = touch.clientX;
        currentCursorY = touch.clientY;
      }
    } else {
      currentCursorX = event.offsetX;
      currentCursorY = event.offsetY;
    }

    switch (currentTool) {
      case 'shape':
        modifyAddingShapeElement(currentCursorX, currentCursorY);
        break;
      case 'path':
        modifyAddingPathElement(currentCursorX, currentCursorY);
        break;
      default:
        break;
    }
  });

  editorCanvasElement.addEventListener(events[2], (event) => {
    event.preventDefault(); // Prevent scrolling
    if (isTouchDevice) {
      var touches = [];
      for (var t in event.changedTouches) {
        if (event.changedTouches.hasOwnProperty(t) && typeof event.changedTouches[t] === 'object') {
          touches.push(event.changedTouches[t]);
        }
      }
      const touch = touches.filter((p) => p.identifier === currentTouchPointIdentifier)[0];
      if (touch) {
        currentCursorX = touch.clientX;
        currentCursorY = touch.clientY;
      }
    } else {
      currentCursorX = event.offsetX;
      currentCursorY = event.offsetY;
    }

    switch (currentTool) {
      case 'shape':
        settleAddingShapeElement(currentCursorX, currentCursorY);
        break;
      case 'path':
        settleAddingPathElement(currentCursorX, currentCursorY);
        break;
      default:
        break;
    }
  });

  /*
  canvas.addEventListener(events[3], (e) => {
    var cursorX: number = 0;
    var cursorY: number = 0;
    if (isTouchDevice) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      cursorX = touch.clientX - rect.left;
      cursorY = touch.clientY - rect.top;
      e.preventDefault(); // Prevent scrolling
    } else {
      cursorX = e.offsetX;
      cursorY = e.offsetY;
    }
    settleAddingShapeElement(cursorX, cursorY);
  });
  */
}

export function switchTool(tool: number): void {
  currentTool = ['select', 'shape', 'path', 'move'][tool];
  let index = 0;
  for (const toolbarButton of toolbarButtonElements) {
    if (index === tool) {
      toolbarButton.setAttribute('using', 'true');
    } else {
      toolbarButton.setAttribute('using', 'false');
    }
    index += 1;
  }
}
