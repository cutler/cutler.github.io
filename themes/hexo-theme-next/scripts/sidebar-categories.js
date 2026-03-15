/**
 * 侧栏「所有文章」用 Helper 直接返回排序后的分类列表，避免 filter 修改 locals 不生效
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

function postFilename(post) {
  if (post.source) {
    var parts = post.source.split('/');
    return parts[parts.length - 1] || post.source;
  }
  return post.slug || post.path || '';
}

function sortPostsByFilename(posts) {
  var list = toArray(posts);
  return list.sort(function (a, b) {
    var nameA = postFilename(a);
    var nameB = postFilename(b);
    return nameA.localeCompare(nameB, 'zh-CN');
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
    if (nameToPosts.hasOwnProperty(n)) out.push({ name: n, posts: sortPostsByFilename(nameToPosts[n]) });
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

hexo.extend.helper.register('sidebar_categories_sorted', function () {
  var site = this.site;
  if (!site) return [];
  var orderList = (this.theme && this.theme.category_order) || [];
  var categoriesArray = toArray(site.categories || []);
  if (categoriesArray.length > 0) {
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
        sorted.push({ name: cat.name, posts: sortPostsByFilename(cat.posts) });
      }
    }
    for (var k = 0; k < categoriesArray.length; k++) {
      var c = categoriesArray[k];
      if (!used[c.name]) sorted.push({ name: c.name, posts: sortPostsByFilename(c.posts) });
    }
    return sorted.length > 0 ? sorted : buildCategoriesFromPosts(site.posts || []);
  }
  return applyCategoryOrder(buildCategoriesFromPosts(site.posts || []), orderList);
});
