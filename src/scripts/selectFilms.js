document.addEventListener('DOMContentLoaded', () => {
  const movies    = document.querySelectorAll('.movie');
  const showLists = document.querySelectorAll('.show-list');

  // —— 点击海报，切影片 —— 
  movies.forEach(movie => {
    movie.addEventListener('click', () => {
      const mIdx = movie.dataset.index;

      // (1) 切海报高亮
      movies.forEach(m => m.classList.toggle('selected', m === movie));

      // (2) 切对应的 show-list 容器
      showLists.forEach(sl => 
        sl.classList.toggle('active', sl.dataset.index === mIdx)
      );

      // (3) 切到新容器后，重置默认日期（第0天）
      const newSL = document.querySelector('.show-list.active');
      if (newSL) {
        // 重置日期按钮
        newSL.querySelectorAll('.date-item').forEach(d =>
          d.classList.toggle('active', d.dataset.index === '0')
        );
        // 重置排期表
        newSL.querySelectorAll('.plist').forEach(p =>
          p.classList.toggle('active', p.dataset.index === '0')
        );
      }
    });
  });

  // —— 点击日期，切排期 —— 
  // 用事件委托，避免多次 querySelectorAll
  showLists.forEach(showList => {
    showList.addEventListener('click', e => {
      if (!e.target.classList.contains('date-item')) return;

      const idx      = e.target.dataset.index;
      const dates    = showList.querySelectorAll('.date-item');
      const plists   = showList.querySelectorAll('.plist');

      // 切按钮高亮
      dates.forEach(d => 
        d.classList.toggle('active', d.dataset.index === idx)
      );
      // 切排期表
      plists.forEach(p => 
        p.classList.toggle('active', p.dataset.index === idx)
      );
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
    // 拿到所有“选座购票”按钮
    const buyBtns = document.querySelectorAll('.buy-btn.normal');
  
    buyBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();  // 先阻止默认跳转
  
        // 从当前行 tr 里抓信息
        const tr      = btn.closest('tr');
        const begin   = tr.querySelector('.begin-time').innerText.trim();     // e.g. "16:20"
        const endText = tr.querySelector('.end-time').innerText.trim();       // e.g. "18:44散场"
        const hall    = tr.querySelector('.hall').innerText.trim();           // e.g. "激光1厅"
        // 电影名：假设你在同一个 show-list 容器里有一个 .movie-title 元素
        // 如果没有，可以把海报的 alt 写到 data-movie-name 上，然后这里取：
        const movieName = btn.dataset.movieName
        || tr.closest('.show-list')?.querySelector('.movie-name')?.innerText.trim()
        || '哪吒2';
  
        // 存到 sessionStorage
        const bookingData = {
          movieInfo: {
            name: movieName,
            time: `${begin} - ${endText}`,
            hall: hall
          }
        };
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
  
        // 再跳转
        window.location.href = btn.getAttribute('href');
      });
    });
  });