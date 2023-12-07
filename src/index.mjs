import "./styles.css";
const apiEndpoints = [
  "https://ngr235-3001.csb.app/entries",
  "https://ngr235-3001.csb.app/experience",
];

const toJson = (response) => response.json();
const fetchData = async (url = "") => {
  const response = await fetch(url);
  const result = await toJson(response);
  return result;
};

const promises = apiEndpoints.map((endpoint) => fetchData(endpoint));

const displayResponseData = (data = [], displayEntity = "") => {
  const preElement = document.getElementById(displayEntity);
  if (preElement) {
    preElement.innerHTML = JSON.stringify(data, null, 4);
  }
};

// const checkValuePresent = (data, value, key) =>
//   (data || [])?.some((test) => test[key] === value);

const reduceStudentsResponse = (entries, experinces) => {
  return entries.reduce((student, current) => {
    const findStudentExperience = experinces.find(
      (studentExperience) => studentExperience?.id === current.id,
    );
    student.push({ ...current, ...findStudentExperience });
    return student;
  }, []);
};

const displayStudentDetails = () => {
  Promise.all(promises).then(([entriesResponse, experienceResponse]) => {
    console.log(entriesResponse, experienceResponse);
    displayResponseData(entriesResponse, "entries");
    displayResponseData(experienceResponse, "values");

    const studentReduced = reduceStudentsResponse(
      entriesResponse,
      experienceResponse,
    );
    displayResponseData(studentReduced, "students");
    displayStudentDataTable(studentReduced);
  });
};

const displayStudentDataTable = (students = []) => {
  const container = document.getElementById("student-table");
  const tableTitles = Object.keys((students || [])?.[0]);
  const template = `
    <table>
  	    <tr>
            ${tableTitles.map((title) => `<th>${title}</th>`).join("")}
        </tr>
          ${students
            .map(
              (entries) =>
                `<tr>
          <td>${entries?.name}</td>
          <td>${entries?.id}</td>
          <td>${entries?.years}</td>
          </tr>
          `,
            )
            .join(" ")}
    </table>
  `;

  container.innerHTML = template;
};

displayStudentDetails();
