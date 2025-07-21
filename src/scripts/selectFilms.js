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
