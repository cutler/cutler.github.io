/**
 * 分类与分类下文章的自定义排序
 * - 分类顺序：由主题 _config.yml 的 category_order 决定
 * - 文章顺序：由每篇文章 front matter 的 order 或 weight 决定（数值小的靠前，未设置的排在后面）
 */
'use strict';

function toArray(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (typeof obj.toArray === 'function') return obj.toArray();
  if (obj.data != null) return Array.isArray(obj.data) ? obj.data : Object.values(obj.data);
  if (typeof obj.forEach === 'function') {
    var arr = [];
    obj.forEach(function (item) { arr.push(item); });
    return arr;
  }
  if (typeof obj.length === 'number') {
    var list = [];
    for (var n = 0; n < obj.length; n++) list.push(obj[n]);
    return list;
  }
  if (obj && typeof obj === 'object') {
    var vals = Object.values(obj);
    if (vals.length > 0 && vals[0] && typeof vals[0].name !== 'undefined') return vals;
  }
  return [];
}

function sortPostsByOrder(posts) {
  var list = toArray(posts);
  var defaultOrder = 9999;
  return list.sort(function (a, b) {
    var orderA = a.order != null ? a.order : (a.weight != null ? a.weight : defaultOrder);
    var orderB = b.order != null ? b.order : (b.weight != null ? b.weight : defaultOrder);
    if (orderA !== orderB) return orderA - orderB;
    return (b.date || 0) - (a.date || 0);
  });
}

function buildCategoriesFromPosts(posts) {
  var nameToPosts = {};
  var list = toArray(posts);
  for (var i = 0; i < list.length; i++) {
    var post = list[i];
    var cats = [];
    if (typeof post.categories === 'string') cats = [post.categories];
    else if (post.categories) cats = toArray(post.categories);
    if (cats.length === 0 && post.category) cats = typeof post.category === 'string' ? [post.category] : toArray(post.category);
    for (var j = 0; j < cats.length; j++) {
      var name = typeof cats[j] === 'string' ? cats[j] : (cats[j] && cats[j].name);
      if (name) {
        if (!nameToPosts[name]) nameToPosts[name] = [];
        nameToPosts[name].push(post);
      }
    }
  }
  var out = [];
  for (var n in nameToPosts) {
    if (nameToPosts.hasOwnProperty(n)) out.push({ name: n, posts: sortPostsByOrder(nameToPosts[n]) });
  }
  return out;
}

function applyCategoryOrder(catsArray, orderList) {
  if (!orderList || orderList.length === 0) return catsArray;
  var byName = {};
  for (var i = 0; i < catsArray.length; i++) byName[catsArray[i].name] = catsArray[i];
  var out = [];
  for (var j = 0; j < orderList.length; j++) {
    var c = byName[orderList[j]];
    if (c) { out.push(c); delete byName[c.name]; }
  }
  for (var k in byName) out.push(byName[k]);
  return out;
}

module.exports = function (hexo) {
  hexo.extend.filter.register('template_locals', function (locals) {
    var site = locals.site;
    if (!site) {
      locals.site.categories_sorted = [];
      return locals;
    }
    var orderList = (hexo.theme.config && hexo.theme.config.category_order) || [];

    if (!site.categories) {
      locals.site.categories_sorted = applyCategoryOrder(buildCategoriesFromPosts(site.posts || []), orderList);
      return locals;
    }

    var categoriesArray = toArray(site.categories);
    if (categoriesArray.length === 0) {
      locals.site.categories_sorted = applyCategoryOrder(buildCategoriesFromPosts(site.posts || []), orderList);
      return locals;
    }
    var nameToCategory = {};
    for (var i = 0; i < categoriesArray.length; i++) {
      var cat = categoriesArray[i];
      nameToCategory[cat.name] = cat;
    }

    var sorted = [];
    var used = {};
    for (var j = 0; j < orderList.length; j++) {
      var name = orderList[j];
      var cat = nameToCategory[name];
      if (cat && !used[name]) {
        used[name] = true;
        sorted.push({
          name: cat.name,
          posts: sortPostsByOrder(cat.posts)
        });
      }
    }
    for (var k = 0; k < categoriesArray.length; k++) {
      var c = categoriesArray[k];
      if (!used[c.name]) {
        sorted.push({
          name: c.name,
          posts: sortPostsByOrder(c.posts)
        });
      }
    }

    if (sorted.length > 0) {
      locals.site.categories_sorted = sorted;
    } else {
      locals.site.categories_sorted = buildCategoriesFromPosts(site.posts || []);
    }
    return locals;
  });
};
