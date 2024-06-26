const { keys, values, entries } = Object;

const map = (object, fn) => {
  const updated = {};

  entries(object).forEach(([key, value]) => {
    updated[key] = fn(key, value);
  });

  return updated;
};

const filter = (object, fn) => {
  const updated = {};

  entries(object).forEach(([key, value]) => {
    if (fn(key, value)) {
      updated[key] = value;
    }
  });

  return updated;
};

const some = (object) => {
  let result = false;

  values(object).forEach((value) => {
    if (value) {
      result = true;
    }
  });

  return result;
};

const every = (object) => {
  let result = true;

  values(object).forEach((value) => {
    if (!value) {
      result = false;
    }
  });

  return result;
};

export default { keys, values, map, filter, some, every };
