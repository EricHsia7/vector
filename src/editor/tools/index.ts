import { elementType } from '../../graphic/attributes';
import { addShapeElement, modifyAddingShapeElement, settleAddingShapeElement } from './add/shape.ts';

export type tools = 'shape' | 'pen' | 'move' | 'selector';

var currentCursorX: number = 0;
var currentCursorY: number = 0;
var currentTouchPointIdentifier: number = 0;

export var currentTool: tools = 'shape';
export var selectedElements: string[] = [];

export function initializeTools(): void {
  const canvas = document.querySelector('#canvas');
  const eventsSet = [
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    ['mousedown', 'mousemove', 'mouseup', 'mouseout']
  ];

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const events = isTouchDevice ? eventsSet[0] : eventsSet[1];

  // Event listeners
  canvas.addEventListener(events[0], (event) => {
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
      default:
        break;
    }
  });

  canvas.addEventListener(events[1], (event) => {
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
      default:
        break;
    }
  });

  canvas.addEventListener(events[2], (event) => {
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
