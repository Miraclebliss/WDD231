function setSectionSelection(sections) {
  const sectionSelect = document.querySelector("#sectionNumber");
  // Remove existing options except the first
  
  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.sectionNumber;
    option.textContent = `${section.sectionNumber}`;
    sectionSelect.appendChild(option);
  });
}

export { setSectionSelection };