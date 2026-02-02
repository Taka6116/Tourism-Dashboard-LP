// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// スクロール時のヘッダー効果
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// フォームバリデーションと送信処理
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('お問い合わせフォームが見つかりません');
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォーム要素の取得（存在チェック付き）
        const nameField = document.getElementById('name');
        const companyField = document.getElementById('company');
        const emailField = document.getElementById('email');
        
        if (!nameField || !companyField || !emailField) {
            console.error('フォーム要素が見つかりません');
            showErrorMessage('フォームの読み込みに失敗しました。ページを再読み込みしてください。');
            return;
        }
        
        // フォームデータの取得
        const name = nameField.value.trim();
        const company = companyField.value.trim();
        const email = emailField.value.trim();
        
        // from_nameフィールドにnameの値を設定（Web3Forms用）
        const fromNameField = document.getElementById('from_name');
        if (fromNameField) {
            fromNameField.value = name;
        }
        
        // バリデーション
        if (!name) {
            showError('name', 'お名前を入力してください');
            return;
        } else {
            clearError('name');
        }
        
        if (!company) {
            showError('company', '会社名を入力してください');
            return;
        } else {
            clearError('company');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError('email', 'メールアドレスを入力してください');
            return;
        } else if (!emailRegex.test(email)) {
            showError('email', '正しいメールアドレスを入力してください');
            return;
        } else {
            clearError('email');
        }
        
        // 送信ボタンを無効化してローディング状態に
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '送信中...';
        
        // Web3Formsを使用してメール送信（UIの世界観を保つ）
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(async response => {
            let data;
            try {
                data = await response.json();
            } catch (e) {
                // JSONパースエラーの場合
                throw new Error('サーバーからの応答を処理できませんでした');
            }
            
            console.log('Web3Formsレスポンス:', data);
            
            if (response.ok && data.success) {
                // 送信成功メッセージ
                showSuccessMessage();
                // フォームリセット
                contactForm.reset();
            } else {
                throw new Error(data.message || '送信に失敗しました');
            }
        })
        .catch(error => {
            console.error('送信失敗:', error);
            showErrorMessage(error.message || 'メールの送信に失敗しました。しばらくしてから再度お試しください。');
        })
        .finally(() => {
            // 送信ボタンを元に戻す
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
});

// エラー表示関数
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // 既存のエラーメッセージを削除
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // エラースタイルを適用
    field.style.borderColor = '#D0021B';
    
    // エラーメッセージを追加
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#D0021B';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// エラークリア関数
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    field.style.borderColor = '#e0e0e0';
    
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// 成功メッセージ表示関数
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // 既存のメッセージを削除
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background-color: #50C878;
        color: #fff;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
        text-align: center;
        font-weight: bold;
        animation: fadeInUp 0.5s ease-out;
    `;
    successDiv.textContent = 'お問い合わせありがとうございます。担当者よりご連絡いたします。';
    
    form.insertBefore(successDiv, form.firstChild);
    
    // 5秒後にメッセージを削除
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// エラーメッセージ表示関数
function showErrorMessage(message) {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // 既存のメッセージを削除
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #D0021B;
        color: #fff;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
        text-align: center;
        font-weight: bold;
        animation: fadeInUp 0.5s ease-out;
    `;
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    // 5秒後にメッセージを削除
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// スクロールアニメーション（Intersection Observer）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.challenge-box, .solution-block, .metric-card, .onboarding-step, .step-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ダッシュボードタブの切り替え（デモ用）
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// バブルチャートのアニメーション
document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        setTimeout(() => {
            bubble.style.animation = `bubbleFloat 3s ease-in-out infinite`;
            bubble.style.animationDelay = `${index * 0.1}s`;
        }, index * 100);
    });
});

// バブルアニメーション用のCSSを動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes bubbleFloat {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-10px) scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// デバイスモックアップのインタラクティブ効果（システム概要セクション用）
document.querySelectorAll('.device-mockup-small').forEach(device => {
    device.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    device.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});


// 数値カウントアップアニメーション（ダッシュボード用）
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ダッシュボードセクションが表示されたら数値をアニメーション
const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metricValues = entry.target.querySelectorAll('.metric-value');
            metricValues.forEach(metric => {
                const text = metric.textContent;
                const number = parseInt(text.replace(/,/g, ''));
                if (!isNaN(number) && number > 0) {
                    animateValue(metric, 0, number, 2000);
                }
            });
            dashboardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const dashboardSection = document.querySelector('.quantitative-data');
if (dashboardSection) {
    dashboardObserver.observe(dashboardSection);
}

// FAQアコーディオン機能
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // 他のFAQアイテムを閉じる
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // クリックされたアイテムを開く/閉じる
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});
