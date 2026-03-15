/* global NexT: true */

$(document).ready(function () {

  initScrollSpy();
  NexT.utils.needAffix() && initAffix();
  initTOCDimension();

  function initScrollSpy () {
    var tocSelector = '.post-toc';
    var $tocElement = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    $tocElement
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');
      })
      .on('clear.bs.scrollspy', removeCurrentActiveClass);

    $('body').scrollspy({ target: tocSelector });

    function removeCurrentActiveClass () {
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }
  }

  function initAffix () {
    var headerHeight = $('.header-inner').height();
    var footerOffset = parseInt($('.main').css('padding-bottom'), 10);
    var sidebarTop = headerHeight + 10;

    $('.sidebar-inner').affix({
      offset: {
        top: sidebarTop,
        bottom: footerOffset
      }
    });

    $(document)
      .on('affixed.bs.affix', function () {
        updateTOCHeight(document.body.clientHeight - 100);
      });
  }

  function initTOCDimension () {
    var updateTOCHeightTimer;

    $(window).on('resize', function () {
      updateTOCHeightTimer && clearTimeout(updateTOCHeightTimer);

      updateTOCHeightTimer = setTimeout(function () {
        var tocWrapperHeight = document.body.clientHeight - 100;

        updateTOCHeight(tocWrapperHeight);
      }, 0);
    });

    // Initialize TOC Height.
    updateTOCHeight(document.body.clientHeight - 100);

    // Initialize TOC Width.
    var scrollbarWidth = NexT.utils.getScrollbarWidth();
    $('.post-toc').css('width', 'calc(100% + ' + scrollbarWidth + 'px)');
  }

  function updateTOCHeight (height) {
    height = height || 'auto';
    $('.post-toc').css('max-height', height);
  }

});

$(document).ready(function () {
  var html = $('html');
  var TAB_ANIMATE_DURATION = 200;
  var hasVelocity = $.isFunction(html.velocity);

  $('.sidebar-nav li').on('click', function () {
    var item = $(this);
    var activeTabClassName = 'sidebar-nav-active';
    var activePanelClassName = 'sidebar-panel-active';
    if (item.hasClass(activeTabClassName)) {
      return;
    }

    var currentTarget = $('.' + activePanelClassName);
    var target = $('.' + item.data('target'));

    hasVelocity ?
      currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
        currentTarget.removeClass(activePanelClassName);
        currentTarget.css({ display: '', opacity: '', transform: '' });
        target
          .velocity('stop')
          .css({ display: '', opacity: '', transform: '' })
          .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
          .addClass(activePanelClassName);
      }) :
      currentTarget.animate({ opacity: 0 }, TAB_ANIMATE_DURATION, function () {
        currentTarget.removeClass(activePanelClassName);
        currentTarget.hide();
        target
          .stop()
          .css({'opacity': 0, 'display': 'block'})
          .animate({ opacity: 1 }, TAB_ANIMATE_DURATION, function () {
            target.addClass(activePanelClassName);
          });
      });

    item.siblings().removeClass(activeTabClassName);
    item.addClass(activeTabClassName);
  });

  $('.post-toc a').on('click', function (e) {
    e.preventDefault();
    var targetSelector = NexT.utils.escapeSelector(this.getAttribute('href'));
    var offset = $(targetSelector).offset().top;

    hasVelocity ?
      html.velocity('stop').velocity('scroll', {
        offset: offset  + 'px',
        mobileHA: false
      }) :
      $('html, body').stop().animate({
        scrollTop: offset
      }, 500);
  });

  // Expand sidebar on post detail page by default, when post has a toc.
  NexT.motion.middleWares.sidebar = function () {
    var $tocContent = $('.post-toc-content');

    if (CONFIG.sidebar.display === 'post' || CONFIG.sidebar.display === 'always') {
      if ($tocContent.length > 0 && $tocContent.html().trim().length > 0) {
        NexT.utils.displaySidebar();
      }
    }
  };

  // 根据鼠标位置分配滚轮：在左侧栏内时只滚动侧栏，否则只滚动正文
  (function () {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    document.addEventListener('wheel', function (e) {
      var rect = sidebar.getBoundingClientRect();
      var x = e.clientX;
      var y = e.clientY;
      var insideSidebar = rect.width > 0 && rect.height > 0 &&
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (!insideSidebar) return;

      e.preventDefault();
      var scrollable = document.querySelector('#sidebar .sidebar-panel-active .post-all-posts, #sidebar .sidebar-panel-active .post-toc');
      if (scrollable) {
        var nextTop = scrollable.scrollTop + e.deltaY;
        scrollable.scrollTop = Math.max(0, Math.min(nextTop, scrollable.scrollHeight - scrollable.clientHeight));
      }
    }, { passive: false });
  })();
});
