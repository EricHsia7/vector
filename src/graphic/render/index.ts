import { plane } from '../plane/index';

import { rect } from '../elements/rect';
import { circle } from '../elements/circle';
import { ellipse } from '../elements/ellipse';
import { line } from '../elements/line';
import { polyline } from '../elements/polyline';
import { polygon } from '../elements/polygon';

import { createTransformationMatrix } from '../transformation/index';
import { points, transform } from '../attributes/index';

interface renderConfig {
  flattenTransform: boolean;
  exceptID: boolean;
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
        var transformLength: number = transform.length;
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

    function renderPoints(points: points, plane: plane): string {
      return points.map((point) => `${point.x + plane.x},${point.y + plane.y}`).join(' ');
    }

    function renderD(d: d, plane: plane): string {
      var result = [];
      for (var command of d) {
        switch (command?.type) {
          case 'M':
            result.push(`M ${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'L':
            result.push(`L ${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'H':
            result.push(`H ${command.x + plane.x}`);
            break;
          case 'V':
            result.push(`V ${command.y + plane.y}`);
            break;
          case 'C':
            result.push(`C ${command.x1 + plane.x} ${command.y1 + plane.y},${command.x2 + plane.x} ${command.y2 + plane.y},${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'S':
            result.push(`S ${command.x2 + plane.x} ${command.y2 + plane.y},${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'Q':
            result.push(`Q ${command.x1 + plane.x} ${command.y1 + plane.y} ${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'T':
            result.push(`T ${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'A':
            result.push(`A ${command.rx} ${command.ry} ${command.xAxisRotation} ${command.largeArcFlag} ${command.sweepFlag} ${command.x + plane.x} ${command.y + plane.y}`);
            break;
          case 'Z':
            result.push('Z');
            break;
          default:
            break;
        }
      }
      return result.join(' ');
    }

    function renderRect(rect: rect, plane: plane): string {
      var rectWidth: number = Math.abs(rect.width);
      var rectHeight: number = Math.abs(rect.height);
      var rectX: number = rect.x;
      var rectY: number = rect.y;
      if (rect.width < 0) {
        rectX -= rectWidth;
      }
      if (rect.height < 0) {
        rectY -= rectHeight;
      }
      return `<rect x="${rectX + plane.x}" y="${rectY + plane.y}" width="${rectWidth}" height="${rectHeight}" rx="${rect.rx}" ry="${rect.ry}" fill="${rect.fill}" stroke="${rect.stroke}" stroke-dasharray="${rect.strokeDasharray}" stroke-linecap="${rect.strokeLinecap}" stroke-linejoin="${rect.strokeLinejoin}" transform="${renderTransform(rect.transform, config)}" opacity="${rect.opacity}" visibility="${rect.visibility}" ${config.exceptID ? '' : ` id="${rect.id}" `}/>`;
    }

    function renderCircle(circle: circle, plane: plane): string {
      return `<circle cx="${circle.cx + plane.x}" cy="${circle.cy + plane.y}" r="${circle.r}" fill="${circle.fill}" stroke="${circle.stroke}" stroke-dasharray="${circle.strokeDasharray}" stroke-linecap="${circle.strokeLinecap}" stroke-linejoin="${circle.strokeLinejoin}" transform="${renderTransform(circle.transform, config)}" opacity="${circle.opacity}" visibility="${circle.visibility}" ${config.exceptID ? '' : ` id="${circle.id}" `}/>`;
    }

    function renderEllipse(ellipse: ellipse, plane: plane): string {
      return `<ellipse cx="${ellipse.cx + plane.x}" cy="${ellipse.cy + plane.y}" rx="${ellipse.rx}" ry="${ellipse.ry}" fill="${ellipse.fill}" stroke="${ellipse.stroke}" stroke-dasharray="${ellipse.strokeDasharray}" stroke-linecap="${ellipse.strokeLinecap}" stroke-linejoin="${ellipse.strokeLinejoin}" transform="${renderTransform(ellipse.transform, config)}" opacity="${ellipse.opacity}" visibility="${ellipse.visibility}" ${config.exceptID ? '' : ` id="${ellipse.id}" `}/>`;
    }

    function renderLine(line: line, plane: plane): string {
      return `<line x1="${line.x1 + plane.x}" y1="${line.y1 + plane.y}" x2="${line.x2 + plane.x}" y2="${line.y2 + plane.y}" stroke="${line.stroke}" stroke-dasharray="${line.strokeDasharray}" stroke-linecap="${line.strokeLinecap}" stroke-linejoin="${line.strokeLinejoin}" transform="${renderTransform(line.transform, config)}" opacity="${line.opacity}" visibility="${line.visibility}" ${config.exceptID ? '' : ` id="${line.id}" `}/>`;
    }

    function renderPolyline(polyline: polyline, plane: plane): string {
      return `<polyline points="${renderPoints(polyline.points, plane)}" stroke="${polyline.stroke}" stroke-dasharray="${polyline.strokeDasharray}" stroke-linecap="${polyline.strokeLinecap}" stroke-linejoin="${polyline.strokeLinejoin}" transform="${renderTransform(polyline.transform, config)}" opacity="${polyline.opacity}" visibility="${polyline.visibility}" ${config.exceptID ? '' : ` id="${polyline.id}" `}/>`;
    }

    function renderPolygon(polygon: polygon, plane: plane): string {
      return `<polygon points="${renderPoints(polygon.points, plane)}" fill="${polygon.fill}" stroke="${polygon.stroke}" stroke-dasharray="${polygon.strokeDasharray}" stroke-linecap="${polygon.strokeLinecap}" stroke-linejoin="${polygon.strokeLinejoin}" transform="${renderTransform(polygon.transform, config)}" opacity="${polygon.opacity}" visibility="${polygon.visibility}" ${config.exceptID ? '' : ` id="${polygon.id}" `}/>`;
    }

    function renderPath(path: path, plane: plane): string {
      return `<path d="${renderD(path.d, plane)}" fill="${path.fill}" stroke="${path.stroke}" stroke-dasharray="${path.strokeDasharray}" stroke-linecap="${path.strokeLinecap}" stroke-linejoin="${path.strokeLinejoin}" transform="${renderTransform(path.transform, config)}" opacity="${path.opacity}" visibility="${path.visibility}" ${config.exceptID ? '' : ` id="${path.id}" `}/>`;
    }

    for (var element of plane.elements) {
      switch (element?.type) {
        case 'rect':
          result += renderRect(element, plane);
          break;
        case 'circle':
          result += renderCircle(element, plane);
          break;
        case 'ellipse':
          result += renderEllipse(element, plane);
          break;
        case 'line':
          result += renderLine(element, plane);
          break;
        case 'polyline':
          result += renderPolyline(element, plane);
          break;
        case 'polygon':
          result += renderPolygon(element, plane);
          break;
        case 'path':
          result += renderPath(element, plane);
          break;
        default:
          break;
      }
    }

    for (var subPlane of plane.subPlanes) {
      result += renderElements(subPlane, config);
    }

    return `<g${config.exceptID ? '' : ` id="${plane.id}"`}>${result}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${plane.width}" height="${plane.height}" viewBox="0 0 ${plane.width} ${plane.height}">${renderElements(plane, config)}</svg>`;
}
