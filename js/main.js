let ktu_grades={
    "S":10,
    "A+":9,
    "A":8.5,
    "B+":8,
    "B":7.5,
    "C+":7,
    "C":6.5,
    "D":6,
    "P":5.5,
    "F":0,
    "FE":0,
    "I":0
}
let score = (sum_sgpa,c) => {
    let cgpa = sum_sgpa/c
    // per = cgpa*9.5
    let per = (cgpa*10)-3.75
    return [cgpa,per]
}

function simplify(){
    let flags = []
    index=0;
    while(index<8){
        index++
        if(!data[`S${index}`])
        break
    }
    
    let sem = ''
    let simple      = []
    let c = 0
    for(i=0;i<index-1;i++){
        sem = `S${i+1}`
        simple[i]=[]
        Object.keys(data[sem]).forEach(n=>{
            if(data[sem][n]['Course']){
                simple[i].push([
                    data[sem][n]['Course'],
                    parseInt(data[sem][n]['Course Credit']),
                    data[sem][n]['Grade']
                ])
                if(ktu_grades[data[sem][n]['Grade']]==0){
                    flags[c]=i
                }
            }
        })
        c++
    }
    
    return [simple,index,flags.filter(n=>n)]

}

function calc(simple,index){
    let sum_credits = []
    let sgpas       = []
    
    let CiGpa_sum=0
    let sum_credit = 0

    for(i=0;i<index-1;i++){
        simple[i].forEach(n=>{
            console.log(n[1])
            CiGpa_sum  +=  n[1] * ktu_grades[n[2]]
            sum_credit +=  n[1]
        })
        sum_credits.push(sum_credit)
        sgpas.push(CiGpa_sum/sum_credit)
        console.log(sum_credit)
        sum_credit=0
        CiGpa_sum=0
    }
    let c=0
    let sum_sgpa=0
    sgpas.forEach(n=>{
        if(!isNaN(n)){
            sum_sgpa+=n
            c++
        }
    })
    let [cgpa,per] = score(sum_sgpa,c)
    return [sgpas.slice(0,c),cgpa,per]
}

let [simple,stopIndex,flags] = simplify() // full array , retrived data length , index of sems with supply

let [sgpas,cgpa,per] = calc(simple,stopIndex) // sgpas 

function getGPA(sgpas){
    let sgpa_sum = 0
    sgpas.forEach(n=>sgpa_sum+=n)
    let [c_gpa,perct] = score(sgpa_sum,sgpas.length)
    document.getElementById('results').innerHTML = ` <h1>Your CGPA : ${c_gpa}</h1>
                                                    <h1>Equllent % : ${perct}%</h1>`
    let table = ''
    table = '<table>'
    table +=  ` <tr>
                    <th>Sem</th>
                    <th>SGPA</th>
                </tr>
                `

    sgpas.forEach((n,i)=>{
        table += `
                    <tr>
                        <td>S${i+1}</td>
                        <td>${n}</td>
                    </tr>
                `
    })
    table += '</table>'
    document.getElementById('results').innerHTML += table 
}
getGPA(sgpas)
document.getElementById('results').innerHTML +=  `<button onclick="start()">
                                                   How my cgpa will change if I passed 
                                                  </button>
                                                    `

let flag_i = 0
let sgpa_sum = 0

function gen(array,x){
    
    let table = `<h1>CGPA until ${x} sem</h1><table>`
    
    array.forEach((n,i)=>{
        table  += `<tr>
                     <td>${n[0]}</td>`
        if(ktu_grades[n[2]]==0){
                table += `
                        <td>
                            <select id="S${flag_i+1}-${i}" onchange="EVAL()">
                                <option value="0">F</option>
                                <option value="S">S</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="P">P</option>
                                <option value="0">FE</option>
                                <option value="0">I</option>
                            </select>
                        <td>
                        `
        }
        else{
            table  += `<td>${n[2]}</td>`
        }
        table  += '</tr>'
    })
    document.getElementById('grades').innerHTML = table
}


function start(){
    sgpas=sgpas.slice(0,flags[flag_i])
    sgpas.forEach(a=>sgpa_sum+=a)
    a=score(sgpa_sum,sgpas.length)
    document.getElementById('results').innerHTML = ''
    gen(simple[flags[flag_i]],sgpas.length)
    getGPA(sgpas)
} 
