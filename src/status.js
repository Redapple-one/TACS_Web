document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://api.mcsrvstat.us/3/v6.tacserver.com';

    // 获取所有需要更新的 HTML 元素
    const loadingElement = document.getElementById('loading');
    const errorDisplayElement = document.getElementById('error-display');
    const serverStatusContainer = document.getElementById('server-status-container');

    const serverIcon = document.getElementById('server-icon');
    const serverHostname = document.getElementById('server-hostname');
    const serverStatusIndicator = document.getElementById('server-status-indicator');
    const serverOnlineStatus = document.getElementById('server-online-status');
    const serverIp = document.getElementById('server-ip');
    const serverPort = document.getElementById('server-port');
    const serverVersion = document.getElementById('server-version');
    const serverSoftware = document.getElementById('server-software');
    const serverEULABlocked = document.getElementById('server-eula-blocked');
    const serverMotd = document.getElementById('server-motd');
    const serverPlayersOnline = document.getElementById('server-players-online');
    const serverPlayersMax = document.getElementById('server-players-max');
    const serverPlayersList = document.getElementById('server-players-list');

    const pluginsCard = document.getElementById('plugins-card');
    const serverPlugins = document.getElementById('server-plugins');
    const modsCard = document.getElementById('mods-card');
    const serverMods = document.getElementById('server-mods');
    const infoCard = document.getElementById('info-card');
    const serverInfo = document.getElementById('server-info');

    const debugCacheHit = document.getElementById('debug-cachehit');
    const debugCacheTime = document.getElementById('debug-cachetime');
    const debugCacheExpire = document.getElementById('debug-cacheexpire');

    async function fetchServerStatus() {
        loadingElement.style.display = 'block'; // 显示加载中
        serverStatusContainer.style.display = 'none'; // 隐藏内容
        errorDisplayElement.style.display = 'none'; // 隐藏错误信息

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API Response:', data); // 调试用，查看完整响应

            renderServerData(data);

            loadingElement.style.display = 'none'; // 隐藏加载中
            serverStatusContainer.style.display = 'block'; // 显示内容

        } catch (error) {
            console.error('Failed to fetch server status:', error);
            loadingElement.style.display = 'none'; // 隐藏加载中
            errorDisplayElement.style.display = 'block'; // 显示错误信息
            serverStatusContainer.style.display = 'none'; // 确保内容隐藏
        }
    }

    function renderServerData(data) {
        // --- 服务器在线状态 ---
        if (data.online) {
            serverOnlineStatus.textContent = '在线';
            serverStatusIndicator.className = 'status-indicator status-online';
        } else {
            serverOnlineStatus.textContent = '离线';
            serverStatusIndicator.className = 'status-indicator status-offline';
            // 如果服务器离线，很多数据可能不存在，只显示基本信息
            serverHostname.textContent = data.hostname || '未知服务器';
            serverIp.textContent = data.ip || 'N/A';
            serverPort.textContent = data.port || 'N/A';
            serverVersion.textContent = 'N/A';
            serverSoftware.textContent = 'N/A';
            serverEULABlocked.textContent = 'N/A';
            serverMotd.innerHTML = '服务器当前离线，无法获取消息。';
            serverPlayersOnline.textContent = '0';
            serverPlayersMax.textContent = '0';
            serverPlayersList.innerHTML = '<p>服务器离线，没有在线玩家。</p>';
            pluginsCard.style.display = 'none';
            modsCard.style.display = 'none';
            infoCard.style.display = 'none';
            // 调试信息仍然可以显示
            debugCacheHit.textContent = data.debug?.cachehit ? '是' : '否';
            debugCacheTime.textContent = data.debug?.cachetime ? new Date(data.debug.cachetime * 1000).toLocaleString() : 'N/A';
            debugCacheExpire.textContent = data.debug?.cacheexpire ? new Date(data.debug.cacheexpire * 1000).toLocaleString() : 'N/A';
            return; // 离线则不再渲染后续详细信息
        }

        // --- 服务器图标 ---
        if (data.icon) {
            serverIcon.src = data.icon;
            serverIcon.style.display = 'inline-block';
        } else {
            serverIcon.style.display = 'none';
        }

        // --- 主机名/IP ---
        serverHostname.textContent = data.hostname || data.ip || '未知服务器';
        serverIp.textContent = data.ip || 'N/A';
        serverPort.textContent = data.port || 'N/A';

        // --- 版本信息 ---
        serverVersion.textContent = data.version || data.protocol?.name || '未知';
        serverSoftware.textContent = data.software || '未知';
        serverEULABlocked.textContent = data.eula_blocked !== undefined ? (data.eula_blocked ? '是' : '否') : 'N/A';


        // --- MOTD ---
        if (data.motd && data.motd.clean && data.motd.clean.length > 0) {
            serverMotd.textContent = data.motd.clean.join('\n'); // 使用 clean 字段并用换行符连接
        } else {
            serverMotd.textContent = '无消息。';
        }


        // --- 玩家信息 ---
        serverPlayersOnline.textContent = data.players?.online !== undefined ? data.players.online : '0';
        serverPlayersMax.textContent = data.players?.max !== undefined ? data.players.max : '0';

        if (data.players?.list && data.players.list.length > 0) {
            const playerNames = data.players.list.map(player => `<li>${player.name}</li>`).join('');
            serverPlayersList.innerHTML = `<ul class="players-list">${playerNames}</ul>`;
        } else {
            serverPlayersList.innerHTML = '<p>当前没有在线玩家。</p>';
        }

        // --- 插件 ---
        if (data.plugins && data.plugins.length > 0) {
            pluginsCard.style.display = 'block';
            serverPlugins.innerHTML = data.plugins.map(plugin => `<li>${plugin.name} (${plugin.version || '未知版本'})</li>`).join('');
        } else {
            pluginsCard.style.display = 'none';
        }

        // --- Mod ---
        if (data.mods && data.mods.length > 0) {
            modsCard.style.display = 'block';
            serverMods.innerHTML = data.mods.map(mod => `<li>${mod.name} (${mod.version || '未知版本'})</li>`).join('');
        } else {
            modsCard.style.display = 'none';
        }

        // --- 额外信息 (info) ---
        if (data.info && data.info.clean && data.info.clean.length > 0) {
            infoCard.style.display = 'block';
            serverInfo.textContent = data.info.clean.join('\n');
        } else {
            infoCard.style.display = 'none';
        }

        // --- 调试信息 ---
        debugCacheHit.textContent = data.debug?.cachehit ? '是' : '否';
        debugCacheTime.textContent = data.debug?.cachetime ? new Date(data.debug.cachetime * 1000).toLocaleString() : 'N/A';
        debugCacheExpire.textContent = data.debug?.cacheexpire ? new Date(data.debug.cacheexpire * 1000).toLocaleString() : 'N/A';
    }

    // 页面加载完成后立即获取服务器状态
    fetchServerStatus();

    // 可以添加一个刷新按钮或者定时刷新
    // setInterval(fetchServerStatus, 60000); // 每60秒刷新一次
});
