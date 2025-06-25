const socialIconMap = {
    linkedin: 'linkedin',
    github: 'github',
    twitter: 'twitter',
    website: 'globe',
    blog: 'rss',
    default: 'link'
};


document.addEventListener('DOMContentLoaded', () => {
    fetch('public/portfolio.json')
        .then(response => response.json())
        .then(data => {
            const root = document.getElementById('root');
            root.innerHTML = createDashboardLayout(data);

            // Post-render initializations
            lucide.createIcons(); // Render Lucide icons
            initializeMobileMenu();
            initializeScrollSpy();
            initializeThemeSelector();
        });
});

// --- Initializers --- //
function initializeMobileMenu() {
    const menuButton = document.getElementById('menu-button');
    const sidebar = document.getElementById('sidebar');

    if (!menuButton || !sidebar) return;

    const navLinks = sidebar.querySelectorAll('nav a');

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // On mobile, hide the sidebar after a link is clicked.
            if (sidebar.classList.contains('fixed')) {
                sidebar.classList.add('hidden');
            }
        });
    });

    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnMenuButton = menuButton.contains(e.target);
        const isSidebarOverlayVisible = sidebar.classList.contains('fixed') && !sidebar.classList.contains('hidden');

        if (isSidebarOverlayVisible && !isClickInsideSidebar && !isClickOnMenuButton) {
            sidebar.classList.add('hidden');
        }
    });
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav a');
    const mainContent = document.querySelector('.overflow-y-auto');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('bg-gray-200/50', 'text-gray-900', 'font-semibold');
                    link.classList.add('text-gray-500');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('bg-gray-200/50', 'text-gray-900', 'font-semibold');
                        link.classList.remove('text-gray-500');
                    }
                });
            }
        });
    }, { root: mainContent, rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}


// --- Main Layout --- //
function createDashboardLayout(data) {
    return `
        ${createSidebar(data.personal, data.contact)}
        <div class="flex-1 flex flex-col overflow-y-auto">
            ${createHeader(data.personal)}
            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 space-y-8">
                        ${createProfileCard(data.personal, data.summary)}
                        ${createExperienceCard(data.experience)}
                    </div>
                    <div class="lg:col-span-1 space-y-8">
                        ${createSkillsCard(data.skills)}
                        ${createAccoladesCard(data.certifications, data.achievements)}
                        ${createEducationCard(data.education)}
                    </div>
                </div>
                ${createFooter(data.contact)}
                <button id="theme-selector" class="absolute bottom-4 right-4 bg-white/20 backdrop-blur-lg flex items-center justify-center gap-2 p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-200/50">
                    <i data-lucide="palette" class="w-5 h-5"></i>
                    <span class="sr-only">Random Theme</span>
                </button>
            </main>
        </div>
    `;
}

