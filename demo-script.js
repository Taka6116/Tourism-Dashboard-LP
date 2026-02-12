// デモページ用のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // サイドバーナビゲーション
    const navItems = document.querySelectorAll('.demo-nav-item');
    const sections = document.querySelectorAll('.demo-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブ状態を更新
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // セクションを表示/非表示
            const targetSection = this.getAttribute('data-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });

            if (targetSection === 'summary') {
                document.getElementById('summary-section').style.display = 'block';
            } else if (targetSection === 'insights') {
                document.getElementById('insights-section').style.display = 'block';
            } else if (targetSection === 'policies') {
                document.getElementById('policies-section').style.display = 'block';
            }
        });
    });

    // メインタブ
    const mainTabs = document.querySelectorAll('.demo-tab');
    
    mainTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            mainTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // タブに応じたコンテンツ表示（必要に応じて実装）
            const tabType = this.getAttribute('data-tab');
            console.log('Selected tab:', tabType);
        });
    });

    // インサイトタブ
    const insightTabs = document.querySelectorAll('.demo-insight-tab');
    
    insightTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            insightTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 施策タブ
    const policyTabs = document.querySelectorAll('.demo-policy-tab');
    
    policyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            policyTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // エクスポートボタン
    const exportBtn = document.querySelector('.demo-export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('エクスポート機能はデモ版では利用できません。');
        });
    }

    // 初期表示: インサイトセクションを表示
    document.getElementById('insights-section').style.display = 'block';
});
