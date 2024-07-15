const hasExactlyThreeConsecutive = (path: string, char: string): boolean => {
  let count = 0;
  for (let i = 0; i < path.length; i++) {
    if (path[i] === char) {
      count++;
      if (count === 3) {
        if (i + 1 < path.length && path[i + 1] === char) {
          continue;
        } else {
          return true;
        }
      }
    } else {
      count = 0;
    }
  }
  return false;
};
export const countPaths = (x: number, y: number): string[] => {
  const results: string[] = [];

  const backtrack = (currX: number, currY: number, path: string) => {
    if (currX === x && currY === y) {
      if (
        hasExactlyThreeConsecutive(path, "E") ||
        hasExactlyThreeConsecutive(path, "N")
      ) {
        return;
      }
      results.push(path);
      return;
    }

    if (currX < x) {
      backtrack(currX + 1, currY, path + "E");
    }

    if (currY < y) {
      backtrack(currX, currY + 1, path + "N");
    }
  };

  backtrack(0, 0, "");

  return results;
};

export const countEqualXYPaths = (x: number): string[] => {
  const results: string[] = [];
  const visited: Set<string> = new Set(); // To track visited paths

  const backtrack = (currX: number, currY: number, path: string) => {
    if (currX === x && currY === x) {
      if (
        hasExactlyThreeConsecutive(path, "E") ||
        hasExactlyThreeConsecutive(path, "N")
      ) {
        return;
      }

      const mirroredPath = mirrorPath(path);

      // Ensure both path and mirroredPath are unique before adding
      const pathKey = path + "|" + mirroredPath;
      if (!visited.has(pathKey)) {
        results.push(path);
        visited.add(pathKey);
      }

      return;
    }

    if (currX < x) {
      backtrack(currX + 1, currY, path + "E");
    }

    if (currY < x) {
      backtrack(currX, currY + 1, path + "N");
    }
  };

  const mirrorPath = (path: string): string => {
    return path
      .split("")
      .map((char) => (char === "N" ? "E" : "N"))
      .join("");
  };

  backtrack(0, 0, "");

  return results;
};
