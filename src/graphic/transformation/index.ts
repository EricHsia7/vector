import { translate, scale, rotate, skewX, skewY, matrix, rad, transform, point, points } from '../attributes/index';

export function createTranslationMatrix(translate: translate): matrix {
  return [
    [1, 0, translate.x],
    [0, 1, translate.y],
    [0, 0, 1]
  ];
}

export function createScalingMatrix(scale: scale): matrix {
  return [
    [scale.x, 0, 0],
    [0, scale.y, 0],
    [0, 0, 1]
  ];
}

export function createRotationMatrix(rotate: rotate): matrix {
  const rad: rad = (rotate.deg * Math.PI) / 180;
  return [
    [Math.cos(rad), -Math.sin(rad), 0],
    [Math.sin(rad), Math.cos(rad), 0],
    [0, 0, 1]
  ];
}

export function createSkewXMatrix(skewX: skewX): matrix {
  const rad: rad = (skewX.deg * Math.PI) / 180;
  return [
    [1, Math.tan(rad), 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
}

export function createSkewYMatrix(skewY: skewY): matrix {
  const rad: rad = (skewY.deg * Math.PI) / 180;
  return [
    [1, 0, 0],
    [Math.tan(rad), 1, 0],
    [0, 0, 1]
  ];
}

export function multiplyMatrices(a: matrix, b: matrix): matrix {
  var result: matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}

export function createTransformationMatrix(transform: transform): matrix {
  var identityMatrix: matrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
  var transformLength = transform.length;

  for (var i = 0; i < transformLength; i++) {
    var transformationMatrix: matrix;
    switch (transform[i]?.type) {
      case 'translate':
        transformationMatrix = createTranslationMatrix(transform[i]);
        break;
      case 'scale':
        transformationMatrix = createScalingMatrix(transform[i]);
        break;
      case 'rotate':
        transformationMatrix = createRotationMatrix(transform[i]);
        break;
      case 'skewX':
        transformationMatrix = createSkewXMatrix(transform[i]);
        break;
      case 'skewY':
        transformationMatrix = createSkewYMatrix(transform[i]);
        break;
      default:
        transformationMatrix = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
        break;
    }
    identityMatrix = multiplyMatrices(transformationMatrix, identityMatrix);
  }
  return identityMatrix; // return a new "identity" matrix
}

export function transformPoints(points: points, transform: transform): points {
  function applyTransformationMatrix(matrix: matrix, point: point): point {
    const [x, y, _] = [matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2], matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2], 1];
    return { x, y };
  }
  const transformationMatrix = createTransformationMatrix(transform);
  return points.map((point) => applyTransformationMatrix(transformationMatrix, point));
}
