import { plane } from '../plane/index.ts';
import { rect } from '../elements/rect.ts';
import { createTransformationMatrix } from '../transformation/index.ts';
import { circle } from '../elements/circle.js';

interface renderConfig {
  flattenTransform: boolean;
}

export function renderPlaneAsXML(plane: plane, config: renderConfig): string {
  function renderElements(plane: plane, config: renderConfig): string {
    var result = '';
    function renderTransform(transform: transform, config: renderConfig): string {
      if (config.flattenTransform) {
        var transformationMatrix = createTransformationMatrix(transform);
        var result = `matrix(${transformationMatrix[0][0]},${transformationMatrix[1][0]},${transformationMatrix[0][1]},${transformationMatrix[1][1]},${transformationMatrix[0][2]},${transformationMatrix[1][2]})`;
        return result;
      } else {
        var result = [];
        var transformLength = transform.length;
        for (var i = 0; i < transformLength; i++) {
          switch (transform[i]?.type) {
            case 'translate':
              result.push(`translate(${transform[i].x},${transform[i].y})`);
              break;
            case 'scale':
              result.push(`scale(${transform[i].x},${transform[i].y})`);
              break;
            case 'rotate':
              result.push(`rotate(${transform[i].deg})`);
              break;
            case 'skewX':
              result.push(`skewX(${transform[i].deg})`);
              break;
            case 'skewY':
              result.push(`skewY(${transform[i].deg})`);
              break;
            default:
              break;
          }
        }
        return result.join(' ');
      }
    }

    function renderRect(rect: rect, plane: plane): string {
      return `<rect x="${rect.x + plane.x}" y="${rect.y + plane.y}" width="${rect.width}" height="${rect.height}" rx="${rect.rx}" ry="${rect.ry}" fill="${rect.fill}" stroke="${rect.stroke}" stroke-dasharray="${rect.strokeDasharray}" stroke-linecap="${rect.strokeLinecap}" stroke-linejoin="${rect.strokeLinejoin}" transform="${renderTransform(rect.transform, config)}" opacity="${rect.opacity}" visibility="${rect.visibility}" />`;
    }

    function renderCircle(circle: circle, plane: plane): string {
      return `<circle cx="${circle.cx + plane.x}" cy="${circle.cy + plane.y}" r="${circle.r}" fill="${circle.fill}" stroke="${circle.stroke}" stroke-dasharray="${circle.strokeDasharray}" stroke-linecap="${circle.strokeLinecap}" stroke-linejoin="${circle.strokeLinejoin}" transform="${renderTransform(circle.transform, config)}" opacity="${circle.opacity}" visibility="${circle.visibility}" />`;
    }

    for (var element of plane.elements) {
      switch (element?.type) {
        case 'rect':
          result += renderRect(element, plane);
          break;
        case 'circle':
          result += renderCircle(element, plane);
          break;
        default:
          break;
      }
    }

    for (var subPlane of plane.subPlanes) {
      result += renderElements(subPlane, config);
    }
    
    return `<g>${result}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${plane.width}" height="${plane.height}" viewBox="0 0 ${plane.width} ${plane.height}">${renderElements(plane, config)}</svg>`;
}
