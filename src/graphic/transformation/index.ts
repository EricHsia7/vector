import { translate, scale, rotate, skewX, skewY, matrix, rad, transform } from '../attributes/index.ts';

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

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result.splice(i, 1, result[i].splice(j, 1, result[i][j] + a[i][k] * b[k][j]));
      }
    }
  }

  return result;
}

export function flattenTransformIntoMatrix(transform: transform): matrix {
  var identityMatrix: matrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
  var transformLength = transform.length;

  for (var i = 0; i < transformLength; i++) {
    var transformMatrix: matrix;
    switch (transform[i]?.type) {
      case 'translate':
        transformMatrix = createTranslationMatrix(transform[i]);
        break;
      case 'scale':
        transformMatrix = createScalingMatrix(transform[i]);
        break;
      case 'rotate':
        transformMatrix = createRotationMatrix(transform[i]);
        break;
      case 'skewX':
        transformMatrix = createSkewXMatrix(transform[i]);
        break;
      case 'skewY':
        transformMatrix = createSkewYMatrix(transform[i]);
        break;
      default:
        transformMatrix = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
        break;
    }
    identityMatrix = multiplyMatrices(transform[i], identityMatrix);
  }
  return identityMatrix; // return a new "identity" matrix
}
