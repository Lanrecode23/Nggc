
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#f5b83d",
                        "background-light": "#f8f7f5",
                        "background-dark": "#221c10",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.5rem",
                        "lg": "1rem",
                        "xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }

const donationButtons = document.querySelectorAll("#donateBtn, a[href='#giving']");
const donationModal = document.getElementById("donationModal");
const donationOverlay = document.getElementById("donationOverlay");
const closeDonation = document.getElementById("closeDonation");
const currentYear = document.getElementById("currentYear")

// OPEN MODAL
donationButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        donationModal.classList.remove("hidden");
        donationOverlay.classList.remove("hidden");

        setTimeout(() => {
            donationModal.classList.remove("opacity-0", "scale-90");
            donationOverlay.classList.remove("opacity-0");
        }, 10);
    });
});

// CLOSE MODAL
function closeModal() {
    donationModal.classList.add("opacity-0", "scale-90");
    donationOverlay.classList.add("opacity-0");

    setTimeout(() => {
        donationModal.classList.add("hidden");
        donationOverlay.classList.add("hidden");
    }, 300);
}

closeDonation.addEventListener("click", closeModal);
donationOverlay.addEventListener("click", closeModal);


// COPY ACCOUNT NUMBER
document.getElementById("copyAcct").addEventListener("click", () => {
    const acct = document.getElementById("acctNumber").innerText;

    navigator.clipboard.writeText(acct).then(() => {
        const msg = document.getElementById("copyMsg");
        msg.classList.remove("opacity-0");

        setTimeout(() => msg.classList.add("opacity-0"), 1500);
    });
});

//Get the current year 
const year = new Date().getFullYear()
currentYear.innerHTML = year