document.getElementById('fillBtn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: stealthFillFeedback,
  });
});
function stealthFillFeedback() {
    const isLab = document.body.innerText.toLowerCase().includes("lab manual") || 
                  document.body.innerText.toLowerCase().includes("lab instructor");
    const comments = isLab ? 
        ["Detailed lab manuals.", "Helpful instructor.", "Good environment.", "Functional equipment."] : 
        ["Well-organized course.", "Fair assessments.", "Clear communication.", "Helpful materials."];
    document.querySelectorAll('textarea').forEach((area, index) => {
        area.value = comments[index % comments.length];
        area.dispatchEvent(new Event('input', { bubbles: true })); 
    });
    const allRadios = document.querySelectorAll('input[type="radio"]');
    const groupedByName = {};
    allRadios.forEach(radio => {
        if (!groupedByName[radio.name]) {
            groupedByName[radio.name] = [];
        }
        groupedByName[radio.name].push(radio);
    });
    Object.values(groupedByName).forEach(group => {
        if (group.length > 0) {
            group[0].checked = true;
        }
    });
    console.log("Stealth fill complete! Please verify visually and click Submit manually.");
}