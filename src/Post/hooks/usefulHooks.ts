export const uniqBy = (array: any[]) => {
  let seen = new Set();
  return array.filter((item) => {
    let k = JSON.stringify(item);
    return seen.has(k) ? false : seen.add(k);
  });
};
