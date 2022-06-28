module.exports = (opts = {}) => {
  const partSegments = [];

  let parts = Array.isArray(opts.parts) ? opts.parts : [];

  if (typeof opts.parts === 'string') {
    parts = opts.parts.split(' ');
  }

  return {
    postcssPlugin: 'postcss-parts',
    OnceExit (root, postcss) {
      let lastSplitIndex = -1;
      let lastSplitAfterIsPart = false;

      root.walkComments(comment => {
        if (comment.text.startsWith('PARTS')) {
          const splitpoint = {
            index: root.index(comment),
            beforeIsPart: false,
            afterIsPart: false
          };

          let splitArray = comment.text.split(/\s+/);
          splitArray = splitArray.map(splitItem => splitItem.split('='));
          splitArray.forEach(splitElement => {
            if (splitElement.length === 2 && parts.includes(splitElement[1])) {
              if (splitElement[0].toLowerCase() === 'before') {
                splitpoint.beforeIsPart = true;
              }

              if (splitElement[0].toLowerCase() === 'after') {
                splitpoint.afterIsPart = true;
              }
            }
          });

          if (splitpoint.beforeIsPart || lastSplitAfterIsPart) {
            partSegments.push({start: lastSplitIndex + 1, end: splitpoint.index});
          }

          lastSplitAfterIsPart = splitpoint.afterIsPart;
          lastSplitIndex = splitpoint.index;
        }
      });

      if (lastSplitAfterIsPart) {
        partSegments.push({start: lastSplitIndex + 1, end: root.nodes.length})
      }

      const newFileRoot = postcss.root();

      for (const partSegment of partSegments) {
        for (let i = partSegment.start; i < partSegment.end; i++) {
          const newNode = root.nodes[i].clone();
          if (i === partSegment.start) {
            newNode.cleanRaws();
          }
          newFileRoot.append(newNode);
        }
      }

      root.nodes = [...newFileRoot.nodes];
    }
  }
}

module.exports.postcss = true
