"use strict";

let _memoryStorage = {};

window.saveLS = function saveLS(key, value) {
  try {
    const s = JSON.stringify(value);
    _memoryStorage[key] = s;
    localStorage.setItem(key, s);
  } catch (_) {}
};

window.loadLS = function loadLS(key, defaultValue) {
  try {
    const s = localStorage.getItem(key);
    if (s === null) {
      return defaultValue;
    }
    return JSON.parse(s);
  } catch (ex) {
    const s = _memoryStorage[key];
    if (s === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(s);
    } catch (_) {
      return defaultValue;
    }
  }
};

window.deleteLS = function deleteLS(key) {
  delete _memoryStorage[key];
  try {
    localStorage.removeItem(key);
  } catch (_) {}
};

window.resetLS = function resetLS() {
  try {
    _memoryStorage = {};
    localStorage.clear();
  } catch (_) {}
};
