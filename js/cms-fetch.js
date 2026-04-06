import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

async function fetchCMSData() {
    try {
        const docRef = doc(db, "portfolio", "content");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            const isValid = (val) => typeof val === 'string' && val.trim() !== '';

            // Populate Hero and About Content
            if (isValid(data.firstName) && document.getElementById('cms-display-first-name')) {
                document.getElementById('cms-display-first-name').textContent = data.firstName;
            }
            if (isValid(data.lastName) && document.getElementById('cms-display-last-name')) {
                document.getElementById('cms-display-last-name').textContent = data.lastName;
            }
            if (isValid(data.cvLink) && document.getElementById('cvFrame')) {
                document.getElementById('cvFrame').src = data.cvLink;
            }
            if (isValid(data.expYears) && document.getElementById('cms-display-exp-years')) {
                document.getElementById('cms-display-exp-years').textContent = data.expYears;
            }
            if (isValid(data.bio) && document.getElementById('cms-display-bio')) {
                document.getElementById('cms-display-bio').textContent = data.bio;
            }

            // Populate Typed Titles
            if (isValid(data.titles) && document.getElementById('cms-display-titles')) {
                const titleStr = data.titles;
                document.getElementById('cms-display-titles').textContent = titleStr;
                
                // Re-initialize TypedJS with new data
                if (window.Typed) {
                    const outputEl = document.querySelector('.typed-text-output');
                    if (outputEl) {
                        try {
                            // Clear previous instance and DOM
                            outputEl.innerHTML = '';
                            if (window.typedInstance) {
                                window.typedInstance.destroy();
                            }
                            
                            window.typedInstance = new Typed('.typed-text-output', {
                                strings: titleStr.split(',').map(s => s.trim()),
                                typeSpeed: 100,
                                backSpeed: 20,
                                smartBackspace: false,
                                loop: true
                            });
                        } catch (e) {
                            console.error("Typed js re-init failed", e);
                        }
                    }
                }
            }
            
            // Populate Experience Arrays
            const expList = document.getElementById('cms-experience-list');
            if (expList) {
                let expHtml = '';
                const experiences = [data.exp1, data.exp2].filter(Boolean);
                
                experiences.forEach(exp => {
                    if (exp && isValid(exp.title)) {
                        expHtml += `
                            <div class="col-sm-6 mb-3">
                                <h5>${exp.title}</h5>
                                <h6 class="mb-0 text-dark opacity-75">${exp.company || ''}</h6>
                                <hr class="text-primary my-2">
                                <p class="text-primary fw-bold mb-1">${exp.date || ''}</p>
                                <p class="small text-muted mt-2">${exp.desc || ''}</p>
                            </div>
                        `;
                    }
                });
                
                if (expHtml) {
                    expList.innerHTML = expHtml;
                }
            }

            // Populate Certifications
            const certList = document.getElementById('cms-certifications-list');
            if (certList && isValid(data.certifications)) {
                let certHtml = '';
                // Split string by line breaks and filter empty lines
                const lines = data.certifications.split(/\r?\n/).filter(line => line.trim() !== '');
                
                lines.forEach(cert => {
                    certHtml += `
                        <div class="cert-item d-flex align-items-start mb-3">
                            <i class="fa fa-check-circle text-primary me-2 mt-1 flex-shrink-0"></i>
                            <div>
                                <h6 class="mb-0 fw-semibold">${cert}</h6>
                            </div>
                        </div>
                    `;
                });
                
                if (certHtml) {
                    certList.innerHTML = certHtml;
                }
            }

            console.log("Success: Custom CMS Payload injected dynamically.");

        } else {
            console.log("Firebase CMS: Document 'portfolio/content' does not exist yet.");
        }
    } catch (error) {
        console.error("Error fetching Firebase CMS payload:", error);
    }
}

// Execute the fetcher silently after DOM is ready
document.addEventListener("DOMContentLoaded", fetchCMSData);
fetchCMSData();
