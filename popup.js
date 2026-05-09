document.getElementById('fillBtn').addEventListener('click', async () => {
  const selectedRating = parseInt(document.getElementById('ratingSelect').value);
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: stealthFillFeedback,
    args: [selectedRating]
  });
});
function stealthFillFeedback(ratingIndex) {
    const isLab = document.body.innerText.toLowerCase().includes("lab manual") || 
                  document.body.innerText.toLowerCase().includes("lab instructor");
    const theoryCommentsMatrix = [
        ["The course was excellently structured.", "Assessments were very fair.", "Instructor was highly engaging.", "Materials were extremely helpful."],
        ["The course was well-structured.", "Assessments were fair.", "Instructor communicated well.", "Materials were helpful."],
        ["The course structure was average.", "Assessments were somewhat fair.", "Instructor communication was okay.", "Materials were adequate."],
        ["The course structure needs improvement.", "Assessments felt unfair at times.", "Instructor communication lacked clarity.", "Materials were insufficient."],
        ["The course was poorly organized.", "Assessments did not reflect the material.", "Instructor was hard to understand.", "Materials were not helpful."]
    ];
    const labCommentsMatrix = [
        ["Lab manuals were exceptionally clear.", "Instructor was extremely supportive.", "Environment was perfect for learning.", "Equipment worked flawlessly."],
        ["Lab manuals were clear.", "Instructor was helpful.", "Environment was good.", "Equipment was functional."],
        ["Lab manuals were adequate.", "Instructor assistance was average.", "Environment was okay.", "Equipment had some minor issues."],
        ["Lab manuals were confusing.", "Instructor was not very helpful.", "Environment was distracting.", "Equipment often malfunctioned."],
        ["Lab manuals were poorly written.", "Instructor was unhelpful.", "Environment was poor.", "Equipment was largely non-functional."]
    ];
    const activeMatrix = isLab ? labCommentsMatrix : theoryCommentsMatrix;
    const safeIndex = (ratingIndex >= 0 && ratingIndex <= 4) ? ratingIndex : 0;
    const selectedComments = activeMatrix[safeIndex];
    document.querySelectorAll('textarea').forEach((area, index) => {
        area.value = selectedComments[index % selectedComments.length];
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
        if (group.length > ratingIndex) {
            group[ratingIndex].checked = true;
        }
    });
    console.log(`Stealth fill complete! Context: ${isLab ? 'Lab' : 'Theory'} | Rating: ${ratingIndex}`);
}