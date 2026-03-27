 const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";

const credentials = btoa("coalition:skills-test");
    

fetch(API_URL, {
    method: "GET",
    headers: {
    "Authorization": `Basic ${credentials}`
}
})
.then(res => res.json())
.then(data => {
    console.log("API Data:", data);

    if( !Array.isArray(data)) {
        console.log("Invalid response:", data);
        return;
    }

    const patient = data.find(p => p.name === "Jessica Taylor");

     if (!patient){
        console.log("Patient not found");
        return;
     }

     loadProfile(patient);
     loadVitals(patient);
     loadTable(patient);
     loadChart(patient);
    })
    .catch(err => console.log("Error:", err));


    function loadProfile(p) {
        const nameE1 = document.getElementById("name");
        const dobE1 = document.getElementById("dob");
        const genderE1 =document.getElementById("gender");
        const imgE1 =document.getElementById("profileImg");


        if (nameE1) nameE1.textContent = p.name;
        if (dobE1) dobE1.textContent = "DOB: " + p.date_of_birth;
        if (genderE1) genderE1.textContent = "Gender: " + p.gender;

      if (imgE1)  imgE1.src = p.profile_picture;
      }
    


    function loadVitals(p) {
        const latest = p.diagnosis_history[0];

        const respiratoryE1 = document.getElementById("respiratory");
        const tempE1 = document.getElementById("temperature");
        const heartE1 = document.getElementById("heart");

        if (!respiratoryE1 || !tempE1 || !heartE1){
            console.log("Vitals elements missing");
            return;
        }

        const respiratory = latest.respiratory_rate?.value ?? latest.respiratory_rate;

        
        const temperature = latest.temperature?.value ?? latest.temperature;

        
        const heart = latest.heart_rate?.value ?? latest.heart_rate;

        respiratoryE1.innerHTML =`
         <h4>Respiratory Rate</h4> 
          <p>${respiratory} <span>bpm</span></p>`;

        tempE1.innerHTML =`<h4>Temperature</h4>  
        <p>${temperature} \u00B0F</p>`;

        heartE1.innerHTML =` <h4>Heart Rate</h4> 
         <p>${heart} <span>bpm</span></p>`;
    }
        function loadTable(p) {
            const tbody = document.querySelector("#diagnosticTable tbody");

            if (!tbody) return;

            tbody.innerHTML = "";

            p.diagnostic_list.forEach(item => {
                const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.status}</td>
                </tr>`;
                tbody.innerHTML +=row;
            });  
        }

        function loadChart(p) {
            const labels = p.diagnosis_history.map(d => d.month);

            const systolic = p.diagnosis_history.map(
                d => d.blood_pressure.systolic?.value ?? d.blood_pressure.systolic
            );

            const diastolic = p.diagnosis_history.map(
                d => d.blood_pressure.diastolic?.value ?? d.blood_pressure.diastolic
            );

            const ctx = document.getElementById("bpChart");

            if (!ctx) {
                console.log("Chart canvas not found");
                return;
            }

            new Chart(ctx, {
                type: "line",
                data: {
                    labels,
                    datasets: [
                                {
                                    label: "Systolic",
                                    data: systolic,
                                    borderColor: "#3b82f6",
                                    backgroundColor: "rgba(59,130,246,0.2)",
                                    tension: 0.4
                                },
                                {
                                    label: "Diastolic",
                                    data: diastolic,
                                    borderColor: "#ef4444",
                                    backgroundColor: "rgba(239,68,68,0.2)",
                                    tension: 0.4
                                }
                            ]
                        },
                                options: {
                                    responsive:true
                                }
                        });
                    }
                
