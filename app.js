// ========================================
// BINANCE TRADING COMMUNITY - MAIN APP
// ========================================

class BinanceTradingApp {
    constructor() {
        this.state = {
            currentUser: null,
            isAdmin: false,
            members: [],
            orders: [],
            topInvestors: [],
            walletAddresses: [],
            settings: {
                referralCode: '188207',
                botToken: '',
                chatId: '',
                adminPassword: 'Ouija@188'
            },
            referralCodeValid: false
        };

        this.initializeData();
        this.setupEventListeners();
        this.showLoginPage();
    }

    initializeData() {
        // Initialize sample data
        this.state.topInvestors = [
            { rank: 1, name: 'Crypto Whale', amount: 50000 },
            { rank: 2, name: 'Trading Pro', amount: 35000 },
            { rank: 3, name: 'Bull Rider', amount: 28000 },
            { rank: 4, name: 'Market Master', amount: 22000 },
            { rank: 5, name: 'Bitcoin King', amount: 18000 }
        ];

        this.state.walletAddresses = [
            { id: 1, type: 'Bitcoin', address: '1A1z7agoat1C2t5DjbNMyXZDQnj8XM1sAT', qrCode: '📱' },
            { id: 2, type: 'Ethereum', address: '0x1234567890abcdef1234567890abcdef12345678', qrCode: '📱' },
            { id: 3, type: 'USDT (TRC20)', address: 'TNPeeYw9P8c3Kkfxs1sQQhSVNs8b9RFzXK', qrCode: '📱' }
        ];

        // Load from localStorage if exists
        const saved = localStorage.getItem('binanceAppState');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state = { ...this.state, ...parsed };
        } else {
            this.saveState();
        }
    }

    saveState() {
        localStorage.setItem('binanceAppState', JSON.stringify(this.state));
    }

    setupEventListeners() {
        // Will be populated with event listeners
    }

    // ========== PAGE NAVIGATION ==========

    showPage(pageName) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        const page = document.getElementById(`${pageName}-page`);
        if (page) page.classList.add('active');
    }

    showLoginPage() {
        this.renderLoginPage();
        this.showPage('login');
    }

    showAdminLoginPage() {
        this.renderAdminLoginPage();
        this.showPage('admin-login');
    }

    showDashboard() {
        if (this.state.isAdmin) {
            this.renderAdminDashboard();
            this.showPage('admin-dashboard');
        } else {
            this.renderMemberDashboard();
            this.showPage('member-dashboard');
        }
    }

    // ========== LOGIN PAGE RENDER ==========

    renderLoginPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="page active" id="login-page">
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-logo">B</div>
                        <h2 class="login-title">Binance Trading</h2>
                        <p class="login-subtitle">Member Access Portal</p>
                        
                        <div id="login-message"></div>
                        
                        <form id="login-form">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="login-name" placeholder="Enter your full name" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Telegram Username</label>
                                <input type="text" id="login-telegram" placeholder="@username" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Country / Region</label>
                                <input type="text" id="login-country" placeholder="e.g., United States" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Binance UID</label>
                                <input type="text" id="login-binance-uid" placeholder="Your Binance UID" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Referral Code</label>
                                <input type="text" id="login-referral-code" placeholder="Enter referral code" required>
                            </div>
                            
                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 15px;">
                                Register as Member
                            </button>
                        </form>
                        
                        <hr style="border: none; border-top: 1px solid rgba(240, 185, 11, 0.2); margin: 25px 0;">
                        
                        <button onclick="app.showAdminLoginPage()" class="btn btn-secondary" style="width: 100%;">
                            Admin Access
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Setup login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMemberLogin();
        });
    }

    handleMemberLogin() {
        const referralCode = document.getElementById('login-referral-code').value;
        const messageEl = document.getElementById('login-message');

        if (referralCode !== this.state.settings.referralCode) {
            messageEl.innerHTML = `<div class="alert alert-error">❌ Invalid Referral Code</div>`;
            return;
        }

        const member = {
            id: Date.now(),
            name: document.getElementById('login-name').value,
            telegram: document.getElementById('login-telegram').value,
            country: document.getElementById('login-country').value,
            binanceUid: document.getElementById('login-binance-uid').value,
            joinDate: new Date().toLocaleDateString(),
            membershipLevel: 'Starter',
            totalInvested: 0,
            profitShare: 20,
            estimatedEarnings: 0,
            status: 'active'
        };

        this.state.members.push(member);
        this.state.currentUser = member;
        this.state.isAdmin = false;
        this.saveState();

        messageEl.innerHTML = `<div class="alert alert-success">✅ Registration Successful! Redirecting...</div>`;
        setTimeout(() => this.showDashboard(), 1500);
    }

    // ========== ADMIN LOGIN PAGE RENDER ==========

    renderAdminLoginPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="page active" id="admin-login-page">
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-logo">⚙️</div>
                        <h2 class="login-title">Admin Panel</h2>
                        <p class="login-subtitle">Secure Administrative Access</p>
                        
                        <div id="admin-login-message"></div>
                        
                        <form id="admin-login-form">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" id="admin-username" placeholder="Admin username" value="Admin" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="admin-password" placeholder="Admin password" required>
                            </div>
                            
                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 15px;">
                                Login to Admin Panel
                            </button>
                        </form>
                        
                        <hr style="border: none; border-top: 1px solid rgba(240, 185, 11, 0.2); margin: 25px 0;">
                        
                        <button onclick="app.showLoginPage()" class="btn btn-secondary" style="width: 100%;">
                            Back to Member Login
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        const messageEl = document.getElementById('admin-login-message');

        if (username !== 'Admin' || password !== this.state.settings.adminPassword) {
            messageEl.innerHTML = `<div class="alert alert-error">❌ Invalid Admin Credentials</div>`;
            return;
        }

        this.state.currentUser = { id: 'admin', name: 'Administrator' };
        this.state.isAdmin = true;
        this.saveState();

        messageEl.innerHTML = `<div class="alert alert-success">✅ Admin Login Successful! Redirecting...</div>`;
        setTimeout(() => this.showDashboard(), 1500);
    }

    // ========== MEMBER DASHBOARD ==========

    renderMemberDashboard() {
        const app = document.getElementById('app');
        const member = this.state.currentUser;

        app.innerHTML = `
            <div class="page active" id="member-dashboard">
                <div class="container">
                    ${this.renderHeader()}
                    ${this.renderMemberNav()}
                    <div id="member-content"></div>
                </div>
            </div>
        `;

        this.showMemberOverview();
        this.setupMemberNavigation();
    }

    renderMemberNav() {
        return `
            <div class="nav-container">
                <button class="nav-btn active" onclick="app.showMemberOverview()">Dashboard</button>
                <button class="nav-btn" onclick="app.showPlaceOrder()">Place Order</button>
                <button class="nav-btn" onclick="app.showMyOrders()">My Orders</button>
                <button class="nav-btn" onclick="app.showPaymentWallets()">Payment Wallets</button>
                <button class="nav-btn" onclick="app.showProfile()">Profile</button>
                <button class="nav-btn" onclick="app.logout()">Logout</button>
            </div>
        `;
    }

    setupMemberNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    showMemberOverview() {
        const member = this.state.currentUser;
        const content = document.getElementById('member-content');
        const membershipData = this.getMembershipData();

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${member.totalInvested}</div>
                    <div class="stat-label">Total Invested</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-value">${member.membershipLevel}</div>
                    <div class="stat-label">Membership Level</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💸</div>
                    <div class="stat-value">${member.estimatedEarnings}</div>
                    <div class="stat-label">Estimated Earnings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value">${member.profitShare}%</div>
                    <div class="stat-label">Profit Share</div>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Member Information</div>
                <table>
                    <tr>
                        <td style="color: var(--accent-gold);">Full Name:</td>
                        <td>${member.name}</td>
                    </tr>
                    <tr>
                        <td style="color: var(--accent-gold);">Telegram:</td>
                        <td>${member.telegram}</td>
                    </tr>
                    <tr>
                        <td style="color: var(--accent-gold);">Country:</td>
                        <td>${member.country}</td>
                    </tr>
                    <tr>
                        <td style="color: var(--accent-gold);">Binance UID:</td>
                        <td>${member.binanceUid}</td>
                    </tr>
                    <tr>
                        <td style="color: var(--accent-gold);">Join Date:</td>
                        <td>${member.joinDate}</td>
                    </tr>
                    <tr>
                        <td style="color: var(--accent-gold);">Status:</td>
                        <td><span class="status-badge status-confirmed">${member.status}</span></td>
                    </tr>
                </table>
            </div>

            <div class="card">
                <div class="card-title">Membership Levels & Rewards</div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Membership Level</th>
                                <th>Trading Volume</th>
                                <th>Profit Share</th>
                                <th>Estimated Earnings</th>
                                <th>Total Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Starter</td>
                                <td>$100</td>
                                <td>20%</td>
                                <td>$20</td>
                                <td>$120</td>
                            </tr>
                            <tr>
                                <td>Silver</td>
                                <td>$500</td>
                                <td>30%</td>
                                <td>$150</td>
                                <td>$650</td>
                            </tr>
                            <tr>
                                <td>Gold</td>
                                <td>$1,000</td>
                                <td>40%</td>
                                <td>$400</td>
                                <td>$1,400</td>
                            </tr>
                            <tr>
                                <td>Platinum</td>
                                <td>$3,000</td>
                                <td>50%</td>
                                <td>$1,500</td>
                                <td>$4,500</td>
                            </tr>
                            <tr>
                                <td>VIP Elite</td>
                                <td>$5,000</td>
                                <td>60%</td>
                                <td>$3,000</td>
                                <td>$8,000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getMembershipData() {
        return [
            { level: 'Starter', volume: 100, profit: 20, earnings: 20, total: 120 },
            { level: 'Silver', volume: 500, profit: 30, earnings: 150, total: 650 },
            { level: 'Gold', volume: 1000, profit: 40, earnings: 400, total: 1400 },
            { level: 'Platinum', volume: 3000, profit: 50, earnings: 1500, total: 4500 },
            { level: 'VIP Elite', volume: 5000, profit: 60, earnings: 3000, total: 8000 }
        ];
    }

    showPlaceOrder() {
        const content = document.getElementById('member-content');
        content.innerHTML = `
            <div class="card">
                <div class="card-title">Place New Order</div>
                <form id="order-form">
                    <div class="form-group">
                        <label>Select Cryptocurrency</label>
                        <select id="order-crypto" required>
                            <option value="">-- Select --</option>
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="BNB">Binance Coin (BNB)</option>
                            <option value="USDT">Tether (USDT)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Investment Amount (USD)</label>
                        <input type="number" id="order-amount" placeholder="Enter amount" min="100" required>
                    </div>
                    <div class="form-group">
                        <label>Order Notes</label>
                        <textarea id="order-notes" placeholder="Optional notes..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Order</button>
                </form>
            </div>
        `;

        document.getElementById('order-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
    }

    submitOrder() {
        const crypto = document.getElementById('order-crypto').value;
        const amount = parseFloat(document.getElementById('order-amount').value);
        const notes = document.getElementById('order-notes').value;

        if (!crypto || !amount) return;

        const order = {
            id: Date.now(),
            memberId: this.state.currentUser.id,
            memberName: this.state.currentUser.name,
            crypto: crypto,
            amount: amount,
            notes: notes,
            status: 'Pending',
            createdDate: new Date().toLocaleDateString(),
            approvedBy: null
        };

        this.state.orders.push(order);
        this.saveState();

        const form = document.getElementById('order-form');
        form.insertAdjacentHTML('beforebegin', '<div class="alert alert-success">✅ Order submitted successfully! Admin will review shortly.</div>');
        
        setTimeout(() => {
            form.reset();
            this.showMyOrders();
        }, 2000);
    }

    showMyOrders() {
        const content = document.getElementById('member-content');
        const memberOrders = this.state.orders.filter(o => o.memberId === this.state.currentUser.id);

        let ordersHTML = `
            <div class="card">
                <div class="card-title">My Orders</div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Cryptocurrency</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Approved By</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        if (memberOrders.length === 0) {
            ordersHTML += `<tr><td colspan="5" style="text-align: center; padding: 30px;">No orders yet</td></tr>`;
        } else {
            memberOrders.forEach(order => {
                ordersHTML += `
                    <tr>
                        <td>${order.createdDate}</td>
                        <td>${order.crypto}</td>
                        <td>$${order.amount.toFixed(2)}</td>
                        <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>${order.approvedBy || '-'}</td>
                    </tr>
                `;
            });
        }

        ordersHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        content.innerHTML = ordersHTML;
    }

    showPaymentWallets() {
        const content = document.getElementById('member-content');
        let walletsHTML = `
            <div class="card">
                <div class="card-title">Payment Wallet Addresses</div>
                <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 13px;">Send payments to the wallet address below. Admin can update these anytime.</p>
        `;

        this.state.walletAddresses.forEach(wallet => {
            walletsHTML += `
                <div style="background: rgba(240, 185, 11, 0.05); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin-bottom: 10px;">${wallet.type}</h4>
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; font-family: monospace; word-break: break-all; margin-bottom: 10px; font-size: 12px;">${wallet.address}</div>
                    <button onclick="navigator.clipboard.writeText('${wallet.address}')" class="btn btn-small btn-secondary">📋 Copy Address</button>
                </div>
            `;
        });

        walletsHTML += `</div>`;
        content.innerHTML = walletsHTML;
    }

    showProfile() {
        const member = this.state.currentUser;
        const content = document.getElementById('member-content');

        content.innerHTML = `
            <div class="card">
                <div class="card-title">Member Profile</div>
                <form id="profile-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" value="${member.name}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Telegram Username</label>
                        <input type="text" value="${member.telegram}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Country / Region</label>
                        <input type="text" value="${member.country}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Binance UID</label>
                        <input type="text" value="${member.binanceUid}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Member Since</label>
                        <input type="text" value="${member.joinDate}" disabled>
                    </div>
                    <div style="background: rgba(46, 204, 113, 0.1); border: 1px solid var(--success-green); border-radius: 10px; padding: 15px; color: var(--success-green); font-size: 13px;">
                        ✅ Your account is active and verified
                    </div>
                </form>
            </div>
        `;
    }

    // ========== ADMIN DASHBOARD ==========

    renderAdminDashboard() {
        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="page active" id="admin-dashboard">
                <div class="container">
                    ${this.renderHeader('Admin Control Panel')}
                    ${this.renderAdminNav()}
                    <div id="admin-content"></div>
                </div>
            </div>
        `;

        this.showAdminOverview();
        this.setupAdminNavigation();
    }

    renderHeader(title = '') {
        return `
            <div class="header">
                <div class="logo-container">
                    <div class="binance-logo">B</div>
                </div>
                <div class="crypto-icons">
                    <div class="crypto-icon">₿</div>
                    <div class="crypto-icon">Ξ</div>
                    <div class="crypto-icon">⟡</div>
                    <div class="crypto-icon">💰</div>
                </div>
                <h1 class="header-title">BINANCE TRADING COMMUNITY</h1>
                <h2 class="header-subtitle">${title || 'PROFESSIONAL PROFIT & REWARD PROGRAM'}</h2>
                <p class="header-description">Premium Crypto Investment Ecosystem with Real-time Admin Control</p>
            </div>
        `;
    }

    renderAdminNav() {
        return `
            <div class="nav-container">
                <button class="nav-btn active" onclick="app.showAdminOverview()">Dashboard</button>
                <button class="nav-btn" onclick="app.showAllMembers()">Members</button>
                <button class="nav-btn" onclick="app.showAllOrders()">Orders</button>
                <button class="nav-btn" onclick="app.showTopInvestors()">Top Investors</button>
                <button class="nav-btn" onclick="app.showAdminSettings()">Settings</button>
                <button class="nav-btn" onclick="app.logout()">Logout</button>
            </div>
        `;
    }

    setupAdminNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    showAdminOverview() {
        const content = document.getElementById('admin-content');
        const pendingOrders = this.state.orders.filter(o => o.status === 'Pending').length;
        const totalMembers = this.state.members.length;
        const totalInvested = this.state.orders.reduce((sum, o) => sum + o.amount, 0);

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-value">${totalMembers}</div>
                    <div class="stat-label">Total Members</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <div class="stat-value">${this.state.orders.length}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-value">${pendingOrders}</div>
                    <div class="stat-label">Pending Approval</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💸</div>
                    <div class="stat-value">$${totalInvested.toFixed(0)}</div>
                    <div class="stat-label">Total Invested</div>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Recent Orders Pending Approval</div>
                ${this.renderPendingOrdersTable()}
            </div>
        `;
    }

    renderPendingOrdersTable() {
        const pendingOrders = this.state.orders.filter(o => o.status === 'Pending');

        if (pendingOrders.length === 0) {
            return '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No pending orders</p>';
        }

        let html = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Member</th>
                            <th>Crypto</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        pendingOrders.forEach(order => {
            html += `
                <tr>
                    <td>${order.createdDate}</td>
                    <td>${order.memberName}</td>
                    <td>${order.crypto}</td>
                    <td>$${order.amount.toFixed(2)}</td>
                    <td><span class="status-badge status-pending">Pending</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn" onclick="app.approveOrder(${order.id})">Approve</button>
                            <button class="action-btn edit" onclick="app.editOrderModal(${order.id})">Edit</button>
                            <button class="action-btn delete" onclick="app.rejectOrder(${order.id})">Reject</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        return html;
    }

    showAllMembers() {
        const content = document.getElementById('admin-content');
        let html = `
            <div class="card">
                <div class="card-title">All Members</div>
                <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 13px;">Total Members: ${this.state.members.length}</p>
        `;

        if (this.state.members.length === 0) {
            html += '<p style="text-align: center; padding: 30px; color: var(--text-secondary);">No members registered yet</p>';
        } else {
            html += `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Telegram</th>
                                <th>Country</th>
                                <th>Binance UID</th>
                                <th>Join Date</th>
                                <th>Level</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            this.state.members.forEach(member => {
                html += `
                    <tr>
                        <td>${member.name}</td>
                        <td>${member.telegram}</td>
                        <td>${member.country}</td>
                        <td>${member.binanceUid}</td>
                        <td>${member.joinDate}</td>
                        <td>${member.membershipLevel}</td>
                        <td><span class="status-badge status-confirmed">${member.status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit" onclick="app.editMemberModal(${member.id})">Edit</button>
                                <button class="action-btn delete" onclick="app.deleteMember(${member.id})">Remove</button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        html += '</div>';
        content.innerHTML = html;
    }

    showAllOrders() {
        const content = document.getElementById('admin-content');
        let html = `
            <div class="card">
                <div class="card-title">All Orders</div>
                <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 13px;">Total Orders: ${this.state.orders.length}</p>
        `;

        if (this.state.orders.length === 0) {
            html += '<p style="text-align: center; padding: 30px; color: var(--text-secondary);">No orders yet</p>';
        } else {
            html += `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Member</th>
                                <th>Crypto</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            this.state.orders.forEach(order => {
                const statusClass = `status-${order.status.toLowerCase()}`;
                html += `
                    <tr>
                        <td>${order.createdDate}</td>
                        <td>${order.memberName}</td>
                        <td>${order.crypto}</td>
                        <td>$${order.amount.toFixed(2)}</td>
                        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn" onclick="app.editOrderModal(${order.id})">Edit</button>
                                <button class="action-btn delete" onclick="app.deleteOrder(${order.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        html += '</div>';
        content.innerHTML = html;
    }

    showTopInvestors() {
        const content = document.getElementById('admin-content');
        let html = `
            <div class="card">
                <div class="card-title">Top Investors Leaderboard</div>
                <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 13px;">Highest investors in the system</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Investor Name</th>
                                <th>Total Invested</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        this.state.topInvestors.forEach(investor => {
            html += `
                <tr>
                    <td><span class="rank-badge">${investor.rank}</span></td>
                    <td>${investor.name}</td>
                    <td style="color: var(--accent-gold); font-weight: 600;">$${investor.amount.toLocaleString()}</td>
                    <td><span class="status-badge status-confirmed">Active</span></td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        content.innerHTML = html;
    }

    showAdminSettings() {
        const content = document.getElementById('admin-content');
        const settings = this.state.settings;

        content.innerHTML = `
            <div class="card">
                <div class="card-title">Referral Code Management</div>
                <form id="referral-form">
                    <div class="form-group">
                        <label>Current Referral Code</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="referral-code" value="${settings.referralCode}" placeholder="Enter referral code" required>
                            <button type="submit" class="btn btn-primary">Update</button>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 12px; margin-top: 10px;">💡 Changes apply instantly to all users</p>
                </form>
            </div>

            <div class="card">
                <div class="card-title">Change Admin Password</div>
                <form id="password-form">
                    <div class="form-group">
                        <label>Current Password</label>
                        <input type="password" id="current-password" placeholder="Enter current password" required>
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="new-password" placeholder="Enter new password" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="confirm-password" placeholder="Confirm new password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Password</button>
                </form>
            </div>

            <div class="card">
                <div class="card-title">📨 Telegram Notification Settings</div>
                <form id="telegram-form">
                    <div class="form-group">
                        <label>Bot Token</label>
                        <input type="text" id="bot-token" value="${settings.botToken}" placeholder="Enter Telegram bot token">
                    </div>
                    <div class="form-group">
                        <label>Chat ID</label>
                        <input type="text" id="chat-id" value="${settings.chatId}" placeholder="Enter Chat ID">
                    </div>
                    <div class="form-group">
                        <label>Notification Template</label>
                        <textarea id="notification-template" placeholder="Customize notification message...">New order: {order_type} - Amount: {amount} USD</textarea>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" class="btn btn-primary">Save Settings</button>
                        <button type="button" class="btn btn-secondary" onclick="app.testTelegramNotification()">Test Notification</button>
                    </div>
                </form>
            </div>

            <div class="card">
                <div class="card-title">📦 Wallet Management</div>
                <button onclick="app.showWalletModal()" class="btn btn-primary" style="margin-bottom: 20px;">+ Add New Wallet</button>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        this.state.walletAddresses.forEach(wallet => {
            content.innerHTML += `
                <tr>
                    <td>${wallet.type}</td>
                    <td style="word-break: break-all; font-size: 11px;">${wallet.address}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit" onclick="app.editWalletModal(${wallet.id})">Edit</button>
                            <button class="action-btn delete" onclick="app.deleteWallet(${wallet.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        content.innerHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('referral-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateReferralCode();
        });

        document.getElementById('password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAdminPassword();
        });

        document.getElementById('telegram-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTelegramSettings();
        });
    }

    // ========== ADMIN ACTIONS ==========

    approveOrder(orderId) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (!order) return;

        order.status = 'Confirmed';
        order.approvedBy = 'Admin';
        this.saveState();
        this.broadcastUpdate();
        alert('Order approved and synced to member!');
        this.showAdminOverview();
    }

    rejectOrder(orderId) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (!order) return;

        order.status = 'Rejected';
        this.saveState();
        this.broadcastUpdate();
        alert('Order rejected!');
        this.showAdminOverview();
    }

    deleteOrder(orderId) {
        if (confirm('Delete this order?')) {
            this.state.orders = this.state.orders.filter(o => o.id !== orderId);
            this.saveState();
            this.broadcastUpdate();
            this.showAllOrders();
        }
    }

    deleteMember(memberId) {
        if (confirm('Delete this member?')) {
            this.state.members = this.state.members.filter(m => m.id !== memberId);
            this.state.orders = this.state.orders.filter(o => o.memberId !== memberId);
            this.saveState();
            this.broadcastUpdate();
            this.showAllMembers();
        }
    }

    editOrderModal(orderId) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (!order) return;

        const app = document.getElementById('app');
        if (!document.getElementById('edit-order-modal')) {
            app.innerHTML += `<div id="edit-order-modal" class="modal"></div>`;
        }

        const modal = document.getElementById('edit-order-modal');
        modal.classList.add('active');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Order</h3>
                    <div class="modal-close" onclick="document.getElementById('edit-order-modal').classList.remove('active')">✕</div>
                </div>
                <form id="edit-order-form">
                    <div class="form-group">
                        <label>Cryptocurrency</label>
                        <input type="text" id="edit-order-crypto" value="${order.crypto}" required>
                    </div>
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" id="edit-order-amount" value="${order.amount}" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="edit-order-status">
                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Rejected" ${order.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        `;

        document.getElementById('edit-order-form').addEventListener('submit', (e) => {
            e.preventDefault();
            order.crypto = document.getElementById('edit-order-crypto').value;
            order.amount = parseFloat(document.getElementById('edit-order-amount').value);
            order.status = document.getElementById('edit-order-status').value;
            this.saveState();
            this.broadcastUpdate();
            modal.classList.remove('active');
            alert('Order updated and synced!');
            this.showAllOrders();
        });
    }

    editMemberModal(memberId) {
        const member = this.state.members.find(m => m.id === memberId);
        if (!member) return;

        const app = document.getElementById('app');
        if (!document.getElementById('edit-member-modal')) {
            app.innerHTML += `<div id="edit-member-modal" class="modal"></div>`;
        }

        const modal = document.getElementById('edit-member-modal');
        modal.classList.add('active');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Member</h3>
                    <div class="modal-close" onclick="document.getElementById('edit-member-modal').classList.remove('active')">✕</div>
                </div>
                <form id="edit-member-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="edit-member-name" value="${member.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Membership Level</label>
                        <select id="edit-member-level">
                            <option value="Starter" ${member.membershipLevel === 'Starter' ? 'selected' : ''}>Starter</option>
                            <option value="Silver" ${member.membershipLevel === 'Silver' ? 'selected' : ''}>Silver</option>
                            <option value="Gold" ${member.membershipLevel === 'Gold' ? 'selected' : ''}>Gold</option>
                            <option value="Platinum" ${member.membershipLevel === 'Platinum' ? 'selected' : ''}>Platinum</option>
                            <option value="VIP Elite" ${member.membershipLevel === 'VIP Elite' ? 'selected' : ''}>VIP Elite</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Total Invested</label>
                        <input type="number" id="edit-member-invested" value="${member.totalInvested}" required>
                    </div>
                    <div class="form-group">
                        <label>Profit Share %</label>
                        <input type="number" id="edit-member-profit" value="${member.profitShare}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        `;

        document.getElementById('edit-member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            member.name = document.getElementById('edit-member-name').value;
            member.membershipLevel = document.getElementById('edit-member-level').value;
            member.totalInvested = parseFloat(document.getElementById('edit-member-invested').value);
            member.profitShare = parseFloat(document.getElementById('edit-member-profit').value);
            member.estimatedEarnings = member.totalInvested * member.profitShare / 100;
            this.saveState();
            this.broadcastUpdate();
            modal.classList.remove('active');
            alert('Member updated and synced!');
            this.showAllMembers();
        });
    }

    updateReferralCode() {
        const newCode = document.getElementById('referral-code').value;
        if (!newCode) return;

        this.state.settings.referralCode = newCode;
        this.saveState();
        this.broadcastUpdate();
        alert('✅ Referral code updated! All users must use: ' + newCode);
        this.showAdminSettings();
    }

    updateAdminPassword() {
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;

        if (current !== this.state.settings.adminPassword) {
            alert('❌ Current password is incorrect');
            return;
        }

        if (newPass !== confirm) {
            alert('❌ Passwords do not match');
            return;
        }

        this.state.settings.adminPassword = newPass;
        this.saveState();
        alert('✅ Admin password updated securely');
        this.showAdminSettings();
    }

    saveTelegramSettings() {
        const botToken = document.getElementById('bot-token').value;
        const chatId = document.getElementById('chat-id').value;

        this.state.settings.botToken = botToken;
        this.state.settings.chatId = chatId;
        this.saveState();
        alert('✅ Telegram settings saved');
    }

    testTelegramNotification() {
        alert('📨 Test notification sent! (In production, this would send via Telegram Bot API)');
    }

    showWalletModal() {
        const app = document.getElementById('app');
        if (!document.getElementById('wallet-modal')) {
            app.innerHTML += `<div id="wallet-modal" class="modal"></div>`;
        }

        const modal = document.getElementById('wallet-modal');
        modal.classList.add('active');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Add Wallet Address</h3>
                    <div class="modal-close" onclick="document.getElementById('wallet-modal').classList.remove('active')">✕</div>
                </div>
                <form id="wallet-form">
                    <div class="form-group">
                        <label>Wallet Type</label>
                        <input type="text" id="wallet-type" placeholder="e.g., Bitcoin, Ethereum" required>
                    </div>
                    <div class="form-group">
                        <label>Wallet Address</label>
                        <textarea id="wallet-address" placeholder="Enter wallet address" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Wallet</button>
                </form>
            </div>
        `;

        document.getElementById('wallet-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newWallet = {
                id: Date.now(),
                type: document.getElementById('wallet-type').value,
                address: document.getElementById('wallet-address').value,
                qrCode: '📱'
            };
            this.state.walletAddresses.push(newWallet);
            this.saveState();
            this.broadcastUpdate();
            modal.classList.remove('active');
            alert('✅ Wallet added and synced to all members!');
            this.showAdminSettings();
        });
    }

    editWalletModal(walletId) {
        const wallet = this.state.walletAddresses.find(w => w.id === walletId);
        if (!wallet) return;

        const app = document.getElementById('app');
        if (!document.getElementById('edit-wallet-modal')) {
            app.innerHTML += `<div id="edit-wallet-modal" class="modal"></div>`;
        }

        const modal = document.getElementById('edit-wallet-modal');
        modal.classList.add('active');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Wallet Address</h3>
                    <div class="modal-close" onclick="document.getElementById('edit-wallet-modal').classList.remove('active')">✕</div>
                </div>
                <form id="edit-wallet-form">
                    <div class="form-group">
                        <label>Wallet Type</label>
                        <input type="text" id="edit-wallet-type" value="${wallet.type}" required>
                    </div>
                    <div class="form-group">
                        <label>Wallet Address</label>
                        <textarea id="edit-wallet-address" required>${wallet.address}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Update Wallet</button>
                </form>
            </div>
        `;

        document.getElementById('edit-wallet-form').addEventListener('submit', (e) => {
            e.preventDefault();
            wallet.type = document.getElementById('edit-wallet-type').value;
            wallet.address = document.getElementById('edit-wallet-address').value;
            this.saveState();
            this.broadcastUpdate();
            modal.classList.remove('active');
            alert('✅ Wallet updated and synced to all members!');
            this.showAdminSettings();
        });
    }

    deleteWallet(walletId) {
        if (confirm('Delete this wallet?')) {
            this.state.walletAddresses = this.state.walletAddresses.filter(w => w.id !== walletId);
            this.saveState();
            this.broadcastUpdate();
            alert('✅ Wallet deleted and removed from all members!');
            this.showAdminSettings();
        }
    }

    // ========== REAL-TIME SYNC ==========

    broadcastUpdate() {
        // In a real app, this would emit WebSocket events
        // For now, it simulates real-time updates
        window.dispatchEvent(new CustomEvent('dataUpdated', { detail: this.state }));
    }

    // ========== LOGOUT ==========

    logout() {
        if (confirm('Logout?')) {
            this.state.currentUser = null;
            this.state.isAdmin = false;
            this.saveState();
            this.showLoginPage();
        }
    }
}

// Initialize app
const app = new BinanceTradingApp();