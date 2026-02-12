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
                document.getElementById('insights-section').style.display = 'none';
                document.getElementById('policies-section').style.display = 'none';
                // サマリーセクション表示時、デフォルトで総合サマリーを表示
                const tabContents = document.querySelectorAll('.demo-tab-content');
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                const activeTab = document.querySelector('.demo-tab.active');
                if (activeTab) {
                    const tabType = activeTab.getAttribute('data-tab');
                    if (tabType === 'overview') {
                        document.getElementById('overview-content').style.display = 'block';
                    } else if (tabType === 'category') {
                        document.getElementById('category-content').style.display = 'block';
                        resetChartAnimation('category-trend-chart');
                    } else if (tabType === 'language-trend') {
                        document.getElementById('language-trend-content').style.display = 'block';
                        resetChartAnimation('language-trend-chart');
                    } else if (tabType === 'speaker') {
                        document.getElementById('speaker-content').style.display = 'block';
                    }
                } else {
                    // デフォルトで総合サマリーを表示
                    document.getElementById('overview-content').style.display = 'block';
                    // 総合サマリータブをアクティブに
                    const overviewTab = document.querySelector('.demo-tab[data-tab="overview"]');
                    if (overviewTab) {
                        document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
                        overviewTab.classList.add('active');
                    }
                }
            } else if (targetSection === 'insights') {
                document.getElementById('summary-section').style.display = 'none';
                document.getElementById('insights-section').style.display = 'block';
                document.getElementById('policies-section').style.display = 'none';
            } else if (targetSection === 'policies') {
                document.getElementById('summary-section').style.display = 'none';
                document.getElementById('insights-section').style.display = 'none';
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
            
            // タブに応じたコンテンツ表示
            const tabType = this.getAttribute('data-tab');
            const summarySection = document.getElementById('summary-section');
            const tabContents = document.querySelectorAll('.demo-tab-content');
            
            // すべてのタブコンテンツを非表示
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // サマリーセクションが表示されている場合のみ、タブコンテンツを切り替え
            if (summarySection && summarySection.style.display !== 'none') {
                if (tabType === 'overview') {
                    document.getElementById('overview-content').style.display = 'block';
                } else if (tabType === 'category') {
                    document.getElementById('category-content').style.display = 'block';
                    // アニメーションをリセットして再実行
                    resetChartAnimation('category-trend-chart');
                } else if (tabType === 'language-trend') {
                    document.getElementById('language-trend-content').style.display = 'block';
                    // アニメーションをリセットして再実行
                    resetChartAnimation('language-trend-chart');
                } else if (tabType === 'speaker') {
                    document.getElementById('speaker-content').style.display = 'block';
                }
            }
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

    // グラフアニメーションをリセットする関数
    function resetChartAnimation(chartClass) {
        const chart = document.querySelector('.' + chartClass);
        if (!chart) return;
        
        // すべての折れ線と円を取得
        const polylines = chart.querySelectorAll('polyline');
        const circles = chart.querySelectorAll('circle');
        
        // アニメーションをリセット
        polylines.forEach(polyline => {
            polyline.style.animation = 'none';
            void polyline.offsetWidth; // リフローを強制
            polyline.style.animation = null;
        });
        
        circles.forEach(circle => {
            circle.style.animation = 'none';
            void circle.offsetWidth; // リフローを強制
            circle.style.animation = null;
        });
    }

    // 初期表示: サマリーセクションを表示
    document.getElementById('summary-section').style.display = 'block';
    document.getElementById('insights-section').style.display = 'none';
    document.getElementById('policies-section').style.display = 'none';
    document.getElementById('overview-content').style.display = 'block';
    
    // サマリーナビゲーションをアクティブに
    const summaryNav = document.querySelector('.demo-nav-item[data-section="summary"]');
    if (summaryNav) {
        navItems.forEach(nav => nav.classList.remove('active'));
        summaryNav.classList.add('active');
    }
    
    // 総合サマリータブをアクティブに
    const overviewTab = document.querySelector('.demo-tab[data-tab="overview"]');
    if (overviewTab) {
        mainTabs.forEach(t => t.classList.remove('active'));
        overviewTab.classList.add('active');
    }
});
