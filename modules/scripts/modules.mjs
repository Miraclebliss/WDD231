import byuiCourse from './course.mjs';
import { setSectionSelection } from './section.mjs';
import { setTitle, renderSections } from './output.mjs';

// Set the course title and code
setTitle(byuiCourse);
// Render the sections table
renderSections(byuiCourse.sections);
// Populate the section dropdown
setSectionSelection(byuiCourse.sections);

// Enroll a student
document.querySelector("#enrollStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum, true);
});

// Drop a student
document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum, false);
});