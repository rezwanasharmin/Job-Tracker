
        let currentTab = 'all';

        function getAllCards() {
            return Array.from(document.querySelectorAll('.job-card'));
        }

        
        function countByStatus(status) {
            return getAllCards().filter(card => card.dataset.status === status).length;
        }

        function updateDashboard() {
            const total = getAllCards().length;
            const interviewCount = countByStatus('interview');
            const rejectedCount = countByStatus('rejected');

            document.getElementById('total-count').textContent = total;
            document.getElementById('interview-count').textContent = interviewCount;
            document.getElementById('rejected-count').textContent = rejectedCount;
        }

        function updateSectionCount() {
            const cards = getAllCards();
            let visibleCount;

            if (currentTab === 'all') {
                visibleCount = cards.length;
            } else {
                visibleCount = cards.filter(card => card.dataset.status === currentTab).length;
            }

            const label = visibleCount === 1 ? '1 job' : `${visibleCount} jobs`;
            document.getElementById('section-job-count').textContent = label;
        }

        function renderTab() {
            const cards = getAllCards();
            let visibleCount = 0;

            cards.forEach(card => {
                const status = card.dataset.status;
                let show = false;

                if (currentTab === 'all') {
                    show = true;
                } else if (currentTab === 'interview' && status === 'interview') {
                    show = true;
                } else if (currentTab === 'rejected' && status === 'rejected') {
                    show = true;
                }

                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            const noJobsMsg = document.getElementById('no-jobs-message');
            if (visibleCount === 0) {
                noJobsMsg.classList.remove('hidden');
                if (currentTab === 'interview') {
                    noJobsMsg.querySelector('h2').textContent = 'No interview scheduled';
                    noJobsMsg.querySelector('p').textContent = 'Mark a job as Interview to see it here';
                } else if (currentTab === 'rejected') {
                    noJobsMsg.querySelector('h2').textContent = 'No rejections yet';
                    noJobsMsg.querySelector('p').textContent = 'Jobs marked as Rejected will appear here';
                } else {
                    noJobsMsg.querySelector('h2').textContent = 'No jobs available';
                    noJobsMsg.querySelector('p').textContent = 'Check back soon for new job opportunities';
                }
            } else {
                noJobsMsg.classList.add('hidden');
            }

            updateSectionCount();
        }

        function switchTab(tab) {
            currentTab = tab;

            const tabs = { all: 'tab-all', interview: 'tab-interview', rejected: 'tab-rejected' };
            Object.entries(tabs).forEach(([key, id]) => {
                const btn = document.getElementById(id);
                if (key === tab) {
                    btn.className = 'px-4 py-1.5 cursor-pointer bg-[#3b82f6] text-white text-sm rounded font-medium';
                } else {
                    btn.className = 'px-4 py-1.5 cursor-pointer bg-white border border-slate-200 text-slate-500 text-sm rounded font-medium hover:bg-slate-50';
                }
            });

            renderTab();
        }

        function setStatus(jobId, newStatus) {
            const card = document.getElementById(jobId);
            const currentStatus = card.dataset.status;

            let resolvedStatus = (currentStatus === newStatus) ? 'not-applied' : newStatus;

            card.dataset.status = resolvedStatus;

            const badgeWrapper = card.querySelector('.status-badge');
            let badgeHTML = '';
            if (resolvedStatus === 'interview') {
                badgeHTML = `<span class="bg-[#ecfdf5] text-[#065f46] text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">Interview</span>`;
            } else if (resolvedStatus === 'rejected') {
                badgeHTML = `<span class="bg-[#fef2f2] text-[#991b1b] text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">Rejected</span>`;
            } else {
                badgeHTML = `<span class="bg-[#eff6ff] text-[#1e40af] text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">Not Applied</span>`;
            }
            badgeWrapper.innerHTML = badgeHTML;

            updateDashboard();
            renderTab();
        }

        function deleteJob(jobId) {
            const card = document.getElementById(jobId);
            if (!card) return;
            card.remove();
            updateDashboard();
            renderTab();
        }

        updateDashboard();
        renderTab();