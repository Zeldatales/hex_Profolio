
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const wrapper = document.getElementById('card-area');
    const prevBtn = document.querySelector('[data-prev-btn]');
    const nextBtn = document.querySelector('[data-next-btn]');

    if (!wrapper || !prevBtn || !nextBtn) {
      console.warn('必要的 DOM 元素缺失，請確認 HTML 結構正確');
      return;
    }

    const response = await fetch('./js/blogData.json');
    if (!response.ok) {
      throw new Error(`無法載入資料，狀態碼: ${response.status}`);
    }
    const data = await response.json();

    let currentIndex = 0;
    let itemsPerView = window.innerWidth >= 1296 ? 3 : 1;

    function updateButtons() {
      const maxIndex = Math.max(0, data.length - itemsPerView);
      const isPrevDisabled = currentIndex === 0;
      const isNextDisabled = currentIndex >= maxIndex;

      prevBtn.disabled = isPrevDisabled;
      nextBtn.disabled = isNextDisabled;

      const toggleBtnStyle = (btn, disabled) => {
        btn.classList.toggle('border-[#0027D5]', !disabled);
        btn.classList.toggle('border-[#A0B4FF]', disabled);
        btn.classList.toggle('text-white', !disabled);
        btn.classList.toggle('text-gray-400', disabled);
        btn.classList.toggle('bg-primary', true); // always white background
      };

      toggleBtnStyle(prevBtn, isPrevDisabled);
      toggleBtnStyle(nextBtn, isNextDisabled);
    }

    function renderCards(direction = 'right') {
      wrapper.innerHTML = '';
      const visibleCards = data.slice(currentIndex, currentIndex + itemsPerView);

      visibleCards.forEach((blog, index) => {
        const li = document.createElement('li');
        li.className = 'min-w-full xl:min-w-[33.3333%] box-border pr-[0.5rem] opacity-0 transition-all duration-500 ease-in-out';
        li.classList.add(direction === 'right' ? 'translate-x-[30px]' : '-translate-x-[30px]');

        li.innerHTML = `
          <div class="flex flex-col bg-white overflow-hidden">
            <img src="${blog.img}" alt="${blog.title}" class="w-full h-auto object-cover">
            <div class="p-[1.5rem]">
              <time class="block mb-[0.5rem] text-[1rem]">${blog.publishDate}</time>
              <div class="mb-[0.5rem] text-[1.125rem] font-bold text-[#0027D5] leading-snug">
                ${blog.tag.map(tag => `<a href="#" class="mr-[0.5rem]">#${tag}</a>`).join('')}
                ${blog.label ? `<span class="inline-block bg-[#0027D5] text-white text-[0.875rem] px-2 py-0.5 ml-2">${blog.label}</span>` : ''}
              </div>
              <h3 class="text-[1.75rem] font-[700] mb-[0.5rem]">${blog.title}</h3>
              <p class="text-[1.25rem] text-[#4B4B4B] leading-[1.6] line-clamp-2 overflow-hidden">${blog.intro}</p>
              <div class="mt-[1rem]">
                <a href="blogContent.html" class="inline-block border border-black px-[1rem] py-[0.5rem] rounded-full text-[1rem] button-hover hover:text-white transition">閱讀全文</a>
              </div>
            </div>
          </div>
        `;
        wrapper.appendChild(li);

        requestAnimationFrame(() => {
          li.classList.remove('opacity-0');
          li.classList.remove('translate-x-[30px]');
          li.classList.remove('-translate-x-[30px]');
          li.classList.add('opacity-100', 'translate-x-0');
        });
      });

      updateButtons();
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderCards('left');
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < data.length - itemsPerView) {
        currentIndex++;
        renderCards('right');
      }
    });

    window.addEventListener('resize', () => {
      const newItemsPerView = window.innerWidth >= 1296 ? 3 : 1;
      if (newItemsPerView !== itemsPerView) {
        itemsPerView = newItemsPerView;
        currentIndex = Math.min(currentIndex, Math.max(0, data.length - itemsPerView));
        renderCards();
      }
    });

    // 防止動畫過程出現 X 軸卷軸
    document.body.style.overflowX = 'hidden';

    renderCards();

  } catch (err) {
    console.error('初始化部落格精選動畫失敗:', err);
  }
});
