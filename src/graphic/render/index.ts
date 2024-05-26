import { plane } from '../plane/index.ts';
import { rect } from '../elements/rect.ts';

export function renderPlaneAsXML(plane: plane): string {
  var result = '';
  function renderTransform(transform: transform): string {
    var result = '';
    var transformLength = transform.length;
    for (var i = 0; i < transformLength; i++) {
      switch (transform[i]?.type) {
        case 'translate':
          result += ` translate(${transform[i].x},${transform[i].y})`;
          break;
        case 'scale':
          result += ` scale(${transform[i].x},${transform[i].y})`;
          break;
        case 'rotate':
          result += ` rotate(${transform[i].deg})`;
          break;
        case 'skewX':
          result += ` skewX(${transform[i].deg})`;
          break;
        case 'skewY':
          result += ` skewY(${transform[i].deg})`;
          break;
        default:
          break;
      }
    }
  }
  function renderRect(rect: rect): string {
    return `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" rx="${rect.rx}" ry="${rect.ry}" stroke="${rect.stroke}" stroke-dasharray="${rect.strokeDasharray}" stroke-linecap="${rect.strokeLinecap}" stroke-linejoin="${rect.strokeLinejoin}" transform="${renderTransform(rect.transform)}" opacity="${rect.opacity}" visibility="${rect.visibility}" />`;
  }
  for (var element of plane.elements) {
    switch (element?.type) {
      case 'rect':
        result += renderRect(element);
        break;
      default:
        break;
    }
  }
  return result
}
