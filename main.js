document.addEventListener('DOMContentLoaded', () => {
    console.log(`
      _________   ______                                   
     /_  __/   | / ____/    ________  ______   _____  _____
      / / / /| |/ /  ______/ ___/ _ \\/ ___/ | / / _ \\/ ___/
     / / / ___ / /__/_____(__  )  __/ /   | |/ /  __/ /    
    /_/ /_/  |_\\____/    /____/\\___/_/    |___/\\___/_/    
    ---------------------------------------------------------
    © 𝟮𝟬𝟮𝟰 𝙍𝙚𝙙𝙖𝙥𝙥𝙡𝙚_𝙤𝙣𝙚. 𝘼𝙡𝙡 𝙧𝙞𝙜𝙝𝙩𝙨 𝙧𝙚𝙨𝙚𝙧𝙫𝙚𝙙.                                               
    `)
    const menuToggle = document.querySelector('input.navbar-menu');
    const navbarMenuBlock = document.querySelector('.navbar-menu\\:block');
    const navbarNavbar = document.querySelector('.navbar-menu\\:nav');
    const mobileNavbar = document.querySelector('.mobile-navbar');
    let isMobileNavbarVisible = false;
    let isMenuVisible = false;
    let resizeScheduled = false;

    // 检查可见性
    const checkMobileNavbarVisibility = () => {
        const newVisibility = mobileNavbar.offsetWidth > 0 && mobileNavbar.offsetHeight > 0; 
        if (newVisibility !== isMobileNavbarVisible) {
            isMobileNavbarVisible = newVisibility;
            return true;
        }
        return false;
    };

    // 更新菜单显示
    const toggleMenu = () => {
        if (isMobileNavbarVisible) {
            const shouldShow = menuToggle.checked;
            if (shouldShow !== isMenuVisible) {
                navbarMenuBlock.classList.toggle('visible', shouldShow);
                navbarNavbar.classList.toggle('visible', shouldShow);
                isMenuVisible = shouldShow;
            }
        }
    };

    // 防抖处理
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // 使用requestAnimationFrame
    const onResize = () => {
        if (!resizeScheduled) {
            resizeScheduled = true;
            requestAnimationFrame(() => {
                if (checkMobileNavbarVisibility()) {
                    toggleMenu();
                }
                resizeScheduled = false;
            });
        }
    };

    // 初始调用
    checkMobileNavbarVisibility();
    toggleMenu();

    // 监听切换按钮状态变化
    menuToggle.addEventListener('change', toggleMenu);

    // 使用防抖的resize监听
    window.addEventListener('resize', debounce(onResize, 100));
});
