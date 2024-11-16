import { elementType } from '../../graphic/attributes';
import { addPathElement, modifyAddingPathElement, settleAddingPathElement } from './path';
import { addShapeElement, modifyAddingShapeElement, settleAddingShapeElement } from './shape';

const editorElement: HTMLElement = document.querySelector('.css_editor');
const editorCanvasElement: HTMLCanvasElement = editorElement.querySelector('#css_editor_canvas');
const toolbarElement: HTMLElement = editorElement.querySelector('.css_editor_toolbar');
const toolbarButtonElements: HTMLElement = toolbarElement.querySelectorAll('.css_editor_toolbar_button');

export type tools = 'shape' | 'path' | 'move' | 'select';

let currentCursorX: number = 0;
let currentCursorY: number = 0;
let currentTouchPointIdentifier: number = 0;

export let currentTool: tools = 'shape';
export let selectedElements: Array<string> = [];

export function initializeTools(): void {
  console.log('a', 0);
  const eventsSet = [
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    ['mousedown', 'mousemove', 'mouseup', 'mouseout']
  ];

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const events = isTouchDevice ? eventsSet[0] : eventsSet[1];
  console.log('a', 1);

  // Event listeners
  editorCanvasElement.addEventListener(events[0], (event) => {
    console.log('b', 0);
    event.preventDefault(); // Prevent scrolling
    console.log('b', 1);

    if (isTouchDevice) {
      console.log('b', 2);

      const touch = event.touches[0];
      currentCursorX = touch.clientX;
      currentCursorY = touch.clientY;
      currentTouchPointIdentifier = touch.identifier * 1;
    } else {
      console.log('b', 3);

      currentCursorX = event.offsetX;
      currentCursorY = event.offsetY;
    }
    console.log('b', 4);

    switch (currentTool) {
      case 'shape':
        console.log('b', 5);

        addShapeElement(currentCursorX, currentCursorY);
        break;
      case 'path':
        console.log('b', 6);

        addPathElement(currentCursorX, currentCursorY);
        break;
      default:
        break;
    }
  });
  console.log('a', 2);

  editorCanvasElement.addEventListener(events[1], (event) => {
    console.log('c', 0);

    event.preventDefault(); // Prevent scrolling
    if (isTouchDevice) {
      console.log('c', 1);

      var touches: [] = [];
      for (var t in event.touches) {
        console.log('c', 2);

        if (event.touches.hasOwnProperty(t) && typeof event.touches[t] === 'object') {
          console.log('c', 3);

          touches.push(event.touches[t]);
        }
      }
      const touch = touches.filter((p) => p.identifier === currentTouchPointIdentifier)[0];
      if (touch) {
        console.log('c', 4);

        currentCursorX = touch.clientX;
        currentCursorY = touch.clientY;
      }
    } else {
      console.log('c', 5);

      currentCursorX = event.offsetX;
      currentCursorY = event.offsetY;
    }
    console.log('c', 6);

    switch (currentTool) {
      case 'shape':
        console.log('c', 7);

        modifyAddingShapeElement(currentCursorX, currentCursorY);
        break;
      case 'path':
        console.log('c', 8);

        modifyAddingPathElement(currentCursorX, currentCursorY);
        break;
      default:
        break;
    }
  });
  console.log('a', 3);

  editorCanvasElement.addEventListener(events[2], (event) => {
    console.log('d', 0);

    event.preventDefault(); // Prevent scrolling
    if (isTouchDevice) {
      console.log('d', 1);
      var touches = [];
      for (var t in event.changedTouches) {
        console.log('d', 2);
        if (event.changedTouches.hasOwnProperty(t) && typeof event.changedTouches[t] === 'object') {
          console.log('d', 3);

          touches.push(event.changedTouches[t]);
        }
      }
      const touch = touches.filter((p) => p.identifier === currentTouchPointIdentifier)[0];
      if (touch) {
        console.log('d', 4);

        currentCursorX = touch.clientX;
        currentCursorY = touch.clientY;
      }
    } else {
      console.log('d', 5);
      currentCursorX = event.offsetX;
      currentCursorY = event.offsetY;
    }
    console.log('d', 6);
    switch (currentTool) {
      case 'shape':
        console.log('d', 7);
        settleAddingShapeElement(currentCursorX, currentCursorY);
        break;
      case 'path':
        console.log('d', 8);
        settleAddingPathElement(currentCursorX, currentCursorY);
        break;
      default:
        break;
    }
  });
  console.log('a', 4);

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
