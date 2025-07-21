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
    // —— 1. 先拿到之前那一步存的 persons/orderRepresentative —— 
    const stored = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
    const { persons, orderRepresentative } = stored;
  
    // —— 2. 找到所有“选座购票”按钮 —— 
    const buyBtns = document.querySelectorAll('.buy-btn.normal');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
  
        // —— 3. 抓本行的影片场次信息 —— 
        const tr      = btn.closest('tr');
        const begin   = tr.querySelector('.begin-time').innerText.trim();
        const endText = tr.querySelector('.end-time').innerText.trim();
        const hall    = tr.querySelector('.hall').innerText.trim();
        const movieName = btn.dataset.movieName
          || tr.closest('.show-list')?.querySelector('.movie-title')?.innerText.trim()
          || '哪吒2';
  
        // —— 4. 合并：保留原先的 persons/orderRepresentative，并加上 movieInfo —— 
        const bookingData = {
          persons,                // 团体信息
          orderRepresentative,    // 团体代表
          movieInfo: {
            name: movieName,
            time: `${begin} - ${endText}`,
            hall: hall
          }
        };
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
  
        // —— 5. 跳转到选座页 —— 
        // 假设 href 就是 seatSelection.html
        window.location.href = btn.getAttribute('href');
      });
    });
  });