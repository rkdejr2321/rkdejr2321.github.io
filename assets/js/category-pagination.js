(function () {
  var PER_PAGE = 10;
  var container = document.querySelector('.entries-list') || document.querySelector('.entries-grid');
  if (!container) return;

  var items = Array.from(container.children);
  if (items.length <= PER_PAGE) return;

  var currentPage = 1;
  var totalPages = Math.ceil(items.length / PER_PAGE);

  function showPage(page) {
    items.forEach(function (item, i) {
      item.style.display = (i >= (page - 1) * PER_PAGE && i < page * PER_PAGE) ? '' : 'none';
    });
    currentPage = page;
    renderPagination();
    window.scrollTo(0, 0);
  }

  function makeLi(text, pageNum, isCurrent, isDisabled) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#';
    a.textContent = text;
    if (isCurrent) { a.className = 'current'; }
    if (isDisabled) { a.className = 'disabled'; }
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!isDisabled && !isCurrent) { showPage(pageNum); }
    });
    li.appendChild(a);
    return li;
  }

  function renderPagination() {
    var existing = document.getElementById('category-pagination');
    if (existing) { existing.remove(); }

    var nav = document.createElement('nav');
    nav.id = 'category-pagination';
    nav.className = 'pagination';

    var ul = document.createElement('ul');
    ul.appendChild(makeLi('이전', currentPage - 1, false, currentPage === 1));

    for (var p = 1; p <= totalPages; p++) {
      ul.appendChild(makeLi(String(p), p, p === currentPage, false));
    }

    ul.appendChild(makeLi('다음', currentPage + 1, false, currentPage === totalPages));
    nav.appendChild(ul);
    container.insertAdjacentElement('afterend', nav);
  }

  showPage(1);
})();