// --- Components --- //
function createSidebar(personal, contact) {
    const navItems = [
        { name: 'Profile', icon: 'layout-dashboard', href: '#profile' },
        { name: 'Experience', icon: 'briefcase', href: '#experience' },
        { name: 'Skills', icon: 'puzzle', href: '#skills' },
        { name: 'Accolades', icon: 'award', href: '#accolades' },
        { name: 'Education', icon: 'graduation-cap', href: '#education' },
    ];

    return `
    <aside id="sidebar" class="fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-lg p-6 flex flex-col z-30 hidden lg:relative lg:flex lg:flex-shrink-0">
        <div class="flex items-center gap-3 mb-10">
            <img src="${personal.avatarUrl}" alt="${personal.name}" class="w-10 h-10 rounded-full object-cover">
            <h1 class="text-2xl font-bold text-gray-800">${personal.name}</h1>
        </div>
        <nav class="flex-1">
            <ul>
                ${navItems.map((item) => `
                    <li>
                        <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-500 hover:bg-gray-200/50">
                            <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                            <span>${item.name}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </nav>
        <div class="mt-auto">
            <div class="flex justify-center items-center gap-4 mb-6">
                ${contact.social.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-blue-500 transition-colors">
                        <i data-lucide="${socialIconMap[link.name.toLowerCase()] || socialIconMap.default}" class="w-5 h-5"></i>
                    </a>
                `).join('')}
            </div>
            <a href="${personal.resumeUrl}" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <i data-lucide="download-cloud" class="w-4 h-4"></i>
                <span>Resume</span>
            </a>
        </div>
    </aside>
    `;
}

function createHeader(personal) {
    return `
    <header class="sticky lg:hidden top-0 z-20 bg-white/70 backdrop-blur-lg shadow-sm px-4 py-3 flex justify-between items-center shadow-sm">
        <div class="flex items-center gap-4">
            <button id="menu-button" class="lg:hidden text-gray-600 hover:text-gray-900">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
            <div>
                <h1 class="text-xl font-bold text-gray-800">${personal.name}</h1>
                <p class="text-sm text-gray-500">${personal.title}</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <a href="${personal.resumeUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <i data-lucide="download-cloud" class="w-4 h-4"></i>
                <span>Resume</span>
            </a>
        </div>
    </header>
    `;
}

function createCard(title, content, id = '', icon = '') {
    return `
    <section id="${id}" class="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 scroll-mt-24">
        <div class="flex items-center gap-3 mb-4">
            <i data-lucide="${icon}" class="w-6 h-6 text-blue-500"></i>
            <h3 class="text-xl font-bold text-gray-800">${title}</h3>
        </div>
        ${content}
    </section>
    `;
}

function createProfileCard(personal, summary) {
    const content = `
        <div class="flex flex-col sm:flex-row items-center gap-6">
            <img src="${personal.avatarUrl}" alt="${personal.name}" class="w-32 h-32 rounded-full object-cover">
            <div class="text-center sm:text-left">
                <h4 class="text-2xl font-bold">${personal.name}</h4>
                <p class="text-gray-600">${personal.title}</p>
                <p class="text-sm text-gray-500 mt-2">${personal.location}</p>
                <div class="flex justify-center sm:justify-start gap-4 mt-4">
                     <a href="mailto:${personal.email}" class="text-sm text-blue-600 hover:underline">${personal.email}</a>
                </div>
            </div>
        </div>
        <div class="text-gray-600 leading-relaxed prose mt-4">${marked.parse(summary)}</div>
    `;
    return createCard('My Profile', content, 'profile', 'user-circle');
}

function createSkillsCard(skills) {
    const content = `
    <div class="space-y-4">
        ${Object.entries(skills).map(([category, list]) => `
            <div>
                <h4 class="font-semibold text-gray-700 mb-2">${category}</h4>
                <div class="flex flex-wrap gap-2">
                    ${list.map(skill => `<span class="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">${skill}</span>`).join('')}
                </div>
            </div>
        `).join('')}
    </div>`;
    return createCard('Skills & Expertise', content, 'skills', 'puzzle');
}

function createExperienceCard(experience) {
    const content = `
    <div class="space-y-8">
        ${experience.map(job => `
            <div class="relative">
                <h4 class="text-lg font-semibold text-gray-900"><a href="${job.url}" target="_blank" rel="noopener noreferrer" class="hover:underline">${job.company}</a></h4>
                <div class="mt-2 space-y-4">
                ${job.roles.map(role => `
                    <div class="pl-4 border-l-2 border-blue-200">
                        <p class="font-semibold text-gray-800">${role.title}</p>
                        <p class="text-sm text-gray-500 mb-1">${role.duration}</p>
                        <div class="text-sm text-gray-600 prose prose-sm max-w-none">${marked.parse(role.description)}</div>
                    </div>
                `).join('')}
                </div>
            </div>
        `).join('')}
    </div>`;
    return createCard('Work Experience', content, 'experience', 'briefcase');
}

function createAccoladesCard(certifications, achievements) {
    const certContent = certifications.length === 0 ? '' : `
        <div>
            <h4 class="text-md font-semibold text-gray-800 mb-3">Certifications</h4>
            <div class="space-y-3">
                ${certifications.map(cert => `
                    <a href="${cert.url}" target="_blank" rel="noopener noreferrer" class="block p-3 bg-white/50 rounded-lg border border-gray-200/80 hover:bg-gray-50 transition-colors">
                        <p class="font-semibold text-gray-800">${cert.name}</p>
                        <p class="text-sm text-gray-500">${cert.issuer}</p>
                    </a>
                `).join('')}
            </div>
        </div>
    `;

    const achieveContent = achievements.length === 0 ? '' : `
        <div>
            <h4 class="text-md font-semibold text-gray-800 mb-3 mt-4">Achievements</h4>
            <div class="space-y-3">
                ${achievements.map(achieve => `
                     <div class="p-3 bg-white/50 rounded-lg border border-gray-200/80">
                        <p class="font-semibold text-gray-800">${achieve.title} <span class="text-sm font-normal text-gray-500">(${achieve.year})</span></p>
                        <div class="prose prose-sm max-w-none text-gray-600 mt-1">${marked.parse(achieve.description)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    return createCard('Accolades & Awards', `<div class="space-y-4">${certContent}${achieveContent}</div>`, 'accolades', 'award');
}

function initializeThemeSelector() {
    const themeButton = document.getElementById('theme-selector');
    if (!themeButton) return;

    const blob1 = document.getElementById('blob-1');
    const blob2 = document.getElementById('blob-2');
    const blob3 = document.getElementById('blob-3');

    if (!blob1 || !blob2 || !blob3) return;

    const themes = [
        ['#ff7e5f', '#feb47b', '#86A8E7'], // Sunset
        ['#56ab2f', '#a8e063', '#4DD0E1'], // Lush
        ['#6a11cb', '#2575fc', '#30E3CA'], // Royal Blue
        ['#ff0084', '#33001b', '#FFD700'], // Neon
        ['#1d2b64', '#f8cdda', '#00B4DB'], // Galaxy
        ['#e53935', '#e35d5b', '#F39C12']  // Fire
    ];

    let currentThemeIndex = 0;

    const applyTheme = (theme) => {
        blob1.style.backgroundColor = theme[0];
        blob2.style.backgroundColor = theme[1];
        blob3.style.backgroundColor = theme[2];
    };

    themeButton.addEventListener('click', () => {
        let newThemeIndex;
        do {
            newThemeIndex = Math.floor(Math.random() * themes.length);
        } while (newThemeIndex === currentThemeIndex);
        
        currentThemeIndex = newThemeIndex;
        applyTheme(themes[currentThemeIndex]);
        // Re-render lucide icons if the button was re-created
        lucide.createIcons();
    });

    // Apply initial theme
    applyTheme(themes[0]);
}

function createFooter(contact) {
    return `
    <footer class="max-w-4xl mx-auto mt-8 py-6 text-center text-gray-500">
        <div class="flex justify-center items-center gap-6 mb-4">
            ${contact.social.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-500 transition-colors">
                    <i data-lucide="${socialIconMap[link.name.toLowerCase()] || socialIconMap.default}" class="w-6 h-6"></i>
                </a>
            `).join('')}
        </div>
        <p class="text-sm">&copy; ${new Date().getFullYear()} Shubham Prakash. All Rights Reserved.</p>
        <p class="text-xs mt-1">${contact.location}</p>
    </footer>
    `;
}

function createEducationCard(education) {
    const content = `
        <div class="space-y-4">
            ${education.map(edu => `
                <div>
                    <h4 class="font-bold text-gray-800">${edu.institution}</h4>
                    <p class="text-sm text-gray-600">${edu.degree} in ${edu.field}</p>
                    <p class="text-sm text-gray-500">${edu.duration}</p>
                </div>
            `).join('')}
        </div>
    `;
    return createCard('Education', content, 'education', 'graduation-cap');
}
